import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ShareModal = ({ isOpen, onClose, userScore = 67 }) => {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  if (!isOpen) return null;

  const shareUrl = `${window.location?.origin}/quiz-landing-page?ref=shared`;
  const shareText = `Acabei de descobrir meu nível de preparação para concursos: ${userScore}%! Faça o seu teste também no Pronto pra Passar.`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard?.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar link:', err);
    }
  };

  const handleEmailShare = async () => {
    if (!email) return;
    
    setIsSharing(true);
    // Simulate email sharing
    setTimeout(() => {
      setIsSharing(false);
      setEmail('');
      onClose();
    }, 1500);
  };

  const handleSocialShare = (platform) => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);
    
    let shareLink = '';
    
    switch (platform) {
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodedText} ${encodedUrl}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">
            Compartilhar Resultado
          </h2>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
          />
        </div>

        {/* Score display */}
        <div className="text-center mb-6 p-4 bg-muted rounded-lg">
          <div className="text-3xl font-bold text-primary mb-1">{userScore}%</div>
          <div className="text-sm text-text-secondary">Nível de Preparação</div>
        </div>

        {/* Copy link */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-primary mb-2">
            Link para compartilhar:
          </label>
          <div className="flex space-x-2">
            <Input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 text-sm"
            />
            <Button
              variant={copied ? "success" : "outline"}
              size="sm"
              iconName={copied ? "Check" : "Copy"}
              onClick={handleCopyLink}
            >
              {copied ? "Copiado!" : "Copiar"}
            </Button>
          </div>
        </div>

        {/* Social sharing */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-primary mb-3">
            Compartilhar nas redes sociais:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="sm"
              iconName="MessageCircle"
              iconPosition="left"
              onClick={() => handleSocialShare('whatsapp')}
              className="justify-start"
            >
              WhatsApp
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              iconName="Facebook"
              iconPosition="left"
              onClick={() => handleSocialShare('facebook')}
              className="justify-start"
            >
              Facebook
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              iconName="Twitter"
              iconPosition="left"
              onClick={() => handleSocialShare('twitter')}
              className="justify-start"
            >
              Twitter
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              iconName="Linkedin"
              iconPosition="left"
              onClick={() => handleSocialShare('linkedin')}
              className="justify-start"
            >
              LinkedIn
            </Button>
          </div>
        </div>

        {/* Email sharing */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-primary mb-2">
            Enviar por email:
          </label>
          <div className="flex space-x-2">
            <Input
              type="email"
              placeholder="Digite o email do destinatário"
              value={email}
              onChange={(e) => setEmail(e?.target?.value)}
              className="flex-1"
            />
            <Button
              variant="primary"
              size="sm"
              iconName="Send"
              onClick={handleEmailShare}
              loading={isSharing}
              disabled={!email || isSharing}
            >
              Enviar
            </Button>
          </div>
        </div>

        {/* Close button */}
        <Button
          variant="outline"
          fullWidth
          onClick={onClose}
        >
          Fechar
        </Button>
      </div>
    </div>
  );
};

export default ShareModal;