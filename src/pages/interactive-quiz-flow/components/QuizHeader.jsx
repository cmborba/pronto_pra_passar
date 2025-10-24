import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuizHeader = ({
  onExit = () => {},
  showExitButton = true,
  timeElapsed = 0,
  className = ""
}) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes?.toString()?.padStart(2, '0')}:${remainingSeconds?.toString()?.padStart(2, '0')}`;
  };

  return (
    <div className={`bg-surface border-b border-border ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section - Logo/Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="GraduationCap" size={18} color="white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary">
                Pronto pra Passar
              </h1>
              <p className="text-xs text-text-secondary">
                Quiz de Avaliação
              </p>
            </div>
          </div>

          {/* Center Section - Timer */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-muted rounded-lg">
            <Icon name="Clock" size={16} color="var(--color-text-secondary)" />
            <span className="text-sm font-mono text-text-primary">
              {formatTime(timeElapsed)}
            </span>
          </div>

          {/* Right Section - Exit Button */}
          {showExitButton && (
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              iconPosition="left"
              onClick={onExit}
              className="text-text-secondary hover:text-error"
            >
              <span className="hidden sm:inline">Sair</span>
            </Button>
          )}
        </div>

        {/* Mobile Timer */}
        <div className="sm:hidden mt-2 flex items-center justify-center space-x-2 text-sm text-text-secondary">
          <Icon name="Clock" size={14} />
          <span className="font-mono">{formatTime(timeElapsed)}</span>
        </div>
      </div>
    </div>
  );
};

export default QuizHeader;