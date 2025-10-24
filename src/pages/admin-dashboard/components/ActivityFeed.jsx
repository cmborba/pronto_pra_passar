import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = () => {
  const activities = [
    {
      id: 1,
      type: 'quiz_completed',
      user: 'Maria Silva',
      message: 'completou o quiz com 78% de preparação',
      timestamp: '2 minutos atrás',
      icon: 'CheckCircle',
      color: 'text-success'
    },
    {
      id: 2,
      type: 'payment_received',
      user: 'João Santos',
      message: 'realizou pagamento de R$ 4,90',
      timestamp: '5 minutos atrás',
      icon: 'CreditCard',
      color: 'text-primary'
    },
    {
      id: 3,
      type: 'quiz_started',
      user: 'Ana Costa',
      message: 'iniciou o quiz de preparação',
      timestamp: '8 minutos atrás',
      icon: 'Play',
      color: 'text-warning'
    },
    {
      id: 4,
      type: 'quiz_completed',
      user: 'Carlos Oliveira',
      message: 'completou o quiz com 65% de preparação',
      timestamp: '12 minutos atrás',
      icon: 'CheckCircle',
      color: 'text-success'
    },
    {
      id: 5,
      type: 'payment_received',
      user: 'Fernanda Lima',
      message: 'realizou pagamento de R$ 4,90',
      timestamp: '15 minutos atrás',
      icon: 'CreditCard',
      color: 'text-primary'
    },
    {
      id: 6,
      type: 'quiz_abandoned',
      user: 'Roberto Mendes',
      message: 'abandonou o quiz na questão 4',
      timestamp: '18 minutos atrás',
      icon: 'XCircle',
      color: 'text-error'
    },
    {
      id: 7,
      type: 'quiz_completed',
      user: 'Patrícia Rocha',
      message: 'completou o quiz com 89% de preparação',
      timestamp: '22 minutos atrás',
      icon: 'CheckCircle',
      color: 'text-success'
    },
    {
      id: 8,
      type: 'quiz_started',
      user: 'Eduardo Ferreira',
      message: 'iniciou o quiz de preparação',
      timestamp: '25 minutos atrás',
      icon: 'Play',
      color: 'text-warning'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Atividade Recente</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-sm text-text-secondary">Ao vivo</span>
        </div>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities?.map((activity, index) => (
          <div key={activity?.id} className="flex items-start space-x-3 group">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center ${activity?.color}`}>
              <Icon name={activity?.icon} size={16} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-text-primary text-sm">{activity?.user}</span>
                <span className="text-text-secondary text-sm">{activity?.message}</span>
              </div>
              <p className="text-xs text-text-secondary mt-1">{activity?.timestamp}</p>
            </div>

            {/* Connection line */}
            {index < activities?.length - 1 && (
              <div className="absolute left-[47px] mt-8 w-0.5 h-4 bg-border"></div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border text-center">
        <button className="text-sm text-primary hover:text-primary/80 transition-micro font-medium">
          Ver todas as atividades
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;