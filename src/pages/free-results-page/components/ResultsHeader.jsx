import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ResultsHeader = ({ userName = "Candidato", onRetakeQuiz, onShareResults }) => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-success rounded-full mb-4">
        <Icon name="Trophy" size={32} color="white" />
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
        Parabéns, {userName}!
      </h1>
      
      <p className="text-lg text-text-secondary mb-6">
        Sua análise de preparação está pronta
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button
          variant="outline"
          size="sm"
          iconName="RotateCcw"
          iconPosition="left"
          onClick={onRetakeQuiz}
        >
          Refazer Quiz
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          iconName="Share2"
          iconPosition="left"
          onClick={onShareResults}
        >
          Compartilhar Resultado
        </Button>
      </div>
    </div>
  );
};

export default ResultsHeader;