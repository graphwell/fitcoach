'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Dumbbell } from 'lucide-react';
import { UserProfile } from '@/store/useStore';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    gender: 'male',
    experience: 'beginner',
    goal: 'recomposition'
  });

  const steps = [
    {
      title: "Conte-nos sobre você",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="input-group">
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--apple-gray)' }}>Idade</label>
            <input 
              type="number" 
              className="apple-input" 
              value={profile.age || ''} 
              onChange={e => setProfile({...profile, age: Number(e.target.value)})}
              placeholder="ex: 25"
            />
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--apple-gray)' }}>Peso (kg)</label>
              <input 
                type="number" 
                className="apple-input" 
                value={profile.weight || ''} 
                onChange={e => setProfile({...profile, weight: Number(e.target.value)})}
                placeholder="70"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--apple-gray)' }}>Altura (cm)</label>
              <input 
                type="number" 
                className="apple-input" 
                value={profile.height || ''} 
                onChange={e => setProfile({...profile, height: Number(e.target.value)})}
                placeholder="175"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Perfil Físico",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', color: 'var(--apple-gray)' }}>Gênero</label>
          <div style={{ display: 'flex', background: 'var(--apple-card-bg)', borderRadius: '10px', padding: '4px', border: '1px solid var(--apple-light-gray)' }}>
            {['male', 'female'].map(g => (
              <button 
                key={g}
                onClick={() => setProfile({...profile, gender: g as any})}
                style={{ 
                  flex: 1, padding: '8px', border: 'none', borderRadius: '8px',
                  background: profile.gender === g ? 'var(--apple-light-gray)' : 'transparent',
                  color: 'white',
                  fontWeight: 600, transition: 'all 0.2s'
                }}
              >
                {g === 'male' ? 'Masculino' : 'Feminino'}
              </button>
            ))}
          </div>
          
          <label style={{ display: 'block', fontSize: '14px', color: 'var(--apple-gray)' }}>Experiência</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
             {[
               { id: 'beginner', label: 'Iniciante' },
               { id: 'intermediate', label: 'Intermediário' },
               { id: 'advanced', label: 'Avançado' }
             ].map(exp => (
               <div 
                 key={exp.id} 
                 className="card" 
                 onClick={() => setProfile({...profile, experience: exp.id as any})}
                 style={{ 
                   padding: '16px', cursor: 'pointer', margin: 0,
                   borderColor: profile.experience === exp.id ? 'var(--apple-blue)' : 'rgba(255,255,255,0.05)'
                 }}
               >
                 <span style={{ fontWeight: 600 }}>{exp.label}</span>
               </div>
             ))}
          </div>
        </div>
      )
    },
    {
      title: "Qual é o seu objetivo?",
      content: (
         <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { id: 'lose_fat', label: 'Perder Gordura', desc: 'Queimar gordura mantendo a massa muscular' },
              { id: 'gain_muscle', label: 'Ganhar Músculo', desc: 'Foco em hipertrofia e força' },
              { id: 'recomposition', label: 'Recomposição Corporal', desc: 'Perder gordura e ganhar músculo simultaneamente' }
            ].map(goal => (
              <div 
                key={goal.id} 
                className="card" 
                onClick={() => setProfile({...profile, goal: goal.id as any})}
                style={{ 
                  padding: '16px', cursor: 'pointer', margin: 0,
                  borderColor: profile.goal === goal.id ? 'var(--apple-blue)' : 'rgba(255,255,255,0.05)'
                }}
              >
                <div style={{ fontWeight: 600 }}>{goal.label}</div>
                <div style={{ fontSize: '13px', color: 'var(--apple-gray)' }}>{goal.desc}</div>
              </div>
            ))}
         </div>
      )
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      if (profile.age && profile.weight && profile.height) {
        onComplete(profile as UserProfile);
      } else {
        alert("Por favor, preencha todos os campos");
      }
    }
  };

  return (
    <div style={{ height: '100vh', padding: '40px 24px', display: 'flex', flexDirection: 'column', background: 'var(--apple-bg)' }}>
      <div style={{ marginBottom: '40px', display: step === 0 ? 'flex' : 'none', flexDirection: 'column', alignItems: 'center' }}>
        <img src="/logo.png" alt="FitCoach AI" style={{ height: '80px', marginBottom: '24px', objectFit: 'contain' }} />
      </div>
      
      {step > 0 && (
        <button onClick={() => setStep(step - 1)} style={{ background: 'none', border: 'none', padding: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', color: 'var(--apple-blue)', fontWeight: 600 }}>
          <ChevronLeft size={20} /> Voltar
        </button>
      )}

      <h1 style={{ fontSize: '30px', fontWeight: 800, marginBottom: '24px', color: 'white' }}>{steps[step].title}</h1>
      
      <div style={{ flex: 1 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {steps[step].content}
          </motion.div>
        </AnimatePresence>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '24px' }}>
          {steps.map((_, i) => (
            <div key={i} style={{ width: '6px', height: '6px', borderRadius: '3px', background: i === step ? 'var(--apple-blue)' : 'var(--apple-light-gray)' }} />
          ))}
        </div>
        <button 
          className="btn-primary" 
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          onClick={handleNext}
        >
          {step === steps.length - 1 ? 'Concluir' : 'Próximo'} <ChevronRight size={20} />
        </button>
      </div>

      <style>{`
        .apple-input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid var(--apple-light-gray);
          background: var(--apple-card-bg);
          color: white;
          font-size: 16px;
          outline: none;
          transition: border-color 0.2s;
        }
        .apple-input:focus {
          border-color: var(--apple-blue);
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
