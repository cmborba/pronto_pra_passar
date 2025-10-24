import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';
import AuthModal from './AuthModal';

const Header = () => {
  const { user, userProfile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/quiz-landing-page');
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const getUserInitials = () => {
    if (userProfile?.full_name) {
      return userProfile?.full_name?.split(' ')?.map(word => word?.charAt(0))?.join('')?.toUpperCase()?.slice(0, 2);
    }
    return user?.email?.charAt(0)?.toUpperCase() || '?';
  };

  return (
    <>
      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              to="/quiz-landing-page" 
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <Icon name="GraduationCap" size={28} className="text-primary" />
              <span className="font-bold text-xl text-text-primary">QuizConcurso</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to="/quiz-landing-page" 
                className="text-muted-foreground hover:text-text-primary transition-colors"
              >
                Início
              </Link>
              <Link 
                to="/interactive-quiz-flow" 
                className="text-muted-foreground hover:text-text-primary transition-colors"
              >
                Quiz
              </Link>
              {user && userProfile?.role === 'admin' && (
                <Link 
                  to="/admin-dashboard" 
                  className="text-muted-foreground hover:text-text-primary transition-colors flex items-center space-x-1"
                >
                  <Icon name="Shield" size={16} />
                  <span>Admin</span>
                </Link>
              )}
            </nav>

            {/* Auth Section */}
            <div className="flex items-center space-x-3">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {getUserInitials()}
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-text-primary">
                        {userProfile?.full_name || 'Usuário'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {userProfile?.role === 'admin' ? 'Administrador' : 'Usuário'}
                      </p>
                    </div>
                    <Icon 
                      name={isUserMenuOpen ? "ChevronUp" : "ChevronDown"} 
                      size={16} 
                      className="text-muted-foreground" 
                    />
                  </button>

                  {/* User Menu Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-medium text-text-primary">
                          {userProfile?.full_name || 'Usuário'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                      
                      {userProfile?.role === 'admin' && (
                        <Link
                          to="/admin-dashboard"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-text-primary hover:bg-muted transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Icon name="Shield" size={16} />
                          <span>Painel Admin</span>
                        </Link>
                      )}
                      
                      <Link
                        to="/free-results-page"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-text-primary hover:bg-muted transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Icon name="FileText" size={16} />
                        <span>Meus Resultados</span>
                      </Link>
                      
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
                      >
                        <Icon name="LogOut" size={16} />
                        <span>Sair</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openAuthModal('login')}
                  >
                    Entrar
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => openAuthModal('signup')}
                  >
                    Criar Conta
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Close user menu when clicking outside */}
        {isUserMenuOpen && (
          <div 
            className="fixed inset-0 z-30" 
            onClick={() => setIsUserMenuOpen(false)}
          />
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
      />
    </>
  );
};

export default Header;