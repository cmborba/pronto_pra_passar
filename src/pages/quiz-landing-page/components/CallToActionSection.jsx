import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CallToActionSection = ({ onStartQuiz }) => {
  const features = [
  "7 perguntas estratégicas",
  "Resultado personalizado",
  "Plano de estudos realista",
  "Cronograma semanal detalhado"];


  const urgencyFactors = [
  { icon: "Users", text: "12.847 pessoas já fizeram", color: "text-primary" },
  { icon: "Clock", text: "Leva apenas 3 minutos", color: "text-success" },
  { icon: "Zap", text: "Resultado na hora", color: "text-accent" }];


  return (
    <section className="bg-gradient-to-br from-primary via-blue-600 to-blue-700 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main CTA Content */}
        <div className="text-white mb-12">
          <h3 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight text-orange-50">
            Pronto para descobrir seu
            <span className="block text-accent">nível de preparação?</span>
          </h3>
          
          <p className="text-xl lg:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Faça o quiz gratuito agora e receba seu plano de estudos personalizado
          </p>

          {/* Features List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
            {features?.map((feature, index) =>
            <div key={index} className="flex items-center justify-center space-x-3">
                <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="Check" size={14} color="white" />
                </div>
                <span className="text-lg text-blue-100">{feature}</span>
              </div>
            )}
          </div>
        </div>

        {/* Main CTA Button */}
        <div className="mb-12">
          <Button
            variant="success"
            size="xl"
            iconName="ArrowRight"
            iconPosition="right"
            onClick={onStartQuiz}
            className="text-xl px-16 py-6 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 font-bold">

            Começar Quiz Gratuito
          </Button>
          
          <p className="text-blue-200 mt-4 text-lg">
            ✓ 100% Gratuito • ✓ Sem Cadastro • ✓ Resultado Imediato
          </p>
        </div>

        {/* Urgency Factors */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-12 mb-12">
          {urgencyFactors?.map((factor, index) =>
          <div key={index} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Icon name={factor?.icon} size={20} color="#16a34a" />
              </div>
              <span className="text-white font-medium">{factor?.text}</span>
            </div>
          )}
        </div>

        {/* Social Proof */}
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 border border-white border-opacity-20">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-white overflow-hidden border-2 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1609963426417-22816316ad85"
                    alt="Mulher profissional aprovada em concurso público sorrindo"
                    className="w-full h-full object-cover" />

                </div>
                <div className="w-10 h-10 rounded-full bg-white overflow-hidden border-2 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1724716263030-fbdd1c5ccc40"
                    alt="Homem executivo aprovado em concurso federal com sorriso confiante"
                    className="w-full h-full object-cover" />

                </div>
                <div className="w-10 h-10 rounded-full bg-white overflow-hidden border-2 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1735150033177-669e52f4b304"
                    alt="Mulher executiva aprovada em tribunal com blazer branco"
                    className="w-full h-full object-cover" />

                </div>
              </div>
              <span className="text-white font-medium ml-3">
                +2.300 aprovados em 2024
              </span>
            </div>

            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }, (_, i) =>
              <Icon key={i} name="Star" size={20} color="#eab308" className="fill-current" />
              )}
              <span className="text-white font-medium ml-2">4.9/5</span>
            </div>
          </div>
        </div>

        {/* Final Encouragement */}
        <div className="mt-8">
          <p className="text-blue-200 text-lg">
            Junte-se a milhares de pessoas que já descobriram seu caminho para a aprovação
          </p>
        </div>
      </div>
    </section>);

};

export default CallToActionSection;