'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Check } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { generatePersonalizedDiet } from '@/services/coachService';

interface EvaluationScreenProps {
  onClose: () => void;
}

const CoachDietEvaluationScreen: React.FC<EvaluationScreenProps> = ({ onClose }) => {
  const { profile, applyNewDietPlan, dietPlan } = useStore();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [formData, setFormData] = useState({
    age: profile?.age || 25,
    gender: profile?.gender || 'male',
    weight: profile?.weight || 75,
    height: profile?.height || 175,
    bodyFat: '',
    goal: profile?.goal || 'lose_fat',
    activity: 'moderate',
    allergies: '',
    preference: 'balanced',
    budget: 'medium',
    mealCount: 4,
    restrictions: ''
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await generatePersonalizedDiet(formData, { profile: profile!, dietPlan });
      setResult(data);
      setStep(99); // Sucesso
    } catch (e) {
      alert("Erro ao gerar dieta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (result) {
      applyNewDietPlan(result.meals);
      onClose();
    }
  };

  const renderStep = () => {
    switch(step) {
      case 0:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Dados Corporais</h2>
            <div className="card" style={{ padding: '16px', background: 'rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--apple-gray)', display: 'block', marginBottom: '8px' }}>PESO (KG)</label>
                  <input type="number" value={formData.weight} onChange={e => setFormData({...formData, weight: Number(e.target.value)})} style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px', color: 'white' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--apple-gray)', display: 'block', marginBottom: '8px' }}>ALTURA (CM)</label>
                  <input type="number" value={formData.height} onChange={e => setFormData({...formData, height: Number(e.target.value)})} style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px', color: 'white' }} />
                </div>
              </div>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--apple-gray)' }}>Utilizamos seus dados para calcular as necessidades calóricas exatas.</p>
          </div>
        );
      case 1:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Restrições e Alergias</h2>
            <div className="card" style={{ padding: '16px', background: 'rgba(255,255,255,0.05)' }}>
              <label style={{ fontSize: '12px', color: 'var(--apple-gray)', display: 'block', marginBottom: '8px' }}>DESCREVA ALERGIAS OU INTOLERÂNCIAS</label>
              <textarea 
                value={formData.allergies} 
                onChange={v => setFormData({...formData, allergies: v.target.value})} 
                placeholder="Ex: Lactose, amendoim, glúten..."
                style={{ width: '100%', height: '100px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px', color: 'white', outline: 'none' }} 
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Preferências e Orçamento</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '12px', color: 'var(--apple-gray)' }}>PREFERÊNCIA ALIMENTAR</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {['balanced', 'low-carb', 'vegan', 'keto'].map(p => (
                  <button key={p} onClick={() => setFormData({...formData, preference: p})} style={{ padding: '12px', borderRadius: '12px', background: formData.preference === p ? 'var(--apple-blue)' : 'rgba(255,255,255,0.05)', border: 'none', color: 'white', textTransform: 'capitalize' }}>{p}</button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '12px', color: 'var(--apple-gray)' }}>ORÇAMENTO</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['cheap', 'medium', 'high'].map(b => (
                  <button key={b} onClick={() => setFormData({...formData, budget: b})} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: formData.budget === b ? 'var(--apple-blue)' : 'rgba(255,255,255,0.05)', border: 'none', color: 'white', textTransform: 'capitalize' }}>{b}</button>
                ))}
              </div>
            </div>
          </div>
        );
      case 99:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '40px', background: 'rgba(48, 209, 88, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <Check color="#30d158" size={40} />
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 800 }}>Dieta Pronta!</h2>
            <div className="card" style={{ padding: '20px', background: 'rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--apple-gray)' }}>CALORIAS</div>
                  <div style={{ fontSize: '20px', fontWeight: 700 }}>{result.summary.targetCalories} kcal</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--apple-gray)' }}>MACROS (P/C/G)</div>
                  <div style={{ fontSize: '16px', fontWeight: 600 }}>{result.summary.macros.protein}g / {result.summary.macros.carbs}g / {result.summary.macros.fat}g</div>
                </div>
              </div>
            </div>
            <button onClick={handleApply} className="btn-primary" style={{ width: '100%', padding: '18px', borderRadius: '16px', fontSize: '18px' }}>Aplicar na Minha Dieta</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'var(--apple-bg)', padding: '24px', paddingTop: 'env(safe-area-inset-top)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white' }}>
          <X size={24} />
        </button>
        {step < 99 && (
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--apple-gray)' }}>PASSO {step + 1} DE 3</div>
        )}
        <div style={{ width: '24px' }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          style={{ height: 'calc(100% - 150px)' }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {step < 3 && step < 99 && (
        <div style={{ position: 'absolute', bottom: '40px', left: '24px', right: '24px', display: 'flex', gap: '16px' }}>
          {step > 0 && (
            <button onClick={prevStep} style={{ flex: 1, padding: '18px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', fontWeight: 700 }}>Voltar</button>
          )}
          {step < 2 ? (
            <button onClick={nextStep} className="btn-primary" style={{ flex: 2, padding: '18px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              Próximo <ChevronRight size={20} />
            </button>
          ) : (
            <button onClick={handleGenerate} disabled={loading} className="btn-primary" style={{ flex: 2, padding: '18px', borderRadius: '16px' }}>
              {loading ? 'Gerando Plano...' : 'Gerar Minha Dieta'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CoachDietEvaluationScreen;
