import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import Input from './Input';
import Icon from '../AppIcon';

const LoginForm = ({ onClose, onSwitchToSignup, redirectToCheckout = false }) => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { error } = await signIn(formData?.email, formData?.password);
      
      if (error) {
        if (error?.message?.includes('Invalid login credentials')) {
          setError('Email ou senha incorretos. Verifique seus dados e tente novamente.');
        } else if (error?.message?.includes('Email not confirmed')) {
          setError('Por favor, confirme seu email antes de fazer login.');
        } else {
          setError(error?.message || 'Erro ao fazer login. Tente novamente.');
        }
        return;
      }

      // Login successful
      onClose?.();
      
      // Handle different flows
      if (redirectToCheckout) {
        // Redirect to checkout if came from payment flow
        const searchParams = new URLSearchParams(window.location.search);
        const sessionId = searchParams?.get('session');
        const checkoutUrl = sessionId 
          ? `/payment-checkout?session=${sessionId}`
          : '/payment-checkout';
        navigate(checkoutUrl);
      } else {
        // Normal login flow - check user role
        navigate('/admin-dashboard');
      }
      
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
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary">
          {redirectToCheckout ? 'Entre para finalizar a compra' : 'Entrar na Conta'}
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          {redirectToCheckout 
            ? 'Faça login para prosseguir com o pagamento' :'Entre com suas credenciais para acessar sua conta'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="Digite sua senha"
            value={formData?.password}
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

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !formData?.email || !formData?.password}
          loading={isLoading}
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Não tem uma conta?{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-primary hover:text-primary/80 font-medium"
          >
            Criar conta
          </button>
        </p>
      </div>
      
      <div className="mt-4 p-3 bg-muted/30 rounded-lg">
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Shield" size={16} />
          <span>Login seguro e protegido</span>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;