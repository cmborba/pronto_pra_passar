import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConversionSection = ({ onGetPaidPlan }) => {
  const paidFeatures = [
  {
    icon: "FileText",
    title: "PDF Personalizado",
    description: "Cronograma detalhado baseado no seu perfil"
  },
  {
    icon: "Target",
    title: "Plano Específico",
    description: "Estratégias focadas nas suas dificuldades"
  },
  {
    icon: "BookOpen",
    title: "Material Exclusivo",
    description: "Exercícios e dicas para cada matéria"
  },
  {
    icon: "Calendar",
    title: "Cronograma Flexível",
    description: "Adaptado à sua rotina de trabalho"
  }];


  const testimonials = [
  {
    id: 1,
    name: "Maria Silva",
    role: "Aprovada - Banco do Brasil",
    avatar: "https://images.unsplash.com/photo-1730222168387-051038de25be",
    avatarAlt: "Professional headshot of woman with shoulder-length brown hair smiling at camera",
    comment: "O cronograma personalizado foi essencial para organizar meus estudos trabalhando 8h por dia."
  },
  {
    id: 2,
    name: "João Santos",
    role: "Aprovado - Receita Federal",
    avatar: "https://images.unsplash.com/photo-1663720527180-4c60a78fe3b7",
    avatarAlt: "Professional headshot of man with short dark hair in business suit",
    comment: "Consegui focar nas matérias certas e otimizar meu tempo de estudo."
  }];


  return (
    <div className="bg-gradient-to-br from-success/5 to-primary/5 border border-success/20 rounded-xl p-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-success rounded-full mb-4">
          <Icon name="Zap" size={32} color="white" />
        </div>
        
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Acelere sua Aprovação
        </h2>
        
        <p className="text-text-secondary mb-4">
          Receba um plano de estudos completo e personalizado
        </p>
        
        <div className="flex items-center justify-center space-x-2 mb-6">
          <span className="text-3xl font-bold text-success">R$ 7,90</span>
          <div className="text-left">
            <div className="text-sm text-text-secondary line-through">R$ 29,90</div>
            <div className="text-xs text-success font-medium">83% OFF</div>
          </div>
        </div>
      </div>
      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {paidFeatures?.map((feature, index) =>
        <div key={index} className="flex items-start space-x-3 p-3 bg-background rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name={feature?.icon} size={16} color="var(--color-success)" />
            </div>
            <div>
              <h3 className="font-medium text-text-primary text-sm">{feature?.title}</h3>
              <p className="text-xs text-text-secondary">{feature?.description}</p>
            </div>
          </div>
        )}
      </div>
      {/* Testimonials */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-text-primary mb-4 text-center">
          Quem já conseguiu:
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials?.map((testimonial) =>
          <div key={testimonial?.id} className="bg-background border border-border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <img
                src={testimonial?.avatar}
                alt={testimonial?.avatarAlt}
                className="w-10 h-10 rounded-full object-cover" />

                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-text-primary text-sm">{testimonial?.name}</h4>
                    <Icon name="CheckCircle2" size={14} color="var(--color-success)" />
                  </div>
                  <p className="text-xs text-success font-medium mb-2">{testimonial?.role}</p>
                  <p className="text-xs text-text-secondary italic">"{testimonial?.comment}"</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="success"
          size="lg"
          iconName="Download"
          iconPosition="left"
          onClick={onGetPaidPlan}
          fullWidth
          className="text-base font-semibold">

          Receber Plano Completo - R$ 4,90
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          iconName="Shield"
          iconPosition="left"
          className="sm:w-auto">

          Garantia 7 dias
        </Button>
      </div>
      {/* Trust signals */}
      <div className="flex items-center justify-center space-x-6 mt-6 pt-6 border-t border-border">
        <div className="flex items-center space-x-2 text-xs text-text-secondary">
          <Icon name="Shield" size={14} color="var(--color-success)" />
          <span>Pagamento Seguro</span>
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-text-secondary">
          <Icon name="Clock" size={14} color="var(--color-success)" />
          <span>Entrega Imediata</span>
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-text-secondary">
          <Icon name="Users" size={14} color="var(--color-success)" />
          <span>+5.000 aprovados</span>
        </div>
      </div>
    </div>);

};

export default ConversionSection;