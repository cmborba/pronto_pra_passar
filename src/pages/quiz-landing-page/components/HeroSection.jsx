import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const HeroSection = ({ onStartQuiz }) => {
  return (
    <section className="bg-gradient-to-br from-primary to-blue-700 text-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Logo */}
          <div className="flex justify-center items-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <Icon name="GraduationCap" size={28} color="#2563eb" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-orange-50">Pronto pra Passar?

              </h1>
            </div>
          </div>

          {/* Main Headline */}
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight text-orange-50">
            Descubra seu Nível de
            <span className="block text-accent">Preparação</span>
          </h2>

          {/* Subheadline */}
          <p className="text-xl lg:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Faça nosso quiz personalizado e receba um plano de estudos realista para concursos públicos
          </p>

          {/* Key Benefits */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 mb-12">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={20} color="#16a34a" />
              <span className="text-lg">Apenas 7 perguntas</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Zap" size={20} color="#16a34a" />
              <span className="text-lg">Resultado imediato</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Target" size={20} color="#16a34a" />
              <span className="text-lg">100% personalizado</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="space-y-4">
            <Button
              variant="success"
              size="xl"
              iconName="Play"
              iconPosition="left"
              onClick={onStartQuiz}
              className="text-lg px-12 py-4 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">

              Começar Quiz Gratuito
            </Button>
            
            <p className="text-sm text-blue-200">
              ✓ Gratuito • ✓ Sem cadastro • ✓ Resultado na hora
            </p>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold font-mono text-accent">12.847</div>
              <div className="text-blue-200">Pessoas já fizeram</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold font-mono text-accent">4,9</div>
              <div className="text-blue-200">Avaliação média</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold font-mono text-accent">89%</div>
              <div className="text-blue-200">Recomendam</div>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default HeroSection;