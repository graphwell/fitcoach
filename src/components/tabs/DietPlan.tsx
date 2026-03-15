'use client';

import React, { useState, useRef } from 'react';
import { Meal, Food, useStore } from '@/store/useStore';
import { Plus, Coffee, Sun, Sunset, Moon, RotateCcw, Trash2, Edit3, MoreVertical, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CatalogModal from '@/components/CatalogModal';

interface DietPlanProps {
  meals: Meal[];
  onAddFood: (mealId: string, food: Food) => void;
  onAddMeal: (name: string) => void;
  onReset: () => void;
}

const DietPlan: React.FC<DietPlanProps> = ({ meals, onAddFood, onAddMeal, onReset }) => {
  const { deleteMeal, removeFoodFromMeal, updateMeal } = useStore();
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [activeMealId, setActiveMealId] = useState<string | null>(null);
  const [isAddingMeal, setIsAddingMeal] = useState(false);
  const [newMealName, setNewMealName] = useState('');
  const [editingMeal, setEditingMeal] = useState<{ id: string, name: string } | null>(null);
  const [longPressedItem, setLongPressedItem] = useState<{ mealId: string, foodIndex?: number } | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const startLongPress = (mealId: string, foodIndex?: number) => {
    longPressTimer.current = setTimeout(() => {
      setLongPressedItem({ mealId, foodIndex });
      if (window.navigator.vibrate) window.navigator.vibrate(50);
    }, 600);
  };

  const endLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h4 style={{ fontSize: '11px', fontWeight: 900, color: 'var(--apple-blue)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px', opacity: 0.8 }}>PLANEJAMENTO DIÁRIO</h4>
          <h1 style={{ fontSize: '42px', fontWeight: 900, margin: 0, color: 'white', letterSpacing: '-1.5px', lineHeight: 1 }}>Nutrição</h1>
        </div>
        <button 
          onClick={() => {
            if (window.confirm('Deseja redefinir sua dieta para os padrões em português? Isso apagará as alterações atuais.')) {
              onReset();
            }
          }}
          style={{ 
            background: 'rgba(255,255,255,0.08)', 
            border: 'none', 
            color: 'var(--apple-secondary-text)', 
            padding: '10px 16px', 
            borderRadius: '14px', 
            fontSize: '12px', 
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <RotateCcw size={14} />
          Resetar
        </button>
      </div>
      
      <div className="card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle background glow */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'var(--apple-blue)', filter: 'blur(100px)', opacity: 0.1, zIndex: 0 }}></div>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px' }}>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--apple-secondary-text)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Meta Calórica</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '42px', fontWeight: 900, color: 'white', letterSpacing: '-1px' }}>{totalCalories}</span>
                <span style={{ fontSize: '18px', color: 'var(--apple-tertiary-text)', fontWeight: 600 }}>/ {targetCalories} kcal</span>
              </div>
            </div>
            <div style={{ position: 'relative', width: '80px', height: '80px' }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)', filter: 'drop-shadow(0 0 12px rgba(10, 132, 255, 0.25))' }}>
                <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3"></circle>
                <motion.circle 
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: `${progress}, 100` }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                  cx="18" cy="18" r="16" fill="none" stroke="var(--apple-blue)" strokeWidth="3" strokeLinecap="round"
                ></motion.circle>
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '16px', fontWeight: 900 }}>{Math.round(progress)}%</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            {[
              { label: 'Proteína', val: macros.p, color: 'var(--apple-red)', target: 160 },
              { label: 'Carbos', val: macros.c, color: 'var(--apple-green)', target: 200 },
              { label: 'Gordura', val: macros.f, color: 'var(--apple-orange)', target: 70 }
            ].map(m => (
              <div key={m.label} style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', fontWeight: 800, marginBottom: '8px', color: 'var(--apple-secondary-text)', display: 'flex', justifyContent: 'space-between', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <span>{m.label}</span>
                  <span style={{ color: 'white' }}>{m.val}g</span>
                </div>
                <div style={{ height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '10px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((m.val / m.target) * 100, 100)}%` }}
                    transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: '100%', background: m.color, boxShadow: `0 0 15px ${m.color}66` }}
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
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

        {meals.map(meal => {
          const getIcon = (name: string) => {
            const n = name.toLowerCase();
            if (n.includes('café') || n.includes('manha')) return <Coffee size={20} />;
            if (n.includes('almoço')) return <Sun size={20} />;
            if (n.includes('lanche')) return <Sunset size={20} />;
            if (n.includes('jantar') || n.includes('ceia')) return <Moon size={20} />;
            return <Coffee size={20} />;
          };

          const mealCalories = meal.foods.reduce((sum, f) => sum + f.calories, 0);

          return (
            <div 
              key={meal.id} 
              className="card" 
              style={{ padding: '20px', position: 'relative' }}
              onMouseDown={() => startLongPress(meal.id)}
              onMouseUp={endLongPress}
              onMouseLeave={endLongPress}
              onTouchStart={() => startLongPress(meal.id)}
              onTouchEnd={endLongPress}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--apple-blue)' }}>
                    {getIcon(meal.name)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '18px', color: 'white', letterSpacing: '-0.3px' }}>{meal.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--apple-tertiary-text)', fontWeight: 600 }}>{mealCalories} kcal estimadas</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => { setEditingMeal({ id: meal.id, name: meal.name }); }}
                    style={{ background: 'none', border: 'none', color: 'var(--apple-tertiary-text)', padding: '4px' }}
                  >
                    <MoreVertical size={18} />
                  </button>
                  <button 
                    onClick={() => handleOpenCatalog(meal.id)}
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.08)', 
                      border: 'none', 
                      color: 'white', 
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {meal.foods.length === 0 ? (
                  <div style={{ fontSize: '13px', color: 'var(--apple-tertiary-text)', fontStyle: 'italic', padding: '8px 0' }}>Nenhum alimento adicionado</div>
                ) : (
                  meal.foods.map((food, i) => (
                    <div 
                      key={i} 
                      onMouseDown={(e) => { e.stopPropagation(); startLongPress(meal.id, i); }}
                      onMouseUp={endLongPress}
                      onMouseLeave={endLongPress}
                      onTouchStart={(e) => { e.stopPropagation(); startLongPress(meal.id, i); }}
                      onTouchEnd={endLongPress}
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '12px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '14px',
                        border: '1px solid rgba(255,255,255,0.03)',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>{food.name}</span>
                        <span style={{ color: 'var(--apple-tertiary-text)', fontSize: '12px', fontWeight: 500 }}>{food.amount}</span>
                      </div>
                      <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div>
                          <div style={{ color: 'var(--apple-blue)', fontWeight: 800, fontSize: '14px' }}>{food.calories} <span style={{ fontSize: '10px', fontWeight: 600, opacity: 0.7 }}>kcal</span></div>
                          <div style={{ color: 'var(--apple-tertiary-text)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.4px' }}>{food.protein}P {food.carbs}C {food.fat}G</div>
                        </div>
                        {longPressedItem?.mealId === meal.id && longPressedItem?.foodIndex === i && (
                          <button onClick={() => { removeFoodFromMeal(meal.id, i); setLongPressedItem(null); }} style={{ color: 'var(--apple-red)', background: 'none', border: 'none' }}>
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <AnimatePresence>
                {longPressedItem?.mealId === meal.id && longPressedItem?.foodIndex === undefined && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', borderRadius: '24px', zIndex: 10 }}
                  >
                    <button onClick={() => { setEditingMeal({ id: meal.id, name: meal.name }); setLongPressedItem(null); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'white', background: 'none', border: 'none' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Edit3 size={20} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 700 }}>Editar</span>
                    </button>
                    <button onClick={() => { deleteMeal(meal.id); setLongPressedItem(null); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--apple-red)', background: 'none', border: 'none' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255, 69, 58, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Trash2 size={20} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 700 }}>Apagar</span>
                    </button>
                    <button onClick={() => setLongPressedItem(null)} style={{ position: 'absolute', top: '12px', right: '12px', color: 'white', background: 'none', border: 'none' }}>
                      <X size={20} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <CatalogModal 
        isOpen={isCatalogOpen} 
        onClose={() => setIsCatalogOpen(false)} 
        onSelectProduct={handleProductDetected} 
      />

      {editingMeal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '350px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 20px 0' }}>Editar Refeição</h3>
            <input 
              type="text" 
              value={editingMeal.name} 
              onChange={e => setEditingMeal({...editingMeal, name: e.target.value})}
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px', color: 'white', marginBottom: '20px' }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => { updateMeal(editingMeal.id, editingMeal.name); setEditingMeal(null); }}
                className="btn-primary" 
                style={{ flex: 1, padding: '12px' }}
              >
                Salvar
              </button>
              <button 
                onClick={() => setEditingMeal(null)}
                style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '12px', color: 'white' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      <CatalogModal 
        isOpen={isCatalogOpen} 
        onClose={() => setIsCatalogOpen(false)} 
        onSelectProduct={handleProductDetected} 
      />
    </div>
  );
};

export default DietPlan;
