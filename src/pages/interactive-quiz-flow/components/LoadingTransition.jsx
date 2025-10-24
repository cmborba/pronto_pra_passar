import React from 'react';
import Icon from '../../../components/AppIcon';

const LoadingTransition = ({
  isVisible = false,
  message = "Carregando próxima questão...",
  className = ""
}) => {
  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center ${className}`}>
      <div className="bg-card border border-border rounded-lg p-8 shadow-medium max-w-sm mx-4">
        <div className="text-center">
          {/* Loading Animation */}
          <div className="mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Icon name="Brain" size={24} color="white" />
            </div>
          </div>

          {/* Loading Message */}
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Processando...
          </h3>
          <p className="text-sm text-text-secondary">
            {message}
          </p>

          {/* Progress Dots */}
          <div className="flex items-center justify-center space-x-1 mt-4">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingTransition;