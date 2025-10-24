import React from 'react';
import Icon from '../../../components/AppIcon';

const OrderSummary = ({ orderDetails }) => {
  const {
    amount = 4.90,
    currency = 'BRL',
    product = 'Plano de Estudos Personalizado',
    description,
    quizScore,
    quizSession
  } = orderDetails || {};

  const formatPrice = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency,
    })?.format(value);
  };

  return (
    <div className="bg-background border border-border rounded-lg p-6 sticky top-8">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Resumo do pedido
      </h3>
      {/* Product Info */}
      <div className="space-y-4 mb-6">
        <div className="flex items-start space-x-3 p-4 bg-muted rounded-lg">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="BookOpen" size={24} color="white" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-text-primary">{product}</h4>
            {description && (
              <p className="text-sm text-text-secondary mt-1">{description}</p>
            )}
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-text-secondary">1x produto digital</span>
              <span className="font-semibold text-text-primary">{formatPrice(amount)}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Quiz Score Display */}
      {quizScore && (
        <div className="mb-6 p-4 bg-surface rounded-lg border">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Target" size={16} color="var(--color-primary)" />
            <span className="text-sm font-medium text-text-primary">Seu resultado no quiz</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(quizScore, 100)}%` }}
              ></div>
            </div>
            <span className="text-sm font-semibold text-primary">{quizScore}%</span>
          </div>
          <p className="text-xs text-text-secondary mt-2">
            Baseado neste resultado, criamos seu plano personalizado
          </p>
        </div>
      )}
      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-text-secondary">
          <span>Subtotal</span>
          <span>{formatPrice(amount)}</span>
        </div>
        <div className="flex items-center justify-between text-text-secondary">
          <span>Taxa de processamento</span>
          <span className="text-success">Grátis</span>
        </div>
        <div className="border-t border-border pt-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-text-primary">Total</span>
            <span className="text-xl font-bold text-primary">{formatPrice(amount)}</span>
          </div>
        </div>
      </div>
      {/* What's Included */}
      <div className="space-y-3">
        <h4 className="font-medium text-text-primary">O que está incluído:</h4>
        <div className="space-y-2">
          {[
            'Plano de estudos personalizado',
            'Cronograma detalhado de estudos',
            'Lista de matérias prioritárias',
            'Dicas e estratégias personalizadas',
            'Suporte por email',
            'Garantia de 7 dias'
          ]?.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Icon name="Check" size={16} color="var(--color-success)" />
              <span className="text-sm text-text-secondary">{item}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Money Back Guarantee */}
      <div className="mt-6 p-3 bg-success bg-opacity-10 rounded-lg border border-success border-opacity-20">
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={16} color="var(--color-success)" />
          <span className="text-sm font-medium text-success">Garantia de satisfação</span>
        </div>
        <p className="text-xs text-success mt-1">
          Não ficou satisfeito? Devolvemos seu dinheiro em até 7 dias.
        </p>
      </div>
      {/* Support Info */}
      <div className="mt-4 text-center">
        <p className="text-xs text-text-secondary">
          Precisa de ajuda? Entre em contato conosco
        </p>
        <p className="text-xs text-primary font-medium">
          suporte@prontoprapassar.com.br
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;