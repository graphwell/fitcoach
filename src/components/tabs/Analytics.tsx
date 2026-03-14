'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, 
  LineChart, Line, CartesianGrid, Tooltip, ReferenceLine 
} from 'recharts';

interface AnalyticsProps {
  cardioData: number[];
  adherenceData: number[];
}

const Analytics: React.FC<AnalyticsProps> = ({ cardioData, adherenceData }) => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const barData = [
    { day: 'SEG', mins: cardioData[0] },
    { day: 'TER', mins: cardioData[1] },
    { day: 'QUA', mins: cardioData[2] },
    { day: 'QUI', mins: cardioData[3] },
    { day: 'SEX', mins: cardioData[4] },
    { day: 'SÁB', mins: cardioData[5] },
    { day: 'DOM', mins: cardioData[6] },
  ];

  const lineData = adherenceData.map((val, i) => ({
    day: ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'][i],
    val
  }));

  const totalCardio = cardioData.reduce((a, b) => a + b, 0);
  const targetCardio = 150;

  if (!isClient) {
    return (
      <div style={{ padding: '20px', color: 'white' }}>
        <h1 style={{ fontSize: '34px', fontWeight: 700, margin: '20px 0' }}>Progresso</h1>
        <div className="card" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 className="animate-spin" /> Carregando gráficos...
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '34px', fontWeight: 700, margin: '20px 0', color: 'white' }}>Progresso</h1>
      
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Cardio Semanal</h3>
          <span style={{ fontSize: '14px', fontWeight: 700, color: totalCardio >= targetCardio ? 'var(--apple-green)' : 'var(--apple-gray)' }}>
            {totalCardio} <span style={{ fontWeight: 400, opacity: 0.8 }}>/ {targetCardio} min</span>
          </span>
        </div>
        
        <div style={{ height: '180px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--apple-gray)', fontWeight: 600 }} />
              <Bar dataKey="mins" fill="var(--apple-blue)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 700 }}>Aderência à Dieta</h3>
        <div style={{ height: '180px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--apple-gray)', fontWeight: 600 }} />
              <YAxis hide domain={[70, 110]} />
              <Tooltip 
                contentStyle={{ background: 'var(--apple-card-bg)', border: '1px solid var(--apple-light-gray)', borderRadius: '12px' }}
                itemStyle={{ color: 'var(--apple-blue)' }}
              />
              <ReferenceLine y={100} stroke="var(--apple-green)" strokeDasharray="5 5" strokeOpacity={0.5} />
              <Line 
                type="monotone" 
                dataKey="val" 
                stroke="var(--apple-blue)" 
                strokeWidth={3} 
                dot={{ fill: 'var(--apple-blue)', r: 4, strokeWidth: 2, stroke: 'var(--apple-card-bg)' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--apple-gray)', marginTop: '12px', textAlign: 'center', fontWeight: 500 }}>
          A linha verde representa 100% de adesão à meta calórica.
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px', borderLeft: '4px solid var(--apple-blue)' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 700 }}>Insights da IA</h3>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.5, color: 'var(--apple-secondary-text)', fontWeight: 400 }}>
          Sua aderência está em 94% esta semana. Ótima consistência! Considere aumentar o cardio em 15 minutos para acelerar sua meta de queima de gordura.
        </p>
      </div>
    </div>
  );
};

export default Analytics;
