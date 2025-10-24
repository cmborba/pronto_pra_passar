import React from 'react';
import Icon from '../../../components/AppIcon';

const PreparationScore = ({ score = 67, level = "Intermediário" }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getScoreBackground = (score) => {
    if (score >= 80) return 'bg-success';
    if (score >= 60) return 'bg-warning';
    return 'bg-error';
  };

  const getLevelIcon = (score) => {
    if (score >= 80) return 'TrendingUp';
    if (score >= 60) return 'Target';
    return 'AlertCircle';
  };

  const circumference = 2 * Math.PI * 90;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-card border border-border rounded-xl p-8 text-center">
      <h2 className="text-xl font-semibold text-text-primary mb-6">
        Seu Nível de Preparação
      </h2>
      
      {/* Circular Progress */}
      <div className="relative inline-flex items-center justify-center mb-6">
        <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="var(--color-border)"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="var(--color-primary)"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Score display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-5xl font-bold font-mono ${getScoreColor(score)}`}>
            {score}%
          </div>
          <div className="text-sm text-text-secondary mt-1">
            preparação
          </div>
        </div>
      </div>
      
      {/* Level Badge */}
      <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${getScoreBackground(score)} text-white mb-4`}>
        <Icon name={getLevelIcon(score)} size={16} />
        <span className="font-medium">{level}</span>
      </div>
      
      {/* Score interpretation */}
      <div className="text-sm text-text-secondary max-w-md mx-auto">
        {score >= 80 && "Excelente! Você está muito bem preparado para o concurso."}
        {score >= 60 && score < 80 && "Bom nível! Com mais alguns ajustes você estará pronto."}
        {score < 60 && "Há espaço para melhorar. Foque nas áreas prioritárias."}
      </div>
    </div>
  );
};

export default PreparationScore;