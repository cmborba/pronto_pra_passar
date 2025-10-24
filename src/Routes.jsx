import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import AdminDashboard from './pages/admin-dashboard';
import FreeResultsPage from './pages/free-results-page';
import QuizLandingPage from './pages/quiz-landing-page';
import InteractiveQuizFlow from './pages/interactive-quiz-flow';
import PaymentCheckout from './pages/payment-checkout';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<QuizLandingPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/free-results-page" element={<FreeResultsPage />} />
        <Route path="/quiz-landing-page" element={<QuizLandingPage />} />
        <Route path="/interactive-quiz-flow" element={<InteractiveQuizFlow />} />
        <Route path="/payment-checkout" element={<PaymentCheckout />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
