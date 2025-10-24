import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const PaymentForm = ({ onSubmit, isLoading, product }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    acceptTerms: false,
    acceptMarketing: false
  });

  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [errors, setErrors] = useState({});

  const validateCPF = (cpf) => {
    const cleanCPF = cpf?.replace(/\D/g, '');
    return cleanCPF?.length === 11;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex?.test(email);
  };

  const validatePhone = (phone) => {
    const cleanPhone = phone?.replace(/\D/g, '');
    return cleanPhone?.length >= 10;
  };

  const formatCPF = (value) => {
    const cleanValue = value?.replace(/\D/g, '');
    return cleanValue?.replace(/(\d{3})(\d)/, '$1.$2')?.replace(/(\d{3})(\d)/, '$1.$2')?.replace(/(\d{3})(\d{1,2})/, '$1-$2')?.replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value) => {
    const cleanValue = value?.replace(/\D/g, '');
    return cleanValue?.replace(/(\d{2})(\d)/, '($1) $2')?.replace(/(\d{5})(\d)/, '$1-$2')?.replace(/(-\d{4})\d+?$/, '$1');
  };

  const handleInputChange = (field, value) => {
    let formattedValue = value;
    
    if (field === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (field === 'phone') {
      formattedValue = formatPhone(value);
    }

    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }));

    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData?.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData?.phone?.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!validatePhone(formData?.phone)) {
      newErrors.phone = 'Telefone inválido';
    }

    if (!formData?.cpf?.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!validateCPF(formData?.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    if (!formData?.acceptTerms) {
      newErrors.acceptTerms = 'Você deve aceitar os termos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        paymentMethod
      });
    }
  };

  const paymentMethods = [
    {
      id: 'stripe',
      name: 'Cartão de Crédito',
      icon: 'CreditCard',
      description: 'Visa, Mastercard, Elo',
      popular: true
    },
    {
      id: 'pix',
      name: 'PIX',
      icon: 'QrCode',
      description: 'Pagamento instantâneo'
    }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Escolha a forma de pagamento
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {paymentMethods?.map((method) => (
            <button
              key={method?.id}
              type="button"
              onClick={() => setPaymentMethod(method?.id)}
              className={`relative p-4 border-2 rounded-lg transition-micro text-left ${
                paymentMethod === method?.id
                  ? 'border-primary bg-primary bg-opacity-5' :'border-border hover:border-primary hover:border-opacity-50'
              }`}
            >
              {method?.popular && (
                <span className="absolute -top-2 left-4 bg-success text-success-foreground text-xs px-2 py-1 rounded-full font-medium">
                  Mais usado
                </span>
              )}
              <div className="flex items-center space-x-3">
                <Icon 
                  name={method?.icon} 
                  size={20} 
                  color={paymentMethod === method?.id ? 'var(--color-primary)' : 'var(--color-text-secondary)'} 
                />
                <div>
                  <div className="font-medium text-text-primary">{method?.name}</div>
                  <div className="text-sm text-text-secondary">{method?.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Seus dados pessoais
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nome completo"
            type="text"
            placeholder="Digite seu nome completo"
            value={formData?.name}
            onChange={(e) => handleInputChange('name', e?.target?.value)}
            error={errors?.name}
            required
            className="sm:col-span-2"
          />

          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            value={formData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            error={errors?.email}
            required
          />

          <Input
            label="Telefone"
            type="tel"
            placeholder="(11) 99999-9999"
            value={formData?.phone}
            onChange={(e) => handleInputChange('phone', e?.target?.value)}
            error={errors?.phone}
            required
          />

          <Input
            label="CPF"
            type="text"
            placeholder="000.000.000-00"
            value={formData?.cpf}
            onChange={(e) => handleInputChange('cpf', e?.target?.value)}
            error={errors?.cpf}
            required
            className="sm:col-span-2"
          />
        </div>
      </div>
      {/* Terms and Marketing */}
      <div className="space-y-4">
        <Checkbox
          label="Aceito os termos de uso e política de privacidade"
          checked={formData?.acceptTerms}
          onChange={(e) => handleInputChange('acceptTerms', e?.target?.checked)}
          error={errors?.acceptTerms}
          required
        />

        <Checkbox
          label="Quero receber dicas de estudos e ofertas especiais por email"
          checked={formData?.acceptMarketing}
          onChange={(e) => handleInputChange('acceptMarketing', e?.target?.checked)}
        />
      </div>
      {/* Security Notice */}
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={20} color="var(--color-success)" className="mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-text-primary mb-1">Pagamento 100% seguro</h4>
            <p className="text-sm text-text-secondary">
              Seus dados são protegidos com criptografia SSL de 256 bits. 
              Processamento via Stripe com conformidade PCI DSS.
            </p>
          </div>
        </div>
      </div>
      {/* Submit Button */}
      <Button
        type="submit"
        variant="success"
        size="lg"
        fullWidth
        loading={isLoading}
        disabled={isLoading}
        iconName="Lock"
        iconPosition="left"
      >
        {isLoading ? 'Processando pagamento...' : `Pagar ${product?.price ? `R$ ${product?.price?.toFixed(2)?.replace('.', ',')}` : 'R$ 4,90'}`}
      </Button>
      {/* Additional Security Info */}
      <div className="text-center">
        <p className="text-xs text-text-secondary">
          Ao finalizar a compra, você receberá o material por email em até 5 minutos
        </p>
        <p className="text-xs text-text-secondary mt-1">
          🔒 Pagamento processado de forma segura pela Stripe
        </p>
      </div>
    </form>
  );
};

export default PaymentForm;