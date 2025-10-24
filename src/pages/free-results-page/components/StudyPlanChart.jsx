import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const StudyPlanChart = ({ studyData = [] }) => {
  const defaultStudyData = [
    { day: 'Seg', hours: 2, subject: 'Português' },
    { day: 'Ter', hours: 1.5, subject: 'Matemática' },
    { day: 'Qua', hours: 2, subject: 'Português' },
    { day: 'Qui', hours: 1, subject: 'Conhecimentos Gerais' },
    { day: 'Sex', hours: 2.5, subject: 'Matemática' },
    { day: 'Sáb', hours: 3, subject: 'Revisão Geral' },
    { day: 'Dom', hours: 1, subject: 'Descanso Ativo' }
  ];

  const chartData = studyData?.length > 0 ? studyData : defaultStudyData;
  const totalWeeklyHours = chartData?.reduce((sum, day) => sum + day?.hours, 0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-medium">
          <p className="font-medium text-text-primary">{label}</p>
          <p className="text-sm text-primary">
            {payload?.[0]?.value}h - {payload?.[0]?.payload?.subject}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={24} color="var(--color-primary)" />
          <h2 className="text-xl font-semibold text-text-primary">
            Plano Semanal Sugerido
          </h2>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold font-mono text-primary">
            {totalWeeklyHours}h
          </div>
          <div className="text-sm text-text-secondary">por semana</div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 mb-6" aria-label="Gráfico de barras do plano de estudos semanal">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="day" 
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-text-secondary)"
              fontSize={12}
              label={{ value: 'Horas', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="hours" 
              fill="var(--color-primary)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Study tips */}
      <div className="bg-muted rounded-lg p-4">
        <h3 className="font-medium text-text-primary mb-3 flex items-center space-x-2">
          <Icon name="Lightbulb" size={16} />
          <span>Dicas para seu cronograma:</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start space-x-2">
            <Icon name="Clock" size={14} color="var(--color-success)" className="mt-0.5 flex-shrink-0" />
            <span className="text-text-secondary">
              Estude nos mesmos horários para criar rotina
            </span>
          </div>
          
          <div className="flex items-start space-x-2">
            <Icon name="Coffee" size={14} color="var(--color-success)" className="mt-0.5 flex-shrink-0" />
            <span className="text-text-secondary">
              Faça pausas de 10 min a cada hora
            </span>
          </div>
          
          <div className="flex items-start space-x-2 opacity-50">
            <Icon name="Lock" size={14} color="var(--color-text-secondary)" className="mt-0.5 flex-shrink-0" />
            <span className="text-text-secondary">
              Cronograma detalhado no plano completo
            </span>
          </div>
          
          <div className="flex items-start space-x-2 opacity-50">
            <Icon name="Lock" size={14} color="var(--color-text-secondary)" className="mt-0.5 flex-shrink-0" />
            <span className="text-text-secondary">
              Exercícios específicos por matéria
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanChart;