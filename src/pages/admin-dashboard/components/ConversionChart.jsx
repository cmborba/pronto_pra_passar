import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const ConversionChart = ({ data, type = 'bar' }) => {
  const chartData = [
    { name: 'Jan', quizCompletos: 145, conversoes: 23, receita: 112.70 },
    { name: 'Fev', quizCompletos: 189, conversoes: 31, receita: 151.90 },
    { name: 'Mar', quizCompletos: 234, conversoes: 42, receita: 205.80 },
    { name: 'Abr', quizCompletos: 198, conversoes: 38, receita: 186.20 },
    { name: 'Mai', quizCompletos: 267, conversoes: 51, receita: 249.90 },
    { name: 'Jun', quizCompletos: 312, conversoes: 67, receita: 328.30 },
    { name: 'Jul', quizCompletos: 289, conversoes: 58, receita: 284.20 },
    { name: 'Ago', quizCompletos: 345, conversoes: 73, receita: 357.70 },
    { name: 'Set', quizCompletos: 398, conversoes: 89, receita: 436.10 },
    { name: 'Out', quizCompletos: 423, conversoes: 96, receita: 470.40 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-medium">
          <p className="font-medium text-text-primary mb-2">{`${label} 2024`}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name === 'quizCompletos' && `Quiz Completos: ${entry?.value}`}
              {entry?.name === 'conversoes' && `Conversões: ${entry?.value}`}
              {entry?.name === 'receita' && `Receita: R$ ${entry?.value?.toFixed(2)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (type === 'line') {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Tendência de Conversões</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-text-secondary">Quiz Completos</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-text-secondary">Conversões</span>
            </div>
          </div>
        </div>
        
        <div className="h-80" aria-label="Gráfico de linha mostrando tendência de conversões ao longo do tempo">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="quizCompletos" 
                stroke="var(--color-primary)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="conversoes" 
                stroke="var(--color-success)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Conversões Mensais</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-text-secondary">Quiz Completos</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-text-secondary">Conversões</span>
          </div>
        </div>
      </div>
      
      <div className="h-80" aria-label="Gráfico de barras mostrando quiz completos e conversões mensais">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="name" 
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="quizCompletos" 
              fill="var(--color-primary)" 
              radius={[4, 4, 0, 0]}
              name="Quiz Completos"
            />
            <Bar 
              dataKey="conversoes" 
              fill="var(--color-success)" 
              radius={[4, 4, 0, 0]}
              name="Conversões"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ConversionChart;