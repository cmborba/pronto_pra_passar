import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ResultsHeader from './components/ResultsHeader';
import PreparationScore from './components/PreparationScore';
import PriorityRecommendations from './components/PriorityRecommendations';
import StudyPlanChart from './components/StudyPlanChart';
import ConversionSection from './components/ConversionSection';
import ShareModal from './components/ShareModal';

const FreeResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [userResults, setUserResults] = useState(null);

  // Get quiz results from navigation state or localStorage
  useEffect(() => {
    const results = location?.state?.quizResults || 
                   JSON.parse(localStorage.getItem('quizResults') || 'null');
    
    if (results) {
      setUserResults(results);
    } else {
      // If no results found, redirect to quiz
      navigate('/interactive-quiz-flow');
    }
  }, [location?.state, navigate]);

  // Mock user data - in real app this would come from quiz results
  const mockUserData = {
    userName: "Ana Silva",
    preparationScore: 67,
    preparationLevel: "Intermediário",
    recommendations: [
      {
        id: 1,
        subject: "Português",
        priority: "Alta",
        score: 45,
        icon: "BookOpen",
        color: "error",
        tips: [
          "Revise regras de concordância verbal e nominal",
          "Pratique interpretação de textos diariamente",
          "Estude pontuação e acentuação",
          "Foque em análise sintática",
          "Pratique redação oficial"
        ]
      },
      {
        id: 2,
        subject: "Matemática",
        priority: "Média",
        score: 65,
        icon: "Calculator",
        color: "warning",
        tips: [
          "Foque em porcentagem e regra de três",
          "Pratique problemas de lógica matemática",
          "Revise operações básicas",
          "Estude matemática financeira",
          "Pratique geometria básica"
        ]
      },
      {
        id: 3,
        subject: "Conhecimentos Gerais",
        priority: "Baixa",
        score: 80,
        icon: "Globe",
        color: "success",
        tips: [
          "Mantenha-se atualizado com notícias",
          "Revise história e geografia do Brasil",
          "Acompanhe atualidades políticas",
          "Estude legislação básica",
          "Foque em economia atual"
        ]
      },
      {
        id: 4,
        subject: "Informática",
        priority: "Média",
        score: 58,
        icon: "Monitor",
        color: "warning",
        tips: [
          "Pratique Excel e Word avançado",
          "Estude conceitos de internet e email",
          "Revise segurança da informação",
          "Aprenda sobre sistemas operacionais",
          "Foque em redes de computadores"
        ]
      }
    ],
    studyPlan: [
      { day: 'Seg', hours: 2, subject: 'Português' },
      { day: 'Ter', hours: 1.5, subject: 'Matemática' },
      { day: 'Qua', hours: 2, subject: 'Português' },
      { day: 'Qui', hours: 1, subject: 'Conhecimentos Gerais' },
      { day: 'Sex', hours: 2.5, subject: 'Matemática' },
      { day: 'Sáb', hours: 3, subject: 'Revisão Geral' },
      { day: 'Dom', hours: 1, subject: 'Descanso Ativo' }
    ]
  };

  // Use actual results if available, otherwise use mock data
  const displayData = userResults || mockUserData;

  const handleRetakeQuiz = () => {
    // Clear previous results
    localStorage.removeItem('quizResults');
    navigate('/interactive-quiz-flow');
  };

  const handleShareResults = () => {
    setIsShareModalOpen(true);
  };

  const handleGetPaidPlan = () => {
    // Pass user data to checkout
    navigate('/payment-checkout', {
      state: {
        userResults: displayData,
        selectedPlan: 'complete'
      }
    });
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
  };

  // Track page view for analytics
  useEffect(() => {
    // Analytics tracking would go here
    console.log('Results page viewed:', displayData?.preparationScore);
  }, [displayData?.preparationScore]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <ResultsHeader
          userName={displayData?.userName}
          onRetakeQuiz={handleRetakeQuiz}
          onShareResults={handleShareResults}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Preparation Score */}
          <div className="lg:col-span-1">
            <PreparationScore
              score={displayData?.preparationScore}
              level={displayData?.preparationLevel}
            />
          </div>

          {/* Study Plan Chart */}
          <div className="lg:col-span-1">
            <StudyPlanChart studyData={displayData?.studyPlan} />
          </div>
        </div>

        {/* Priority Recommendations */}
        <div className="mb-8">
          <PriorityRecommendations recommendations={displayData?.recommendations} />
        </div>

        {/* Conversion Section */}
        <div className="mb-8">
          <ConversionSection onGetPaidPlan={handleGetPaidPlan} />
        </div>

        {/* Additional Info */}
        <div className="bg-muted rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Quer melhorar ainda mais?
          </h3>
          <p className="text-text-secondary mb-4">
            Nosso plano completo inclui cronograma detalhado, exercícios específicos e acompanhamento personalizado.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleRetakeQuiz}
              className="text-primary hover:text-primary/80 transition-micro text-sm font-medium"
            >
              Refazer o quiz para resultados mais precisos
            </button>
            <span className="text-text-secondary">•</span>
            <button
              onClick={() => navigate('/quiz-landing-page')}
              className="text-primary hover:text-primary/80 transition-micro text-sm font-medium"
            >
              Voltar ao início
            </button>
          </div>
        </div>
      </main>
      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={handleCloseShareModal}
        userScore={displayData?.preparationScore}
      />
    </div>
  );
};

export default FreeResultsPage;