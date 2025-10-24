import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuizNavigation = ({
  currentQuestion = 1,
  totalQuestions = 7,
  canGoNext = false,
  canGoPrevious = true,
  onNext = () => {},
  onPrevious = () => {},
  onFinish = () => {},
  isLoading = false,
  className = ""
}) => {
  const isLastQuestion = currentQuestion === totalQuestions;

  return (
    <div className={`bg-surface border border-border rounded-lg p-4 sm:p-6 ${className}`}>
      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="default"
          iconName="ChevronLeft"
          iconPosition="left"
          onClick={onPrevious}
          disabled={!canGoPrevious || currentQuestion === 1 || isLoading}
          className="min-w-[120px]"
        >
          Anterior
        </Button>

        {/* Question Counter */}
        <div className="flex items-center space-x-2 px-4 py-2 bg-muted rounded-lg">
          <Icon name="HelpCircle" size={16} color="var(--color-text-secondary)" />
          <span className="text-sm font-medium text-text-primary">
            Questão
          </span>
          <span className="font-mono text-sm font-bold text-primary">
            {currentQuestion}
          </span>
          <span className="text-sm text-text-secondary">de</span>
          <span className="font-mono text-sm font-bold text-text-primary">
            {totalQuestions}
          </span>
        </div>

        {/* Next/Finish Button */}
        <Button
          variant={isLastQuestion ? "success" : "default"}
          size="default"
          iconName={isLastQuestion ? "Trophy" : "ChevronRight"}
          iconPosition="right"
          onClick={isLastQuestion ? onFinish : onNext}
          disabled={!canGoNext || isLoading}
          loading={isLoading}
          className="min-w-[120px]"
        >
          {isLastQuestion ? 'Finalizar' : 'Próximo'}
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-text-secondary">
            Progresso do Quiz
          </span>
          <span className="text-xs font-mono text-text-secondary">
            {Math.round((currentQuestion / totalQuestions) * 100)}%
          </span>
        </div>
        
        <div className="w-full bg-border rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-3 text-center">
        <p className="text-xs text-text-secondary">
          {canGoNext 
            ? `Clique em "${isLastQuestion ? 'Finalizar' : 'Próximo'}" para continuar`
            : 'Selecione uma resposta para prosseguir'
          }
        </p>
      </div>
    </div>
  );
};

export default QuizNavigation;