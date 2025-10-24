import React from 'react';

import Button from '../../../components/ui/Button';

const UserDetailModal = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null;

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-success text-success-foreground', label: 'Quiz Completo' },
      paid: { color: 'bg-primary text-primary-foreground', label: 'Pagamento Confirmado' },
      pending: { color: 'bg-warning text-warning-foreground', label: 'Pagamento Pendente' },
      abandoned: { color: 'bg-error text-error-foreground', label: 'Abandonado' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.abandoned;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const quizQuestions = [
    "Há quanto tempo você estuda para concursos?",
    "Quantas horas por dia você consegue dedicar aos estudos?",
    "Qual é o seu maior desafio nos estudos?",
    "Você já foi aprovado em algum concurso?",
    "Qual área de concurso mais te interessa?",
    "Como você avalia seu nível de preparação atual?",
    "Qual é sua principal motivação para passar em um concurso?"
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold text-primary-foreground">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">{user?.name}</h2>
              <p className="text-text-secondary">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
          />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Informações do Usuário</h3>
                <div className="bg-surface border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Status:</span>
                    {getStatusBadge(user?.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Data de Conclusão:</span>
                    <span className="font-medium text-text-primary">{user?.completedAt}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Horário:</span>
                    <span className="font-medium text-text-primary">{user?.completedTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Nível de Preparação:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${user?.preparationLevel}%` }}
                        />
                      </div>
                      <span className="font-mono font-semibold text-text-primary">{user?.preparationLevel}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Informações de Pagamento</h3>
                <div className="bg-surface border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Método de Pagamento:</span>
                    <span className="font-medium text-text-primary">{user?.paymentMethod || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Valor:</span>
                    <span className="font-mono font-semibold text-success">{user?.paymentAmount || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">ID da Transação:</span>
                    <span className="font-mono text-text-primary text-sm">{user?.transactionId || 'N/A'}</span>
                  </div>
                  {user?.paymentDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Data do Pagamento:</span>
                      <span className="font-medium text-text-primary">{user?.paymentDate}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quiz Responses */}
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">Respostas do Quiz</h3>
              <div className="space-y-4">
                {user?.quizAnswers?.map((answer, index) => (
                  <div key={index} className="bg-surface border border-border rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-primary-foreground">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-primary mb-2">
                          {quizQuestions?.[index]}
                        </p>
                        <p className="text-sm text-text-secondary bg-muted rounded-md p-2">
                          {answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              iconName="Download"
              iconPosition="left"
            >
              Exportar Dados
            </Button>
            <Button
              variant="outline"
              iconName="Mail"
              iconPosition="left"
            >
              Enviar Email
            </Button>
            {user?.status === 'pending' && (
              <Button
                variant="default"
                iconName="CreditCard"
                iconPosition="left"
              >
                Processar Pagamento
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;