import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import TrustSignals from './components/TrustSignals';
import BenefitsSection from './components/BenefitsSection';
import VideoSection from './components/VideoSection';
import CallToActionSection from './components/CallToActionSection';

const QuizLandingPage = () => {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    navigate('/interactive-quiz-flow');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection onStartQuiz={handleStartQuiz} />
        <TrustSignals />
        <BenefitsSection />
        <VideoSection />
        <CallToActionSection onStartQuiz={handleStartQuiz} />
      </main>
      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="text-xl font-bold">Pronto pra Passar</span>
              </div>
              <p className="text-slate-300 mb-4 max-w-md">
                Ajudamos profissionais que trabalham a se prepararem de forma inteligente para concursos públicos.
              </p>
              <p className="text-slate-400 text-sm">
                Mais de 12 mil pessoas já descobriram seu nível de preparação conosco.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Links Rápidos</h4>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#" className="hover:text-white transition-colors">Como Funciona</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Depoimentos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Áreas de Concurso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Reembolso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © {new Date()?.getFullYear()} Pronto pra Passar. Todos os direitos reservados.
            </p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <span className="text-slate-400 text-sm">CNPJ: 12.345.678/0001-90</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default QuizLandingPage;