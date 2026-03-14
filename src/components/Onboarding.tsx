'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { UserProfile, useStore } from '@/store/useStore';

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
      title: "Seja bem-vindo",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--apple-secondary-text)', fontSize: '16px', lineHeight: '1.5' }}>
            Vamos criar seu plano de elite baseado em ciência. Se já tem uma conta, entre agora para sincronizar.
          </p>
          
          <button 
            onClick={signIn}
            style={{ 
              background: 'white', 
              color: 'black', 
              border: 'none', 
              borderRadius: '14px', 
              padding: '16px', 
              fontWeight: 700, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            id="google-login-btn"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '20px' }} />
            Entrar com Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
            <span style={{ fontSize: '12px', color: 'var(--apple-tertiary-text)', fontWeight: 700 }}>OU COMECE DO ZERO</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          </div>

          <div className="input-group" style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--apple-gray)' }}>Idade</label>
            <input 
              type="number" 
              className="apple-input" 
              value={profile.age || ''} 
              onChange={e => setProfile({...profile, age: Number(e.target.value)})}
              placeholder="ex: 25"
            />
          </div>
        </div>
      )
    },
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
    <div style={{ 
      height: '100dvh', 
      padding: 'env(safe-area-inset-top, 20px) 24px env(safe-area-inset-bottom, 20px)', 
      display: 'flex', 
      flexDirection: 'column', 
      background: 'radial-gradient(circle at top right, #1a1a1a, #000000)',
      color: 'white'
    }}>
      <div style={{ 
        marginTop: '20px',
        marginBottom: '32px', 
        display: step === 0 ? 'flex' : 'none', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        <div style={{ 
          padding: '12px', 
          borderRadius: '20px', 
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          marginBottom: '16px'
        }}>
          <img src="/logo.png" alt="FitCoach AI" style={{ height: '50px', width: 'auto', objectFit: 'contain' }} />
        </div>
      </div>
      
      {step > 0 && (
        <button onClick={() => setStep(step - 1)} style={{ background: 'none', border: 'none', padding: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', color: 'var(--apple-blue)', fontWeight: 600 }}>
          <ChevronLeft size={20} /> Voltar
        </button>
      )}

      <h1 style={{ 
        fontSize: '32px', 
        fontWeight: 800, 
        letterSpacing: '-0.5px',
        marginBottom: '28px', 
        background: 'linear-gradient(to bottom, #fff, #aaa)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>{steps[step].title}</h1>
      
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

      <div style={{ marginTop: 'auto', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
          {steps.map((_, i) => (
            <motion.div 
              key={i} 
              animate={{ 
                width: i === step ? '24px' : '8px',
                background: i === step ? 'var(--apple-blue)' : 'rgba(255,255,255,0.2)'
              }}
              style={{ height: '8px', borderRadius: '4px' }} 
            />
          ))}
        </div>
        <button 
          className="btn-primary" 
          style={{ 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px',
            boxShadow: '0 8px 20px rgba(10, 132, 255, 0.3)'
          }}
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
