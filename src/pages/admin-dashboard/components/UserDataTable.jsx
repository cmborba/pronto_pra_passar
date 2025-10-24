import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const UserDataTable = ({ users, onUserSelect, onExport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'completedAt', direction: 'desc' });
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedRows, setExpandedRows] = useState(new Set());

  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'completed', label: 'Quiz Completo' },
    { value: 'paid', label: 'Pagamento Confirmado' },
    { value: 'pending', label: 'Pagamento Pendente' },
    { value: 'abandoned', label: 'Abandonado' }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-success text-success-foreground', label: 'Completo' },
      paid: { color: 'bg-primary text-primary-foreground', label: 'Pago' },
      pending: { color: 'bg-warning text-warning-foreground', label: 'Pendente' },
      abandoned: { color: 'bg-error text-error-foreground', label: 'Abandonado' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.abandoned;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const toggleRowExpansion = (userId) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet?.has(userId)) {
        newSet?.delete(userId);
      } else {
        newSet?.add(userId);
      }
      return newSet;
    });
  };

  const filteredAndSortedUsers = users?.filter(user => {
      const matchesSearch = user?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           user?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const matchesStatus = statusFilter === 'all' || user?.status === statusFilter;
      return matchesSearch && matchesStatus;
    })?.sort((a, b) => {
      const aValue = a?.[sortConfig?.key];
      const bValue = b?.[sortConfig?.key];
      
      if (sortConfig?.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-border bg-surface">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <Input
              type="search"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-64"
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-48"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={onExport}
          >
            Exportar Dados
          </Button>
        </div>
      </div>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary transition-micro"
                >
                  <span>Usuário</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('completedAt')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary transition-micro"
                >
                  <span>Data</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('preparationLevel')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary transition-micro"
                >
                  <span>Preparação</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredAndSortedUsers?.map((user) => (
              <React.Fragment key={user?.id}>
                <tr className="hover:bg-muted/50 transition-micro">
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-foreground">
                          {user?.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{user?.name}</p>
                        <p className="text-xs text-text-secondary">{user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm text-text-primary">{user?.completedAt}</p>
                      <p className="text-xs text-text-secondary">{user?.completedTime}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${user?.preparationLevel}%` }}
                        />
                      </div>
                      <span className="text-sm font-mono text-text-primary">{user?.preparationLevel}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(user?.status)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName={expandedRows?.has(user?.id) ? 'ChevronUp' : 'ChevronDown'}
                        onClick={() => toggleRowExpansion(user?.id)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Eye"
                        onClick={() => onUserSelect(user)}
                      />
                    </div>
                  </td>
                </tr>
                {expandedRows?.has(user?.id) && (
                  <tr>
                    <td colSpan="5" className="px-4 py-3 bg-surface">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-text-primary mb-1">Respostas do Quiz:</p>
                          <div className="space-y-1">
                            {user?.quizAnswers?.map((answer, index) => (
                              <p key={index} className="text-text-secondary">
                                Q{index + 1}: {answer}
                              </p>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-text-primary mb-1">Informações de Pagamento:</p>
                          <div className="space-y-1">
                            <p className="text-text-secondary">Método: {user?.paymentMethod || 'N/A'}</p>
                            <p className="text-text-secondary">Valor: {user?.paymentAmount || 'N/A'}</p>
                            <p className="text-text-secondary">ID Transação: {user?.transactionId || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-border">
        {filteredAndSortedUsers?.map((user) => (
          <div key={user?.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-foreground">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-text-primary">{user?.name}</p>
                  <p className="text-sm text-text-secondary">{user?.email}</p>
                </div>
              </div>
              {getStatusBadge(user?.status)}
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-text-secondary">Data:</p>
                <p className="font-medium text-text-primary">{user?.completedAt}</p>
              </div>
              <div>
                <p className="text-text-secondary">Preparação:</p>
                <div className="flex items-center space-x-2">
                  <div className="w-12 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${user?.preparationLevel}%` }}
                    />
                  </div>
                  <span className="font-mono font-medium text-text-primary">{user?.preparationLevel}%</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-2 mt-3">
              <Button
                variant="ghost"
                size="sm"
                iconName="Eye"
                onClick={() => onUserSelect(user)}
              >
                Ver Detalhes
              </Button>
            </div>
          </div>
        ))}
      </div>
      {filteredAndSortedUsers?.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Search" size={48} color="var(--color-text-secondary)" className="mx-auto mb-4" />
          <p className="text-text-secondary">Nenhum usuário encontrado com os filtros aplicados.</p>
        </div>
      )}
    </div>
  );
};

export default UserDataTable;