'use client';

import React from 'react';
import { Workout } from '@/store/useStore';

interface WorkoutPlanProps {
  workouts: Workout[];
}

const WorkoutPlan: React.FC<WorkoutPlanProps> = ({ workouts }) => {
  return (
    <div style={{ padding: '24px', paddingBottom: '120px', paddingTop: 'env(safe-area-inset-top, 24px)' }}>
      <div style={{ marginBottom: '32px' }}>
        <h4 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--apple-blue)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>ROTEIRO DE TREINO</h4>
        <h1 style={{ fontSize: '36px', fontWeight: 800, margin: 0, color: 'white', letterSpacing: '-0.5px' }}>Treino</h1>
      </div>
      
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '24px', marginBottom: '8px', scrollbarWidth: 'none' }}>
        {['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'].map((d, i) => (
          <motion.div 
            key={d} 
            whileTap={{ scale: 0.95 }}
            style={{ 
              minWidth: '60px', height: '84px', borderRadius: '18px', 
              background: i === 0 ? 'var(--apple-blue)' : 'var(--apple-card-bg)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              boxShadow: i === 0 ? '0 8px 20px rgba(10, 132, 255, 0.3)' : 'var(--shadow-sm)', 
              color: i === 0 ? 'white' : 'var(--apple-secondary-text)',
              border: '1px solid rgba(255,255,255,0.05)',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 700, opacity: 0.8 }}>{d}</span>
            <span style={{ fontSize: '22px', fontWeight: 800, marginTop: '4px' }}>{i + 14}</span>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {workout.exercises.map(ex => (
                <div key={ex.id} style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '0.5px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '16px', color: 'white' }}>{ex.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--apple-gray)', marginTop: '2px' }}>{ex.sets} séries • {ex.reps} reps</div>
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: 700, 
                    padding: '6px 10px', 
                    background: 'rgba(255,255,255,0.06)', 
                    borderRadius: '8px', 
                    color: 'var(--apple-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Clock size={12} /> {ex.rest}
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
