import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import AdminNavigation from '../../components/ui/AdminNavigation';
import MetricsCard from './components/MetricsCard';
import UserDataTable from './components/UserDataTable';
import ConversionChart from './components/ConversionChart';
import RevenueChart from './components/RevenueChart';
import UserDetailModal from './components/UserDetailModal';
import ActivityFeed from './components/ActivityFeed';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

const AdminDashboard = () => {
  const { user, userProfile, loading } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [chartType, setChartType] = useState('bar');
  
  // Supabase data states
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    completedQuizzes: 0,
    conversionRate: 0,
    totalRevenue: 0
  });

  // Authentication and authorization check
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/quiz-landing-page" replace />;
  }

  // Redirect if not admin
  if (userProfile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <Icon name="Shield" size={64} className="text-destructive mx-auto" />
          <h1 className="text-2xl font-bold text-text-primary">Acesso Negado</h1>
          <p className="text-muted-foreground">
            Você não tem permissão para acessar o painel administrativo.
          </p>
          <Button 
            onClick={() => window.history?.back()}
            variant="outline"
          >
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load users with their quiz sessions and orders
      const { data: usersData, error: usersError } = await supabase?.from('user_profiles')?.select(`
          *,
          quiz_sessions!user_profiles_quiz_sessions_user_id_fkey (
            id,
            status,
            preparation_score,
            completed_at,
            created_at
          ),
          orders!orders_user_id_fkey (
            id,
            status,
            payment_status,
            amount,
            payment_method,
            transaction_id,
            created_at
          )
        `)?.order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Transform data for the dashboard
      const transformedUsers = usersData?.map(user => {
        const completedSessions = user?.quiz_sessions?.filter(s => s?.status === 'completed') || [];
        const paidOrders = user?.orders?.filter(o => o?.payment_status === 'succeeded') || [];
        
        return {
          id: user?.id,
          name: user?.full_name || 'Usuário Anônimo',
          email: user?.email,
          completedAt: completedSessions?.[0]?.completed_at ? 
            new Date(completedSessions[0].completed_at)?.toLocaleDateString('pt-BR') : null,
          completedTime: completedSessions?.[0]?.completed_at ? 
            new Date(completedSessions[0].completed_at)?.toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }) : null,
          preparationLevel: completedSessions?.[0]?.preparation_score || 0,
          status: paidOrders?.length > 0 ? 'paid' : 
                 completedSessions?.length > 0 ? 'completed' : 'pending',
          paymentMethod: paidOrders?.[0]?.payment_method || null,
          paymentAmount: paidOrders?.[0]?.amount ? 
            `R$ ${Number(paidOrders?.[0]?.amount)?.toFixed(2)?.replace('.', ',')}` : null,
          transactionId: paidOrders?.[0]?.transaction_id || null,
          paymentDate: paidOrders?.[0]?.created_at ? 
            new Date(paidOrders[0].created_at)?.toLocaleDateString('pt-BR') : null,
          quizAnswers: [] // Will be loaded separately if needed
        };
      }) || [];

      setUsers(transformedUsers);

      // Calculate metrics
      const totalUsers = usersData?.length || 0;
      const completedQuizzes = usersData?.reduce((acc, user) => 
        acc + (user?.quiz_sessions?.filter(s => s?.status === 'completed')?.length || 0), 0) || 0;
      const paidUsers = usersData?.filter(user => 
        user?.orders?.some(o => o?.payment_status === 'succeeded'))?.length || 0;
      const conversionRate = totalUsers > 0 ? ((paidUsers / totalUsers) * 100)?.toFixed(1) : '0';
      const totalRevenue = usersData?.reduce((acc, user) => {
        const userRevenue = user?.orders
          ?.filter(o => o?.payment_status === 'succeeded')
          ?.reduce((sum, order) => sum + (Number(order?.amount) || 0), 0) || 0;
        return acc + userRevenue;
      }, 0) || 0;

      setMetrics({
        totalUsers,
        completedQuizzes,
        conversionRate: `${conversionRate}%`,
        totalRevenue: `R$ ${totalRevenue?.toFixed(2)?.replace('.', ',')}`
      });

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      // Show user-friendly error message without console.error for Supabase responses
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSelect = async (user) => {
    try {
      // Load quiz answers for the selected user
      const { data: sessions } = await supabase?.from('quiz_sessions')?.select(`
          *,
          quiz_answers!quiz_answers_session_id_fkey (
            answer_text,
            question_order
          )
        `)?.eq('user_id', user?.id)?.eq('status', 'completed')?.order('completed_at', { ascending: false })?.limit(1);

      const latestSession = sessions?.[0];
      const quizAnswers = latestSession?.quiz_answers
        ?.sort((a, b) => a?.question_order - b?.question_order)
        ?.map(answer => answer?.answer_text) || [];

      setSelectedUser({
        ...user,
        quizAnswers
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error('Erro ao carregar respostas do usuário:', error);
      setSelectedUser(user);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleExport = async (format) => {
    setIsLoading(true);
    try {
      // In a real implementation, you would export the actual data
      // For now, we'll simulate the export process
      setTimeout(() => {
        setIsLoading(false);
        alert(`Dados exportados em formato ${format?.toUpperCase()}`);
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      console.error('Erro ao exportar dados:', error);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Painel Administrativo</h1>
              <p className="text-text-secondary mt-2">
                Monitore conversões, analise dados e gerencie usuários do quiz
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Logado como: {userProfile?.full_name} ({userProfile?.email})
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                iconName="RefreshCw"
                iconPosition="left"
                onClick={handleRefresh}
                loading={isLoading}
              >
                Atualizar
              </Button>
              <Button
                variant="default"
                size="sm"
                iconName="Download"
                iconPosition="left"
                onClick={() => handleExport('csv')}
              >
                Exportar Relatório
              </Button>
            </div>
          </div>
        </div>

        {/* Admin Navigation */}
        <AdminNavigation
          onFilterChange={handleFilterChange}
          onExport={handleExport}
          onRefresh={handleRefresh}
          filters={filters}
          isLoading={isLoading}
          className="mb-8"
        />

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricsCard
            title="Total de Usuários"
            value={metrics?.totalUsers?.toString() || '0'}
            change="+12.5%"
            changeType="positive"
            icon="Users"
            color="primary"
          />
          <MetricsCard
            title="Quiz Completos"
            value={metrics?.completedQuizzes?.toString() || '0'}
            change="+8.2%"
            changeType="positive"
            icon="CheckCircle"
            color="success"
          />
          <MetricsCard
            title="Taxa de Conversão"
            value={metrics?.conversionRate || '0%'}
            change="+2.1%"
            changeType="positive"
            icon="TrendingUp"
            color="success"
          />
          <MetricsCard
            title="Receita Total"
            value={metrics?.totalRevenue || 'R$ 0,00'}
            change="+15.3%"
            changeType="positive"
            icon="DollarSign"
            color="success"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-text-primary">Análise de Conversões</h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant={chartType === 'bar' ? 'default' : 'outline'}
                  size="sm"
                  iconName="BarChart3"
                  onClick={() => setChartType('bar')}
                />
                <Button
                  variant={chartType === 'line' ? 'default' : 'outline'}
                  size="sm"
                  iconName="TrendingUp"
                  onClick={() => setChartType('line')}
                />
              </div>
            </div>
            <ConversionChart type={chartType} data={users} />
          </div>
          
          <RevenueChart />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* User Data Table */}
          <div className="xl:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text-primary">Dados dos Usuários</h2>
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <Icon name="Clock" size={16} />
                <span>Atualizado há poucos segundos</span>
              </div>
            </div>
            <UserDataTable
              users={users}
              onUserSelect={handleUserSelect}
              onExport={() => handleExport('csv')}
              isLoading={isLoading}
            />
          </div>

          {/* Activity Feed */}
          <div>
            <ActivityFeed />
          </div>
        </div>

        {/* Additional Analytics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary">Abandono por Questão</h3>
              <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6, 7]?.map((question) => (
                <div key={question} className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Questão {question}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div
                        className="bg-error h-2 rounded-full"
                        style={{ width: `${Math.max(5, 25 - question * 3)}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-text-secondary">
                      {Math.max(5, 25 - question * 3)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary">Métodos de Pagamento</h3>
              <Icon name="CreditCard" size={20} color="var(--color-primary)" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">PIX</span>
                <span className="font-mono font-semibold text-text-primary">67%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Cartão de Crédito</span>
                <span className="font-mono font-semibold text-text-primary">28%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Cartão de Débito</span>
                <span className="font-mono font-semibold text-text-primary">5%</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary">Horários de Pico</h3>
              <Icon name="Clock" size={20} color="var(--color-success)" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">14h - 16h</span>
                <span className="font-mono font-semibold text-success">Pico</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">20h - 22h</span>
                <span className="font-mono font-semibold text-primary">Alto</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">10h - 12h</span>
                <span className="font-mono font-semibold text-warning">Médio</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      <UserDetailModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default AdminDashboard;