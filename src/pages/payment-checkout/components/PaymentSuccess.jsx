import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { emailService } from '../../../services/emailService';
import Header from '../../../components/ui/Header';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentSuccess = ({ orderData, product, onContinue }) => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sendOrderEmail = async () => {
      if (!orderData || !user) return;

      try {
        setIsLoading(true);
        
        // Get quiz session data from URL params if available
        const urlParams = new URLSearchParams(window.location.search);
        const quizSessionId = urlParams?.get('session');
        
        let quizData = null;
        if (quizSessionId) {
          // Get quiz answers from service
          const { data: answers } = await emailService?.getQuizAnswersForEmail(quizSessionId);
          if (answers) {
            quizData = { answers };
          }
        }

        const emailData = {
          customerName: userProfile?.full_name || user?.user_metadata?.full_name || 'Cliente',
          customerEmail: user?.email,
          orderNumber: orderData?.orderNumber,
          planType: product?.name || 'Plano de Estudos Personalizado',
          amount: orderData?.amount || product?.price || 7.90,
          currency: orderData?.currency || 'BRL',
          purchaseDate: new Date()?.toISOString(),
          quizAnswers: quizData?.answers || []
        };

        const { success, error } = await emailService?.sendOrderNotification(emailData);
        
        if (success) {
          setEmailSent(true);
        } else {
          setEmailError(error?.message || 'Erro ao enviar email de confirmação');
        }
      } catch (error) {
        setEmailError('Erro ao processar confirmação do pedido');
      } finally {
        setIsLoading(false);
      }
    };

    sendOrderEmail();
  }, [orderData, user, userProfile, product]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl border-2 border-green-200 p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="CheckCircle" size={48} className="text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Pagamento Realizado com Sucesso! 🎉
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Parabéns! Sua compra foi processada e você receberá seu plano de estudos personalizado em breve.
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Icon name="FileText" size={20} className="mr-2" />
              Detalhes do Pedido
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Número do Pedido:</span>
                <span className="font-mono font-medium">
                  {orderData?.orderNumber || '#000001'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Produto:</span>
                <span className="font-medium">
                  {product?.name || 'Plano de Estudos Personalizado'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Valor Pago:</span>
                <span className="font-bold text-green-600">
                  R$ {(orderData?.amount || product?.price || 7.90)?.toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Data da Compra:</span>
                <span className="font-medium">
                  {new Date()?.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Email Status */}
          <div className="mb-8">
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2 text-blue-600">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span>Enviando confirmação por email...</span>
              </div>
            ) : emailSent ? (
              <div className="flex items-center justify-center space-x-2 text-green-600 bg-green-50 rounded-lg p-4">
                <Icon name="Mail" size={20} />
                <span>Notificação enviada para planodeestudos@prontoprapassar.shop</span>
              </div>
            ) : emailError ? (
              <div className="flex items-center justify-center space-x-2 text-orange-600 bg-orange-50 rounded-lg p-4">
                <Icon name="AlertTriangle" size={20} />
                <span>Seu pedido foi processado. A confirmação será enviada em breve.</span>
              </div>
            ) : null}
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <Icon name="Clock" size={20} className="mr-2" />
              Próximos Passos
            </h3>
            
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start">
                <Icon name="Check" size={16} className="mr-2 mt-0.5 text-blue-600" />
                Suas informações foram enviadas para nossa equipe
              </li>
              <li className="flex items-start">
                <Icon name="Check" size={16} className="mr-2 mt-0.5 text-blue-600" />
                Seu plano de estudos personalizado será preparado
              </li>
              <li className="flex items-start">
                <Icon name="Check" size={16} className="mr-2 mt-0.5 text-blue-600" />
                Você receberá o material por email em até 5 minutos
              </li>
              <li className="flex items-start">
                <Icon name="Check" size={16} className="mr-2 mt-0.5 text-blue-600" />
                Suporte disponível 24/7 para dúvidas
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              onClick={() => navigate('/quiz-landing-page')}
              size="lg"
              className="w-full"
            >
              <Icon name="Home" size={20} className="mr-2" />
              Voltar ao Início
            </Button>
            
            <button
              onClick={() => window.open('mailto:planodeestudos@prontoprapassar.shop', '_blank')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Precisa de ajuda? Entre em contato conosco
            </button>
          </div>

          {/* Security Note */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Icon name="Shield" size={16} />
              <span>
                Transação processada com segurança via Stripe. 
                Seus dados estão protegidos.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;