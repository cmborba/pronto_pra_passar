import React, { useState } from 'react';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const AuthModal = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login',
  redirectToCheckout = false 
}) => {
  const [currentMode, setCurrentMode] = useState(initialMode);

  if (!isOpen) return null;

  const handleSwitchToLogin = () => setCurrentMode('login');
  const handleSwitchToSignup = () => setCurrentMode('signup');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-micro"
        >
          <X size={24} />
        </button>

        <div className="p-6">
          {currentMode === 'login' ? (
            <LoginForm
              onClose={onClose}
              onSwitchToSignup={handleSwitchToSignup}
              redirectToCheckout={redirectToCheckout}
            />
          ) : (
            <SignupForm
              onClose={onClose}
              onSwitchToLogin={handleSwitchToLogin}
              redirectToCheckout={redirectToCheckout}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;