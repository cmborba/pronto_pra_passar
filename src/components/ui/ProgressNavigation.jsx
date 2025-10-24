import React from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const ProgressNavigation = ({ 
  currentStep = 1, 
  totalSteps = 4, 
  steps = [], 
  onStepClick = null,
  onPrevious = null,
  onNext = null,
  showNavigation = true,
  className = ""
}) => {
  const defaultSteps = [
    { id: 1, label: 'Questão', icon: 'CircleHelp' },
    { id: 2, label: 'Progresso', icon: 'BarChart3' },
    { id: 3, label: 'Análise', icon: 'Brain' },
    { id: 4, label: 'Resultado', icon: 'Trophy' }
  ];

  const progressSteps = steps?.length > 0 ? steps : defaultSteps?.slice(0, totalSteps);
  const progressPercentage = (currentStep / totalSteps) * 100;

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  const handleStepClick = (stepId) => {
    if (onStepClick && stepId <= currentStep) {
      onStepClick(stepId);
    }
  };

  return (
    <div className={`bg-background border-b border-border sticky top-16 z-40 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">
              Progresso do Quiz
            </span>
            <span className="text-sm font-mono text-text-secondary">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Desktop Steps */}
        <div className="hidden sm:flex items-center justify-between">
          {progressSteps?.map((step, index) => {
            const status = getStepStatus(step?.id);
            const isClickable = onStepClick && step?.id <= currentStep;

            return (
              <div key={step?.id} className="flex items-center">
                <button
                  onClick={() => handleStepClick(step?.id)}
                  disabled={!isClickable}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-micro ${
                    status === 'completed'
                      ? 'bg-success text-success-foreground'
                      : status === 'current' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground'
                  } ${
                    isClickable ? 'hover:scale-105 cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {status === 'completed' ? (
                      <Icon name="Check" size={16} />
                    ) : (
                      <Icon name={step?.icon} size={16} />
                    )}
                  </div>
                  <span className="text-sm font-medium">{step?.label}</span>
                </button>
                {index < progressSteps?.length - 1 && (
                  <div className="flex-1 mx-4">
                    <div className={`h-0.5 ${
                      step?.id < currentStep ? 'bg-success' : 'bg-border'
                    }`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Steps */}
        <div className="sm:hidden flex items-center justify-center space-x-2">
          {progressSteps?.map((step) => {
            const status = getStepStatus(step?.id);
            return (
              <div
                key={step?.id}
                className={`w-3 h-3 rounded-full transition-micro ${
                  status === 'completed'
                    ? 'bg-success'
                    : status === 'current' ?'bg-primary' :'bg-border'
                }`}
              />
            );
          })}
        </div>

        {/* Navigation Controls */}
        {showNavigation && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              iconName="ChevronLeft"
              iconPosition="left"
              onClick={onPrevious}
              disabled={!onPrevious || currentStep === 1}
            >
              Anterior
            </Button>

            <div className="flex items-center space-x-2 text-sm text-text-secondary">
              <span className="font-mono">{currentStep}</span>
              <span>de</span>
              <span className="font-mono">{totalSteps}</span>
            </div>

            <Button
              variant="default"
              size="sm"
              iconName="ChevronRight"
              iconPosition="right"
              onClick={onNext}
              disabled={!onNext || currentStep === totalSteps}
            >
              {currentStep === totalSteps ? 'Finalizar' : 'Próximo'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressNavigation;