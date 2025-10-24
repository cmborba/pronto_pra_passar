import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import QuizHeader from './components/QuizHeader';
import QuizProgress from './components/QuizProgress';
import QuestionCard from './components/QuestionCard';
import QuizNavigation from './components/QuizNavigation';
import LoadingTransition from './components/LoadingTransition';

const InteractiveQuizFlow = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState([]);

  // Quiz questions data
  const quizQuestions = [
    {
      id: 1,
      icon: "Clock",
      title: "Quanto tempo você tem disponível para estudar por dia?",
      subtitle: "Seja realista sobre sua rotina atual",
      options: [
        {
          value: "less_than_1h",
          label: "Menos de 1 hora",
          description: "Rotina muito corrida, pouco tempo livre",
          points: 1
        },
        {
          value: "1_to_2h",
          label: "1 a 2 horas",
          description: "Consigo dedicar um tempo moderado",
          points: 2
        },
        {
          value: "2_to_4h",
          label: "2 a 4 horas",
          description: "Tenho uma boa disponibilidade",
          points: 3
        },
        {
          value: "more_than_4h",
          label: "Mais de 4 horas",
          description: "Posso me dedicar intensivamente",
          points: 4
        }
      ]
    },
    {
      id: 2,
      icon: "Target",
      title: "Qual é o seu principal objetivo com concursos públicos?",
      subtitle: "Entenda sua motivação principal",
      options: [
        {
          value: "career_change",
          label: "Mudança de carreira",
          description: "Busco estabilidade e novos desafios",
          points: 3
        },
        {
          value: "financial_improvement",
          label: "Melhoria financeira",
          description: "Quero aumentar minha renda",
          points: 2
        },
        {
          value: "job_security",
          label: "Estabilidade profissional",
          description: "Busco segurança no emprego",
          points: 4
        },
        {
          value: "personal_achievement",
          label: "Realização pessoal",
          description: "É um sonho que quero conquistar",
          points: 3
        }
      ]
    },
    {
      id: 3,
      icon: "BookOpen",
      title: "Como você avalia seu conhecimento atual nas matérias básicas?",
      subtitle: "Português, Matemática, Raciocínio Lógico, Informática",
      options: [
        {
          value: "beginner",
          label: "Iniciante",
          description: "Preciso começar do básico",
          points: 1
        },
        {
          value: "basic",
          label: "Básico",
          description: "Tenho noções, mas preciso revisar",
          points: 2
        },
        {
          value: "intermediate",
          label: "Intermediário",
          description: "Domino o essencial, preciso aprofundar",
          points: 3
        },
        {
          value: "advanced",
          label: "Avançado",
          description: "Tenho bom domínio das matérias",
          points: 4
        }
      ]
    },
    {
      id: 4,
      icon: "Calendar",
      title: "Há quanto tempo você estuda para concursos?",
      subtitle: "Considere seu tempo total de preparação",
      options: [
        {
          value: "never_studied",
          label: "Nunca estudei",
          description: "Estou começando agora",
          points: 1
        },
        {
          value: "less_than_6m",
          label: "Menos de 6 meses",
          description: "Sou iniciante nos estudos",
          points: 2
        },
        {
          value: "6m_to_1y",
          label: "6 meses a 1 ano",
          description: "Tenho alguma experiência",
          points: 3
        },
        {
          value: "more_than_1y",
          label: "Mais de 1 ano",
          description: "Já tenho experiência significativa",
          points: 4
        }
      ]
    },
    {
      id: 5,
      icon: "Users",
      title: "Qual área de concurso mais te interessa?",
      subtitle: "Escolha sua área de maior interesse",
      options: [
        {
          value: "banking",
          label: "Área Bancária",
          description: "Bancos públicos e privados",
          points: 3
        },
        {
          value: "administrative",
          label: "Área Administrativa",
          description: "Técnico e analista administrativo",
          points: 2
        },
        {
          value: "security",
          label: "Área de Segurança",
          description: "Polícia Civil, Militar, Bombeiros",
          points: 4
        },
        {
          value: "education",
          label: "Área da Educação",
          description: "Professor, pedagogo, técnico educacional",
          points: 3
        },
        {
          value: "health",
          label: "Área da Saúde",
          description: "Técnico e analista em saúde",
          points: 3
        }
      ]
    },
    {
      id: 6,
      icon: "TrendingUp",
      title: "Como você se sente em relação aos seus estudos atuais?",
      subtitle: "Avalie sua situação atual de preparação",
      options: [
        {
          value: "lost",
          label: "Perdido(a)",
          description: "Não sei por onde começar",
          points: 1
        },
        {
          value: "struggling",
          label: "Com dificuldades",
          description: "Estudo, mas sinto que não evoluo",
          points: 2
        },
        {
          value: "progressing",
          label: "Progredindo",
          description: "Vejo evolução, mas posso melhorar",
          points: 3
        },
        {
          value: "confident",
          label: "Confiante",
          description: "Me sinto bem preparado(a)",
          points: 4
        }
      ]
    },
    {
      id: 7,
      icon: "Zap",
      title: "Qual é sua maior dificuldade nos estudos?",
      subtitle: "Identifique seu principal desafio",
      options: [
        {
          value: "time_management",
          label: "Gestão do tempo",
          description: "Não consigo organizar meus estudos",
          points: 2
        },
        {
          value: "motivation",
          label: "Falta de motivação",
          description: "Perco o foco facilmente",
          points: 1
        },
        {
          value: "study_method",
          label: "Método de estudo",
          description: "Não sei como estudar eficientemente",
          points: 2
        },
        {
          value: "content_difficulty",
          label: "Dificuldade no conteúdo",
          description: "As matérias são muito complexas",
          points: 3
        },
        {
          value: "no_major_difficulty",
          label: "Nenhuma grande dificuldade",
          description: "Estou conseguindo me organizar bem",
          points: 4
        }
      ]
    }
  ];

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle answer selection
  const handleAnswerSelect = (value) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: value
    }));

    // Mark question as completed
    if (!completedQuestions?.includes(currentQuestion)) {
      setCompletedQuestions(prev => [...prev, currentQuestion]);
    }
  };

  // Handle navigation
  const handleNext = () => {
    if (currentQuestion < quizQuestions?.length) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        setIsLoading(false);
      }, 800);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentQuestion(prev => prev - 1);
        setIsLoading(false);
      }, 500);
    }
  };

  const handleFinish = () => {
    setIsLoading(true);
    
    // Calculate total score
    const totalScore = Object.values(answers)?.reduce((sum, answer) => {
      const question = quizQuestions?.find(q => q?.id === parseInt(Object.keys(answers)?.find(key => answers?.[key] === answer)));
      const option = question?.options?.find(opt => opt?.value === answer);
      return sum + (option?.points || 0);
    }, 0);

    // Store results in localStorage
    const quizResults = {
      answers,
      totalScore,
      maxScore: quizQuestions?.length * 4,
      completedAt: new Date()?.toISOString(),
      timeElapsed
    };

    localStorage.setItem('quizResults', JSON.stringify(quizResults));

    // Navigate to results page
    setTimeout(() => {
      navigate('/free-results-page');
    }, 1500);
  };

  const handleExit = () => {
    const confirmExit = window.confirm('Tem certeza que deseja sair? Seu progresso será perdido.');
    if (confirmExit) {
      navigate('/quiz-landing-page');
    }
  };

  const currentQuestionData = quizQuestions?.find(q => q?.id === currentQuestion);
  const selectedAnswer = answers?.[currentQuestion];
  const canGoNext = selectedAnswer !== undefined;
  const canGoPrevious = currentQuestion > 1;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <QuizHeader
        onExit={handleExit}
        timeElapsed={timeElapsed}
      />
      <QuizProgress
        currentQuestion={currentQuestion}
        totalQuestions={quizQuestions?.length}
        completedQuestions={completedQuestions}
      />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Question Card */}
          <QuestionCard
            question={currentQuestionData}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            isAnswered={canGoNext}
          />

          {/* Navigation */}
          <QuizNavigation
            currentQuestion={currentQuestion}
            totalQuestions={quizQuestions?.length}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onFinish={handleFinish}
            isLoading={isLoading}
          />
        </div>

        {/* Motivation Section */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Você está no caminho certo! 🎯
            </h3>
            <p className="text-sm text-text-secondary">
              Cada resposta nos ajuda a criar um plano de estudos personalizado para você.
              Continue respondendo com sinceridade para obter os melhores resultados.
            </p>
          </div>
        </div>
      </main>
      {/* Loading Transition */}
      <LoadingTransition
        isVisible={isLoading}
        message={
          currentQuestion === quizQuestions?.length && canGoNext
            ? "Calculando seus resultados..."
            : "Carregando próxima questão..."
        }
      />
    </div>
  );
};

export default InteractiveQuizFlow;