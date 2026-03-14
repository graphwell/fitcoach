'use client';

import React from 'react';
import { Workout } from '@/store/useStore';
import { motion } from 'framer-motion';
import { Play, Clock } from 'lucide-react';

interface WorkoutPlanProps {
  workouts: Workout[];
}

const WorkoutPlan: React.FC<WorkoutPlanProps> = ({ workouts }) => {
  return (
    <div style={{ padding: '24px', paddingBottom: '120px', paddingTop: 'env(safe-area-inset-top, 24px)' }}>
      <div style={{ marginBottom: '36px' }}>
        <h4 style={{ fontSize: '11px', fontWeight: 900, color: 'var(--apple-blue)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px', opacity: 0.8 }}>ROTEIRO DE TREINO</h4>
        <h1 style={{ fontSize: '42px', fontWeight: 900, margin: 0, color: 'white', letterSpacing: '-1.5px', lineHeight: 1 }}>Treino</h1>
      </div>
      
      <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '28px', margin: '0 -24px 8px -24px', paddingLeft: '24px', paddingRight: '24px', scrollbarWidth: 'none' }}>
        {['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'].map((d, i) => (
          <motion.div 
            key={d} 
            whileTap={{ scale: 0.94 }}
            style={{ 
              minWidth: '64px', height: '88px', borderRadius: '20px', 
              background: i === 0 ? 'linear-gradient(180deg, #0A84FF 0%, #0070E0 100%)' : 'var(--apple-card-bg)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              boxShadow: i === 0 ? '0 8px 24px rgba(10, 132, 255, 0.3)' : 'var(--shadow-sm)', 
              color: i === 0 ? 'white' : 'var(--apple-secondary-text)',
              border: i === 0 ? 'none' : '1px solid var(--glass-border)',
              cursor: 'pointer',
              backdropFilter: i === 0 ? 'none' : 'blur(20px)'
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 800, opacity: 0.8 }}>{d}</span>
            <span style={{ fontSize: '24px', fontWeight: 900, marginTop: '2px', letterSpacing: '-0.5px' }}>{i + 14}</span>
          </motion.div>
        ))}
      </div>

      <div style={{ marginTop: '10px' }}>
        {workouts.map(workout => (
          <div key={workout.day} className="card" style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--apple-blue)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>{workout.day}</div>
              <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '4px' }}>{workout.title}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {workout.exercises.map(ex => (
                <div key={ex.id} style={{ 
                  padding: '16px', 
                  background: 'rgba(255,255,255,0.04)', 
                  borderRadius: '16px', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  border: '1px solid rgba(255,255,255,0.04)',
                  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)'
                }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '16px', color: 'white', letterSpacing: '-0.3px' }}>{ex.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--apple-tertiary-text)', fontWeight: 600, marginTop: '2px' }}>{ex.sets} séries • {ex.reps} reps</div>
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    fontWeight: 800, 
                    padding: '8px 12px', 
                    background: 'rgba(10, 132, 255, 0.1)', 
                    borderRadius: '10px', 
                    color: 'var(--apple-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.4px'
                  }}>
                    <Clock size={14} /> {ex.rest}
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => alert('Treino iniciado! Prepare-se para a primeira série.')}
              className="btn-primary"
              style={{ 
                width: '100%', 
                marginTop: '32px', 
                padding: '18px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '10px',
                boxShadow: '0 8px 24px rgba(10, 132, 255, 0.3)'
              }}
            >
              <Play size={20} fill="white" /> Iniciar Treino
            </button>
          </div>
        ))}
        
        {workouts.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '48px 20px' }}>
            <div style={{ fontSize: '16px', color: 'var(--apple-gray)', fontWeight: 500 }}>Nenhum treino agendado para hoje.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlan;
