import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, change, changeType, icon, color = "primary" }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return 'bg-success text-success-foreground';
      case 'warning':
        return 'bg-warning text-warning-foreground';
      case 'error':
        return 'bg-error text-error-foreground';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-text-secondary';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-secondary mb-1">{title}</p>
          <p className="text-3xl font-bold font-mono text-text-primary">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <Icon 
                name={changeType === 'positive' ? 'TrendingUp' : changeType === 'negative' ? 'TrendingDown' : 'Minus'} 
                size={16} 
                color={changeType === 'positive' ? 'var(--color-success)' : changeType === 'negative' ? 'var(--color-error)' : 'var(--color-text-secondary)'}
              />
              <span className={`text-sm font-medium ml-1 ${getChangeColor()}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${getColorClasses()}`}>
          <Icon name={icon} size={24} />
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;