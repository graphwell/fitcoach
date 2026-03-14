'use client';

import React from 'react';
import { Workout } from '@/store/useStore';

interface WorkoutPlanProps {
  workouts: Workout[];
}

const WorkoutPlan: React.FC<WorkoutPlanProps> = ({ workouts }) => {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '34px', fontWeight: 700, margin: '20px 0', color: 'white' }}>Treino</h1>
      
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '20px', marginBottom: '8px' }}>
        {['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'].map((d, i) => (
          <div key={d} style={{ 
            minWidth: '54px', height: '74px', borderRadius: '16px', 
            background: i === 0 ? 'var(--apple-blue)' : 'var(--apple-card-bg)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow)', color: i === 0 ? 'white' : 'var(--apple-gray)',
            border: i === 0 ? 'none' : '1px solid var(--apple-light-gray)'
          }}>
            <span style={{ fontSize: '11px', fontWeight: 700, opacity: 0.8 }}>{d}</span>
            <span style={{ fontSize: '19px', fontWeight: 800, marginTop: '4px' }}>{i + 14}</span>
          </div>
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
                  <div style={{ fontSize: '12px', fontWeight: 700, padding: '6px 10px', background: 'rgba(255,255,255,0.08)', borderRadius: '8px', color: 'white' }}>
                    {ex.rest}
                  </div>
                </div>
              ))}
            </div>
            
            <button style={{ width: '100%', marginTop: '24px', padding: '16px', border: 'none', background: 'var(--apple-light-gray)', borderRadius: '14px', fontWeight: 700, color: 'white', fontSize: '15px' }}>
              Iniciar Treino
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
