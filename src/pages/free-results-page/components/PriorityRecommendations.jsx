import React from 'react';
import Icon from '../../../components/AppIcon';

const PriorityRecommendations = ({ recommendations = [] }) => {
  const defaultRecommendations = [
    {
      id: 1,
      subject: "Português",
      priority: "Alta",
      score: 45,
      icon: "BookOpen",
      color: "error",
      tips: [
        "Revise regras de concordância verbal e nominal",
        "Pratique interpretação de textos diariamente",
        "Estude pontuação e acentuação"
      ]
    },
    {
      id: 2,
      subject: "Matemática",
      priority: "Média",
      score: 65,
      icon: "Calculator",
      color: "warning",
      tips: [
        "Foque em porcentagem e regra de três",
        "Pratique problemas de lógica matemática",
        "Revise operações básicas"
      ]
    },
    {
      id: 3,
      subject: "Conhecimentos Gerais",
      priority: "Baixa",
      score: 80,
      icon: "Globe",
      color: "success",
      tips: [
        "Mantenha-se atualizado com notícias",
        "Revise história e geografia do Brasil",
        "Acompanhe atualidades políticas"
      ]
    }
  ];

  const subjects = recommendations?.length > 0 ? recommendations : defaultRecommendations;

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'alta': return 'bg-error text-error-foreground';
      case 'média': return 'bg-warning text-warning-foreground';
      case 'baixa': return 'bg-success text-success-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getProgressColor = (score) => {
    if (score >= 70) return 'bg-success';
    if (score >= 50) return 'bg-warning';
    return 'bg-error';
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Target" size={24} color="var(--color-primary)" />
        <h2 className="text-xl font-semibold text-text-primary">
          Suas Prioridades de Estudo
        </h2>
      </div>
      <div className="space-y-4">
        {subjects?.map((subject) => (
          <div key={subject?.id} className="border border-border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Icon name={subject?.icon} size={20} color="var(--color-text-primary)" />
                </div>
                <div>
                  <h3 className="font-medium text-text-primary">{subject?.subject}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(subject?.priority)}`}>
                      Prioridade {subject?.priority}
                    </span>
                    <span className="text-sm text-text-secondary">
                      {subject?.score}% de acerto
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mb-3">
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(subject?.score)}`}
                  style={{ width: `${subject?.score}%` }}
                />
              </div>
            </div>
            
            {/* Tips */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-text-primary">Dicas gratuitas:</h4>
              <ul className="space-y-1">
                {subject?.tips?.slice(0, 2)?.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-text-secondary">
                    <Icon name="CheckCircle2" size={14} color="var(--color-success)" className="mt-0.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
                <li className="flex items-start space-x-2 text-sm text-text-secondary opacity-50">
                  <Icon name="Lock" size={14} color="var(--color-text-secondary)" className="mt-0.5 flex-shrink-0" />
                  <span>+ 3 dicas personalizadas no plano completo</span>
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriorityRecommendations;