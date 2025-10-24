import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RevenueChart = () => {
  const revenueData = [
    { name: 'Jan', receita: 112.70, meta: 150.00 },
    { name: 'Fev', receita: 151.90, meta: 180.00 },
    { name: 'Mar', receita: 205.80, meta: 200.00 },
    { name: 'Abr', receita: 186.20, meta: 220.00 },
    { name: 'Mai', receita: 249.90, meta: 250.00 },
    { name: 'Jun', receita: 328.30, meta: 300.00 },
    { name: 'Jul', receita: 284.20, meta: 320.00 },
    { name: 'Ago', receita: 357.70, meta: 350.00 },
    { name: 'Set', receita: 436.10, meta: 400.00 },
    { name: 'Out', receita: 470.40, meta: 450.00 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-medium">
          <p className="font-medium text-text-primary mb-2">{`${label} 2024`}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name === 'receita' && `Receita: R$ ${entry?.value?.toFixed(2)}`}
              {entry?.name === 'meta' && `Meta: R$ ${entry?.value?.toFixed(2)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const totalRevenue = revenueData?.reduce((sum, item) => sum + item?.receita, 0);
  const totalGoal = revenueData?.reduce((sum, item) => sum + item?.meta, 0);
  const achievementRate = ((totalRevenue / totalGoal) * 100)?.toFixed(1);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Receita Mensal</h3>
          <div className="flex items-center space-x-4 mt-2">
            <div className="text-sm">
              <span className="text-text-secondary">Total: </span>
              <span className="font-mono font-semibold text-success">R$ {totalRevenue?.toFixed(2)}</span>
            </div>
            <div className="text-sm">
              <span className="text-text-secondary">Meta: </span>
              <span className="font-mono font-semibold text-text-primary">R$ {totalGoal?.toFixed(2)}</span>
            </div>
            <div className="text-sm">
              <span className="text-text-secondary">Atingimento: </span>
              <span className={`font-mono font-semibold ${parseFloat(achievementRate) >= 100 ? 'text-success' : 'text-warning'}`}>
                {achievementRate}%
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-text-secondary">Receita</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span className="text-text-secondary">Meta</span>
          </div>
        </div>
      </div>
      <div className="h-80" aria-label="Gráfico de área mostrando receita mensal versus meta">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="goalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-warning)" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="var(--color-warning)" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="name" 
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-text-secondary)"
              fontSize={12}
              tickFormatter={(value) => `R$ ${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="meta"
              stroke="var(--color-warning)"
              strokeWidth={2}
              fill="url(#goalGradient)"
              strokeDasharray="5 5"
            />
            <Area
              type="monotone"
              dataKey="receita"
              stroke="var(--color-success)"
              strokeWidth={3}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;