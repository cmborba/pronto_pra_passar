import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import Input from './Input';
import Icon from '../AppIcon';

const SignupForm = ({ onClose, onSwitchToLogin, redirectToCheckout = false }) => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (formData?.password !== formData?.confirmPassword) {
      setError('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    if (formData?.password?.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signUp(formData?.email, formData?.password, {
        data: {
          full_name: formData?.fullName,
          role: 'user'
        }
      });
      
      if (error) {
        if (error?.message?.includes('User already registered')) {
          setError('Este email já está cadastrado. Tente fazer login.');
        } else if (error?.message?.includes('Invalid email')) {
          setError('Email inválido. Verifique o formato do email.');
        } else if (error?.message?.includes('Password should be')) {
          setError('A senha deve ter pelo menos 6 caracteres.');
        } else {
          setError(error?.message || 'Erro ao criar conta. Tente novamente.');
        }
        return;
      }

      setSuccess('Conta criada com sucesso! Redirecionando...');
      
      // Clear form
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      // Handle different flows
      setTimeout(() => {
        onClose?.();
        
        if (redirectToCheckout) {
          // Redirect to checkout if came from payment flow
          const searchParams = new URLSearchParams(window.location.search);
          const sessionId = searchParams?.get('session');
          const checkoutUrl = sessionId 
            ? `/payment-checkout?session=${sessionId}`
            : '/payment-checkout';
          navigate(checkoutUrl);
        } else {
          // Normal signup flow - user is automatically logged in
          navigate('/quiz-landing-page');
        }
      }, 1500);

    } catch (error) {
      setError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Criar Conta</h2>
        <p className="text-sm text-muted-foreground mt-2">
          {redirectToCheckout 
            ? 'Crie sua conta para finalizar o pagamento' :'Preencha os dados para criar sua conta gratuita'
          }
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            name="fullName"
            placeholder="Nome completo"
            value={formData?.fullName}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <Input
            type="email"
            name="email"
            placeholder="Digite seu email"
            value={formData?.email}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <Input
            type="password"
            name="password"
            placeholder="Crie uma senha (mín. 6 caracteres)"
            value={formData?.password}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirme sua senha"
            value={formData?.confirmPassword}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="AlertCircle" size={16} className="text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-destructive text-sm">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="CheckCircle" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !formData?.fullName || !formData?.email || !formData?.password || !formData?.confirmPassword}
          loading={isLoading}
        >
          {isLoading ? 'Criando conta...' : 'Criar Conta'}
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Já tem uma conta?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-primary hover:text-primary/80 font-medium"
          >
            Fazer login
          </button>
        </p>
      </div>
      
      <div className="mt-4 p-3 bg-muted/30 rounded-lg">
        <p className="text-xs text-muted-foreground text-center">
          Ao criar uma conta, você concorda com nossos termos de uso e política de privacidade.
          <br />
          <strong>Não é necessário confirmar email - você será logado automaticamente!</strong>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;