import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VideoSection = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const handlePlayVideo = () => {
    setShowVideo(true);
    setIsVideoLoaded(true);
  };

  return (
    <section className="bg-muted py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-text-primary mb-4">
            Veja como funciona na prática
          </h3>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Conheça nossa metodologia e veja depoimentos de quem já foi aprovado usando nosso sistema
          </p>
        </div>

        <div className="relative">
          <div className="aspect-video bg-card border border-border rounded-2xl overflow-hidden shadow-medium">
            {!showVideo ? (
            /* Video Thumbnail */
            <div className="relative w-full h-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center">
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                
                {/* Thumbnail Content */}
                <div className="relative z-10 text-center text-white">
                  <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                    <Icon name="Play" size={32} color="white" />
                  </div>
                  
                  <h4 className="text-2xl font-bold mb-2 text-amber-200">Como o Quiz Funciona

                </h4>
                  <p className="text-lg text-blue-100 mb-6">
                    3 minutos que podem mudar sua aprovação
                  </p>
                  
                  <Button
                  variant="success"
                  size="lg"
                  iconName="Play"
                  iconPosition="left"
                  onClick={handlePlayVideo}
                  className="shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">

                    Assistir Agora
                  </Button>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 left-4 w-3 h-3 bg-white bg-opacity-30 rounded-full"></div>
                <div className="absolute top-8 right-8 w-2 h-2 bg-white bg-opacity-40 rounded-full"></div>
                <div className="absolute bottom-6 left-8 w-4 h-4 bg-white bg-opacity-20 rounded-full"></div>
              </div>) : (

            /* YouTube Video */
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1"
              title="Como funciona o Quiz Pronto pra Passar - Metodologia de Estudos para Concursos"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
              onLoad={() => setIsVideoLoaded(true)} />)

            }
          </div>

          {/* Video Stats */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                <Icon name="Eye" size={24} color="white" />
              </div>
              <div className="text-2xl font-bold font-mono text-text-primary">47.892</div>
              <div className="text-sm text-text-secondary">Visualizações</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center mx-auto mb-3">
                <Icon name="ThumbsUp" size={24} color="white" />
              </div>
              <div className="text-2xl font-bold font-mono text-text-primary">2.156</div>
              <div className="text-sm text-text-secondary">Curtidas</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-3">
                <Icon name="MessageCircle" size={24} color="white" />
              </div>
              <div className="text-2xl font-bold font-mono text-text-primary">389</div>
              <div className="text-sm text-text-secondary">Comentários</div>
            </div>
          </div>

          {/* Key Points */}
          <div className="mt-12 bg-card border border-border rounded-xl p-6">
            <h4 className="text-xl font-semibold text-text-primary mb-6 text-center">
              O que você vai descobrir no vídeo:
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="Check" size={14} color="white" />
                </div>
                <span className="text-text-secondary">
                  Como identificar seus pontos fracos em apenas 7 perguntas
                </span>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="Check" size={14} color="white" />
                </div>
                <span className="text-text-secondary">
                  Por que nosso método funciona para quem trabalha
                </span>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="Check" size={14} color="white" />
                </div>
                <span className="text-text-secondary">
                  Depoimentos reais de aprovados em 2024
                </span>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="Check" size={14} color="white" />
                </div>
                <span className="text-text-secondary">
                  Como otimizar seu tempo de estudo
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default VideoSection;