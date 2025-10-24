import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuestionCard = ({ 
  question, 
  selectedAnswer, 
  onAnswerSelect, 
  isAnswered = false,
  className = "" 
}) => {
  if (!question) return null;

  return (
    <div className={`bg-card border border-border rounded-lg p-6 sm:p-8 ${className}`}>
      {/* Question Header */}
      <div className="mb-6">
        <div className="flex items-start space-x-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Icon name={question?.icon} size={20} color="white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-semibold text-text-primary mb-2">
              {question?.title}
            </h2>
            {question?.subtitle && (
              <p className="text-text-secondary text-sm sm:text-base">
                {question?.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
      {/* Answer Options */}
      <div className="space-y-3">
        {question?.options?.map((option) => {
          const isSelected = selectedAnswer === option?.value;
          
          return (
            <button
              key={option?.value}
              onClick={() => onAnswerSelect(option?.value)}
              className={`w-full p-4 sm:p-5 text-left rounded-lg border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-medium'
                  : 'border-border bg-background hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center space-x-4">
                {/* Radio Button */}
                <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-primary bg-primary' :'border-border bg-background'
                }`}>
                  {isSelected && (
                    <div className="w-full h-full rounded-full bg-white scale-50" />
                  )}
                </div>

                {/* Option Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-medium text-sm sm:text-base ${
                      isSelected ? 'text-primary' : 'text-text-primary'
                    }`}>
                      {option?.label}
                    </span>
                    {option?.points && (
                      <span className="text-xs text-text-secondary font-mono">
                        {option?.points} pts
                      </span>
                    )}
                  </div>
                  {option?.description && (
                    <p className="text-xs sm:text-sm text-text-secondary mt-1">
                      {option?.description}
                    </p>
                  )}
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="flex-shrink-0">
                    <Icon name="Check" size={16} color="var(--color-primary)" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      {/* Answer Confirmation */}
      {isAnswered && (
        <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} color="var(--color-success)" />
            <span className="text-sm font-medium text-success">
              Resposta selecionada! Clique em "Próximo" para continuar.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;