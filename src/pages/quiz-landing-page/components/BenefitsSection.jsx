import React from 'react';
import Icon from '../../../components/AppIcon';

const BenefitsSection = () => {
  const benefits = [
  {
    id: 1,
    icon: "Target",
    title: "Plano Personalizado",
    description: "Receba um cronograma de estudos feito especialmente para seu perfil e disponibilidade de tempo.",
    color: "text-primary"
  },
  {
    id: 2,
    icon: "Clock",
    title: "Para Quem Trabalha",
    description: "Horários realistas que se encaixam na rotina de quem trabalha CLT e tem pouco tempo livre.",
    color: "text-accent"
  },
  {
    id: 3,
    icon: "DollarSign",
    title: "Preço Justo",
    description: "Material completo por apenas R$ 4,90. Investimento que cabe no seu orçamento.",
    color: "text-success"
  },
  {
    id: 4,
    icon: "BookOpen",
    title: "Conteúdo Completo",
    description: "PDFs com teoria, exercícios e dicas exclusivas para sua área de interesse.",
    color: "text-secondary"
  },
  {
    id: 5,
    icon: "Users",
    title: "Comunidade Ativa",
    description: "Acesso a grupo exclusivo com outros concurseiros e professores especializados.",
    color: "text-warning"
  },
  {
    id: 6,
    icon: "TrendingUp",
    title: "Resultados Comprovados",
    description: "Método testado e aprovado por milhares de candidatos em todo o Brasil.",
    color: "text-primary"
  }];


  const examAreas = [
  { name: "Bancários", icon: "Building2", count: "1.247" },
  { name: "Administrativos", icon: "FileText", count: "892" },
  { name: "Policiais", icon: "Shield", count: "634" },
  { name: "Educação", icon: "GraduationCap", count: "456" },
  { name: "Saúde", icon: "Heart", count: "321" },
  { name: "Tribunais", icon: "Scale", count: "289" }];


  return (
    <section className="bg-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Benefits */}
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-text-primary mb-4">
            Por que escolher nosso método?
          </h3>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-12">
            Desenvolvido especialmente para profissionais que trabalham e querem ser aprovados em concursos públicos
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits?.map((benefit) =>
            <div
              key={benefit?.id}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-medium transition-all duration-300 group">

                <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon name={benefit?.icon} size={24} className={benefit?.color} />
                </div>
                <h4 className="text-xl font-semibold text-text-primary mb-3">
                  {benefit?.title}
                </h4>
                <p className="text-text-secondary leading-relaxed">
                  {benefit?.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Exam Areas */}
        <div className="bg-surface rounded-2xl p-8">
          <div className="text-center mb-8">
            <h4 className="text-2xl font-bold text-text-primary mb-2">
              Áreas de Concursos Disponíveis
            </h4>
            <p className="text-text-secondary">
              Planos de estudo específicos para cada área
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {examAreas?.map((area) =>
            <div
              key={area?.name}
              className="bg-card border border-border rounded-lg p-4 text-center hover:shadow-soft transition-all duration-300 group">

                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Icon name={area?.icon} size={20} color="white" />
                </div>
                <h5 className="font-semibold text-text-primary text-sm mb-1">
                  {area?.name}
                </h5>
                <p className="text-xs text-text-secondary">
                  {area?.count} aprovados
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Value Proposition */}
        <div className="mt-16 bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-8 text-white text-center">
          <h4 className="text-2xl font-bold mb-4 text-orange-200">Tudo isso por apenas R$ 7,90

          </h4>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center space-x-2">
              <Icon name="Check" size={20} color="#16a34a" />
              <span>Quiz personalizado gratuito</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Check" size={20} color="#16a34a" />
              <span>Plano de estudos detalhado</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Check" size={20} color="#16a34a" />
              <span>Material em PDF completo</span>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default BenefitsSection;