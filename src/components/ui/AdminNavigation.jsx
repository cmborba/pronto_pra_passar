import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Select from './Select';

const AdminNavigation = ({
  onFilterChange = () => {},
  onExport = () => {},
  onRefresh = () => {},
  filters = {},
  isLoading = false,
  className = ""
}) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [dateRange, setDateRange] = useState('today');
  const [isExporting, setIsExporting] = useState(false);

  const filterOptions = [
    { value: 'all', label: 'Todos os Usuários' },
    { value: 'active', label: 'Usuários Ativos' },
    { value: 'completed', label: 'Quiz Completo' },
    { value: 'paid', label: 'Usuários Pagos' },
    { value: 'pending', label: 'Pagamento Pendente' }
  ];

  const dateRangeOptions = [
    { value: 'today', label: 'Hoje' },
    { value: 'week', label: 'Esta Semana' },
    { value: 'month', label: 'Este Mês' },
    { value: 'quarter', label: 'Trimestre' },
    { value: 'year', label: 'Este Ano' }
  ];

  const exportOptions = [
    { value: 'csv', label: 'Exportar CSV', icon: 'FileText' },
    { value: 'excel', label: 'Exportar Excel', icon: 'FileSpreadsheet' },
    { value: 'pdf', label: 'Relatório PDF', icon: 'FileDown' }
  ];

  const handleFilterChange = (type, value) => {
    const newFilters = { ...filters, [type]: value };
    
    if (type === 'status') {
      setActiveFilter(value);
    } else if (type === 'dateRange') {
      setDateRange(value);
    }
    
    onFilterChange(newFilters);
  };

  const handleExport = async (format) => {
    setIsExporting(true);
    try {
      await onExport(format, filters);
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefresh = () => {
    onRefresh();
  };

  return (
    <div className={`bg-surface border border-border rounded-lg p-4 ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Left Section - Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={20} color="var(--color-text-secondary)" />
            <span className="text-sm font-medium text-text-primary">Filtros:</span>
          </div>

          <Select
            options={filterOptions}
            value={activeFilter}
            onChange={(value) => handleFilterChange('status', value)}
            placeholder="Status do usuário"
            className="w-48"
          />

          <Select
            options={dateRangeOptions}
            value={dateRange}
            onChange={(value) => handleFilterChange('dateRange', value)}
            placeholder="Período"
            className="w-40"
          />
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            iconPosition="left"
            onClick={handleRefresh}
            loading={isLoading}
            disabled={isLoading}
          >
            Atualizar
          </Button>

          <div className="flex items-center space-x-2">
            {exportOptions?.map((option) => (
              <Button
                key={option?.value}
                variant="secondary"
                size="sm"
                iconName={option?.icon}
                iconPosition="left"
                onClick={() => handleExport(option?.value)}
                loading={isExporting}
                disabled={isExporting}
                className="hidden sm:flex"
              >
                {option?.label}
              </Button>
            ))}

            {/* Mobile Export Menu */}
            <div className="sm:hidden">
              <Button
                variant="secondary"
                size="sm"
                iconName="Download"
                iconPosition="left"
                loading={isExporting}
                disabled={isExporting}
              >
                Exportar
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold font-mono text-primary">1,247</div>
            <div className="text-xs text-text-secondary">Total de Usuários</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold font-mono text-success">892</div>
            <div className="text-xs text-text-secondary">Quiz Completo</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold font-mono text-accent">156</div>
            <div className="text-xs text-text-secondary">Conversões</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold font-mono text-warning">23</div>
            <div className="text-xs text-text-secondary">Pendentes</div>
          </div>
        </div>
      </div>
      {/* Active Filters Display */}
      {(activeFilter !== 'all' || dateRange !== 'today') && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-sm">
            <Icon name="Filter" size={16} color="var(--color-text-secondary)" />
            <span className="text-text-secondary">Filtros ativos:</span>
            
            {activeFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary text-primary-foreground text-xs">
                {filterOptions?.find(f => f?.value === activeFilter)?.label}
                <button
                  onClick={() => handleFilterChange('status', 'all')}
                  className="ml-1 hover:bg-primary-foreground hover:text-primary rounded-full p-0.5 transition-micro"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {dateRange !== 'today' && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs">
                {dateRangeOptions?.find(d => d?.value === dateRange)?.label}
                <button
                  onClick={() => handleFilterChange('dateRange', 'today')}
                  className="ml-1 hover:bg-secondary-foreground hover:text-secondary rounded-full p-0.5 transition-micro"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNavigation;