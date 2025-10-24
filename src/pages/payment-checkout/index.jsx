import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { paymentService } from '../../services/paymentService';
import { quizService } from '../../services/quizService';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import OrderSummary from './components/OrderSummary';
import PaymentForm from './components/PaymentForm';
import PaymentSuccess from './components/PaymentSuccess';
import PaymentError from './components/PaymentError';
import Button from '../../components/ui/Button';
import AuthModal from '../../components/ui/AuthModal';

const PaymentCheckout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  // Get quiz session ID from URL params or state
  const quizSessionId = searchParams?.get('session');
  
  const [step, setStep] = useState('form'); // 'form', 'processing', 'success', 'error'
  const [isLoading, setIsLoading] = useState(false);
  const [quizSession, setQuizSession] = useState(null);
  const [product, setProduct] = useState(null);
  const [order, setOrder] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Load quiz session and product data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Load quiz session data if available
        if (quizSessionId && quizService?.getQuizSession) {
          const { data: sessionData } = await quizService?.getQuizSession(quizSessionId);
          setQuizSession(sessionData);
        }

        // Load available products (getting the first active product)
        const { data: products } = await paymentService?.getProducts();
        if (products?.length > 0) {
          setProduct(products?.[0]);
        }
      } catch (error) {
        setPaymentError('Erro ao carregar dados do produto');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [quizSessionId]);

  const handlePaymentSubmit = async (customerData) => {
    try {
      setIsLoading(true);
      setStep('processing');

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      if (!product) {
        throw new Error('Produto não encontrado');
      }

      // Prepare customer info for Stripe
      const customerInfo = {
        userId: user?.id,
        name: customerData?.name,
        fullName: customerData?.name,
        email: customerData?.email,
        phone: customerData?.phone,
        cpf: customerData?.cpf,
        acceptTerms: customerData?.acceptTerms,
        acceptMarketing: customerData?.acceptMarketing,
        stripeCustomerId: user?.stripe_customer_id || null
      };

      // Prepare order data for payment intent
      const orderForPayment = {
        productId: product?.id,
        productName: product?.name,
        amount: product?.price,
        currency: product?.currency || 'BRL',
        quizSessionId: quizSessionId || null
      };

      // Create payment intent via Supabase Edge Function
      const { data: paymentData, error: paymentError } = await paymentService?.createPaymentIntent(
        orderForPayment,
        customerInfo
      );

      if (paymentError || !paymentData) {
        throw new Error(paymentError?.message || 'Erro ao criar intenção de pagamento');
      }

      // Store order data for success page
      setOrder({
        id: paymentData?.orderId,
        orderNumber: paymentData?.orderNumber,
        amount: product?.price,
        currency: product?.currency || 'BRL',
        paymentIntentId: paymentData?.paymentIntentId
      });

      // Simulate payment confirmation for development
      // In production, this would be handled by Stripe webhooks
      setTimeout(async () => {
        try {
          // Confirm payment via Edge Function
          const { data: confirmData, error: confirmError } = await paymentService?.confirmPayment(
            paymentData?.paymentIntentId
          );

          if (confirmError) {
            throw confirmError;
          }

          // Update quiz session if exists
          if (quizSessionId && quizService?.updateQuizSession) {
            await quizService?.updateQuizSession(quizSessionId, {
              payment_completed: true,
              payment_completed_at: new Date()?.toISOString()
            });
          }

          setStep('success');
        } catch (error) {
          console.error('Payment confirmation error:', error);
          setPaymentError('Erro ao confirmar pagamento: ' + error?.message);
          setStep('error');
        } finally {
          setIsLoading(false);
        }
      }, 3000); // Simulate processing time

    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError(error?.message || 'Erro no processamento do pagamento');
      setStep('error');
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setStep('form');
    setPaymentError(null);
  };

  const handleGoBack = () => {
    if (quizSessionId) {
      navigate(`/free-results-page?session=${quizSessionId}`);
    } else {
      navigate('/free-results-page');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="flex items-center justify-center min-h-[80vh] p-4">
          <div className="bg-background border border-border rounded-lg p-8 max-w-md w-full text-center shadow-lg">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="UserPlus" size={32} className="text-primary" />
            </div>
            
            <h1 className="text-2xl font-bold text-text-primary mb-4">
              Você precisa criar uma conta antes de finalizar o pagamento
            </h1>
            
            <p className="text-text-secondary mb-8 leading-relaxed">
              Para concluir sua compra e receber seu plano de estudos personalizado, 
              é necessário ter uma conta. O processo é rápido e seguro!
            </p>
            
            <div className="space-y-4">
              <Button
                onClick={() => setShowAuthModal(true)}
                className="w-full"
                size="lg"
              >
                <Icon name="UserPlus" size={20} className="mr-2" />
                Criar conta agora
              </Button>
              
              <Button
                onClick={() => navigate('/quiz-landing-page')}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Icon name="ArrowLeft" size={20} className="mr-2" />
                Voltar ao início
              </Button>
            </div>
            
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Shield" size={16} />
                <span>Seus dados estão protegidos e seguros</span>
              </div>
            </div>
          </div>
        </div>
        
        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            initialMode="signup"
          />
        )}
      </div>
    );
  }

  if (isLoading && !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      {step === 'form' && (
        <div className="bg-muted border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-2 text-sm">
              <button
                onClick={() => navigate('/quiz-landing-page')}
                className="text-text-secondary hover:text-text-primary transition-micro"
              >
                Início
              </button>
              <Icon name="ChevronRight" size={16} color="var(--color-text-secondary)" />
              <button
                onClick={handleGoBack}
                className="text-text-secondary hover:text-text-primary transition-micro"
              >
                Resultados
              </button>
              <Icon name="ChevronRight" size={16} color="var(--color-text-secondary)" />
              <span className="text-text-primary font-medium">Pagamento</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === 'form' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary - Left Column */}
            <div className="lg:col-span-1">
              <OrderSummary orderDetails={{
                amount: product?.price || 4.90,
                currency: product?.currency || 'BRL',
                product: product?.name || 'Plano de Estudos Personalizado',
                description: product?.description,
                quizScore: quizSession?.preparation_score || 65,
                quizSession
              }} />
            </div>

            {/* Payment Form - Right Columns */}
            <div className="lg:col-span-2">
              <div className="bg-background border border-border rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Icon name="Lock" size={24} color="var(--color-success)" />
                  <div>
                    <h2 className="text-2xl font-bold text-text-primary">
                      Finalizar compra
                    </h2>
                    <p className="text-text-secondary">
                      Pagamento seguro e criptografado
                    </p>
                  </div>
                </div>

                <PaymentForm 
                  onSubmit={handlePaymentSubmit}
                  isLoading={isLoading}
                  product={product}
                />
              </div>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Icon name="CreditCard" size={32} color="white" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Processando pagamento...
            </h2>
            <p className="text-text-secondary mb-8">
              Aguarde enquanto confirmamos seu pagamento. Isso pode levar alguns segundos.
            </p>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}

        {step === 'success' && (
          <PaymentSuccess
            orderData={order}
            product={product}
            onContinue={() => navigate('/quiz-landing-page')}
          />
        )}

        {step === 'error' && (
          <PaymentError
            errorData={paymentError}
            onRetry={handleRetry}
            onGoBack={handleGoBack}
          />
        )}
      </main>

      {/* Trust Signals Footer */}
      {step === 'form' && (
        <footer className="bg-surface border-t border-border mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center">
                <Icon name="Shield" size={32} color="var(--color-success)" className="mb-2" />
                <span className="text-sm font-medium text-text-primary">Pagamento Seguro</span>
                <span className="text-xs text-text-secondary">SSL 256 bits</span>
              </div>
              
              <div className="flex flex-col items-center">
                <Icon name="Clock" size={32} color="var(--color-primary)" className="mb-2" />
                <span className="text-sm font-medium text-text-primary">Entrega Rápida</span>
                <span className="text-xs text-text-secondary">Até 5 minutos</span>
              </div>
              
              <div className="flex flex-col items-center">
                <Icon name="RefreshCw" size={32} color="var(--color-warning)" className="mb-2" />
                <span className="text-sm font-medium text-text-primary">Garantia</span>
                <span className="text-xs text-text-secondary">7 dias</span>
              </div>
              
              <div className="flex flex-col items-center">
                <Icon name="MessageCircle" size={32} color="var(--color-accent)" className="mb-2" />
                <span className="text-sm font-medium text-text-primary">Suporte</span>
                <span className="text-xs text-text-secondary">24/7</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default PaymentCheckout;