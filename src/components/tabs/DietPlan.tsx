'use client';

import React, { useState } from 'react';
import { Meal, Food } from '@/store/useStore';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CatalogModal from '@/components/CatalogModal';

interface DietPlanProps {
  meals: Meal[];
  onAddFood: (mealId: string, food: Food) => void;
  onAddMeal: (name: string) => void;
  onReset: () => void;
}

const DietPlan: React.FC<DietPlanProps> = ({ meals, onAddFood, onAddMeal, onReset }) => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [activeMealId, setActiveMealId] = useState<string | null>(null);
  const [isAddingMeal, setIsAddingMeal] = useState(false);
  const [newMealName, setNewMealName] = useState('');

  const totalCalories = meals.reduce((sum, meal) => 
    sum + meal.foods.reduce((mSum, food) => mSum + food.calories, 0), 0
  );
  
  const targetCalories = 2200; // Mock target
  const progress = Math.min((totalCalories / targetCalories) * 100, 100);

  const macros = meals.reduce((acc, meal) => {
    meal.foods.forEach(food => {
      acc.p += food.protein;
      acc.c += food.carbs;
      acc.f += food.fat;
    });
    return acc;
  }, { p: 0, c: 0, f: 0 });

  const handleOpenCatalog = (mealId: string) => {
    setActiveMealId(mealId);
    setIsCatalogOpen(true);
  };

  const handleProductDetected = (product: Food) => {
    if (activeMealId) {
      onAddFood(activeMealId, product);
    }
  };

  const handleAddMeal = () => {
    if (newMealName.trim()) {
      onAddMeal(newMealName.trim());
      setNewMealName('');
      setIsAddingMeal(false);
    }
  };

  return (
    <div style={{ padding: '24px', paddingBottom: '120px', paddingTop: 'env(safe-area-inset-top, 24px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h4 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--apple-blue)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>PLANO NUTRICIONAL</h4>
          <h1 style={{ fontSize: '36px', fontWeight: 800, margin: 0, color: 'white', letterSpacing: '-0.5px' }}>Dieta</h1>
        </div>
        <button 
          onClick={() => {
            if (window.confirm('Deseja redefinir sua dieta para os padrões em português? Isso apagará as alterações atuais.')) {
              onReset();
            }
          }}
          style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--apple-tertiary-text)', padding: '8px 14px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}
        >
          Resetar
        </button>
      </div>
      
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '14px', color: 'var(--apple-secondary-text)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>Consumo Diário</div>
            <div style={{ fontSize: '38px', fontWeight: 800 }}>
              {totalCalories} 
              <span style={{ fontSize: '16px', color: 'var(--apple-tertiary-text)', fontWeight: 500, marginLeft: '8px' }}>/ {targetCalories} kcal</span>
            </div>
          </div>
          <div style={{ position: 'relative', width: '72px', height: '72px' }}>
            <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)', filter: 'drop-shadow(0 0 10px rgba(10, 132, 255, 0.2))' }}>
              <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3.5"></circle>
              <motion.circle 
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: `${progress}, 100` }}
                transition={{ duration: 1, ease: "easeOut" }}
                cx="18" cy="18" r="16" fill="none" stroke="var(--apple-blue)" strokeWidth="3.5" strokeLinecap="round"
              ></motion.circle>
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '14px', fontWeight: 800 }}>{Math.round(progress)}%</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          {[
            { label: 'Prot', val: macros.p, color: '#FF453A', target: 160 },
            { label: 'Carbs', val: macros.c, color: '#32D74B', target: 200 },
            { label: 'Gord', val: macros.f, color: '#FF9F0A', target: 70 }
          ].map(m => (
            <div key={m.label} style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '8px', color: 'var(--apple-secondary-text)', display: 'flex', justifyContent: 'space-between' }}>
                <span>{m.label}</span>
                <span style={{ color: 'white' }}>{m.val}g</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((m.val / m.target) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  style={{ height: '100%', background: m.color, boxShadow: `0 0 12px ${m.color}44` }}
                ></motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Refeições de Hoje</h2>
          {!isAddingMeal ? (
            <button 
              onClick={() => setIsAddingMeal(true)}
              style={{ background: 'none', border: 'none', color: 'var(--apple-blue)', fontWeight: 600, fontSize: '15px' }}
            >
              + Refeição
            </button>
          ) : null}
        </div>

        {isAddingMeal && (
          <div className="card" style={{ marginBottom: '16px' }}>
            <input 
              autoFocus
              type="text" 
              placeholder="Nome da refeição..."
              value={newMealName}
              onChange={(e) => setNewMealName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddMeal()}
              style={{
                width: '100%',
                background: 'var(--apple-light-gray)',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                color: 'white',
                marginBottom: '12px'
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={handleAddMeal}
                className="btn-primary" 
                style={{ flex: 1, padding: '10px' }}
              >
                Salvar
              </button>
              <button 
                onClick={() => setIsAddingMeal(false)}
                style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '12px', color: 'white' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {meals.map(meal => (
          <div key={meal.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: 700, fontSize: '18px' }}>{meal.name}</span>
              <button 
                onClick={() => handleOpenCatalog(meal.id)}
                style={{ 
                  background: 'rgba(10, 132, 255, 0.1)', 
                  border: 'none', 
                  color: 'var(--apple-blue)', 
                  padding: '6px 12px', 
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Plus size={14} />
                Adicionar Alimento
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {meal.foods.map((food, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', paddingBottom: i < meal.foods.length -1 ? '8px' : '0', borderBottom: i < meal.foods.length -1 ? '0.5px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <span style={{ color: 'white' }}>{food.name} <span style={{ color: 'var(--apple-gray)', fontSize: '12px' }}>({food.amount})</span></span>
                  <span style={{ color: 'var(--apple-gray)', fontWeight: 500 }}>{food.protein}P {food.carbs}C {food.fat}G</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <CatalogModal 
        isOpen={isCatalogOpen} 
        onClose={() => setIsCatalogOpen(false)} 
        onSelectProduct={handleProductDetected} 
      />
    </div>
  );
};

export default DietPlan;
