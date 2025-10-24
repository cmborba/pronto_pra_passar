import React from 'react';
import Icon from '../../../components/AppIcon';

const QuizProgress = ({
  currentQuestion = 1,
  totalQuestions = 7,
  completedQuestions = [],
  className = ""
}) => {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;

  const getQuestionStatus = (questionNumber) => {
    if (completedQuestions?.includes(questionNumber)) return 'completed';
    if (questionNumber === currentQuestion) return 'current';
    if (questionNumber < currentQuestion) return 'completed';
    return 'upcoming';
  };

  return (
    <div className={`bg-background border-b border-border sticky top-16 z-40 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Progress Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Brain" size={20} color="var(--color-primary)" />
            <h1 className="text-lg font-semibold text-text-primary">
              Quiz de Preparação
            </h1>
          </div>
          <div className="text-sm text-text-secondary">
            <span className="font-mono font-medium">{currentQuestion}</span>
            <span className="mx-1">de</span>
            <span className="font-mono font-medium">{totalQuestions}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">
              Progresso Geral
            </span>
            <span className="text-sm font-mono font-medium text-primary">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500 ease-out shadow-soft"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Desktop Question Steps */}
        <div className="hidden sm:flex items-center justify-between">
          {Array.from({ length: totalQuestions }, (_, index) => {
            const questionNumber = index + 1;
            const status = getQuestionStatus(questionNumber);

            return (
              <div key={questionNumber} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-200 ${
                  status === 'completed'
                    ? 'bg-success text-success-foreground'
                    : status === 'current' ?'bg-primary text-primary-foreground ring-2 ring-primary/20' :'bg-muted text-muted-foreground'
                }`}>
                  {status === 'completed' ? (
                    <Icon name="Check" size={14} />
                  ) : (
                    questionNumber
                  )}
                </div>

                {index < totalQuestions - 1 && (
                  <div className={`w-8 sm:w-12 h-0.5 mx-2 ${
                    questionNumber < currentQuestion ? 'bg-success' : 'bg-border'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Question Dots */}
        <div className="sm:hidden flex items-center justify-center space-x-2">
          {Array.from({ length: totalQuestions }, (_, index) => {
            const questionNumber = index + 1;
            const status = getQuestionStatus(questionNumber);

            return (
              <div
                key={questionNumber}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  status === 'completed'
                    ? 'bg-success'
                    : status === 'current' ?'bg-primary ring-2 ring-primary/20' :'bg-border'
                }`}
              />
            );
          })}
        </div>

        {/* Current Question Info */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-center">
            <p className="text-sm text-text-secondary">
              Questão atual: <span className="font-medium text-text-primary">Pergunta {currentQuestion}</span>
            </p>
            <p className="text-xs text-text-secondary mt-1">
              Responda todas as perguntas para descobrir seu nível de preparação
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizProgress;