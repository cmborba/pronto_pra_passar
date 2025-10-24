import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentError = ({ errorData, onRetry, onGoBack }) => {
  const mockErrorData = {
    errorCode: "PAYMENT_DECLINED",
    errorMessage: "Cartão recusado pela operadora",
    orderId: "PPP-2025-001248",
    suggestions: [
      "Verifique os dados do cartão",
      "Tente outro cartão",
      "Entre em contato com seu banco",
      "Use PIX ou boleto como alternativa"
    ],
    supportContact: "suporte@prontoprapassar.com.br"
  };

  const error = errorData || mockErrorData;

  const getErrorIcon = (errorCode) => {
    switch (errorCode) {
      case 'PAYMENT_DECLINED':
        return 'CreditCard';
      case 'NETWORK_ERROR':
        return 'Wifi';
      case 'TIMEOUT':
        return 'Clock';
      default:
        return 'AlertTriangle';
    }
  };

  const getErrorTitle = (errorCode) => {
    switch (errorCode) {
      case 'PAYMENT_DECLINED':
        return 'Pagamento recusado';
      case 'NETWORK_ERROR':
        return 'Erro de conexão';
      case 'TIMEOUT':
        return 'Tempo esgotado';
      default:
        return 'Erro no pagamento';
    }
  };

  const getErrorDescription = (errorCode) => {
    switch (errorCode) {
      case 'PAYMENT_DECLINED':
        return 'Seu cartão foi recusado pela operadora. Isso pode acontecer por diversos motivos.';
      case 'NETWORK_ERROR':
        return 'Houve um problema de conexão durante o processamento do pagamento.';
      case 'TIMEOUT':
        return 'O pagamento demorou mais que o esperado e foi cancelado por segurança.';
      default:
        return 'Ocorreu um erro inesperado durante o processamento do seu pagamento.';
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Error Icon */}
      <div className="w-20 h-20 bg-error rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon name={getErrorIcon(error?.errorCode)} size={40} color="white" />
      </div>
      {/* Error Message */}
      <h1 className="text-3xl font-bold text-text-primary mb-4">
        {getErrorTitle(error?.errorCode)}
      </h1>
      <p className="text-lg text-text-secondary mb-2">
        {getErrorDescription(error?.errorCode)}
      </p>
      <p className="text-sm text-error mb-8">
        {error?.errorMessage}
      </p>
      {/* Error Details Card */}
      <div className="bg-surface border border-border rounded-lg p-6 mb-8 text-left">
        <h3 className="text-lg font-semibold text-text-primary mb-4 text-center">
          Detalhes do erro
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Código do erro:</span>
            <span className="font-mono text-error">{error?.errorCode}</span>
          </div>
          
          {error?.orderId && (
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">ID da tentativa:</span>
              <span className="font-mono text-text-primary">{error?.orderId}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Data/Hora:</span>
            <span className="text-text-primary">
              {new Date()?.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>
      </div>
      {/* Suggestions */}
      <div className="bg-warning bg-opacity-10 border border-warning border-opacity-20 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Icon name="Lightbulb" size={24} color="var(--color-warning)" />
          <h3 className="text-lg font-semibold text-text-primary">
            O que você pode fazer
          </h3>
        </div>
        
        <div className="space-y-3 text-left">
          {error?.suggestions?.map((suggestion, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-warning text-warning-foreground rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                {index + 1}
              </div>
              <p className="text-text-primary">{suggestion}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Alternative Payment Methods */}
      <div className="bg-muted rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Formas de pagamento alternativas
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-4 bg-background rounded-lg border border-border">
            <Icon name="QrCode" size={32} color="var(--color-primary)" className="mb-2" />
            <span className="text-sm font-medium text-text-primary">PIX</span>
            <span className="text-xs text-text-secondary">Aprovação imediata</span>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-background rounded-lg border border-border">
            <Icon name="FileText" size={32} color="var(--color-primary)" className="mb-2" />
            <span className="text-sm font-medium text-text-primary">Boleto</span>
            <span className="text-xs text-text-secondary">1-2 dias úteis</span>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-background rounded-lg border border-border">
            <Icon name="CreditCard" size={32} color="var(--color-primary)" className="mb-2" />
            <span className="text-sm font-medium text-text-primary">Outro cartão</span>
            <span className="text-xs text-text-secondary">Aprovação imediata</span>
          </div>
        </div>
      </div>
      {/* Support Information */}
      <div className="bg-primary bg-opacity-10 border border-primary border-opacity-20 rounded-lg p-4 mb-8">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Icon name="MessageCircle" size={20} color="var(--color-primary)" />
          <span className="font-medium text-text-primary">Precisa de ajuda?</span>
        </div>
        <p className="text-sm text-text-secondary mb-2">
          Nossa equipe está pronta para ajudar você
        </p>
        <p className="text-sm text-primary font-medium">
          {error?.supportContact}
        </p>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="outline"
          onClick={onGoBack}
          iconName="ArrowLeft"
          iconPosition="left"
        >
          Voltar
        </Button>
        
        <Button
          variant="default"
          onClick={onRetry}
          iconName="RefreshCw"
          iconPosition="left"
        >
          Tentar novamente
        </Button>
      </div>
      {/* Footer Note */}
      <div className="mt-8 pt-6 border-t border-border">
        <p className="text-xs text-text-secondary">
          Nenhum valor foi cobrado do seu cartão. Você pode tentar novamente com segurança.
        </p>
      </div>
    </div>
  );
};

export default PaymentError;