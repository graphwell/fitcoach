```javascript
'use client';

import React, { useState } from 'react';
import { 
  MessageCircle,
  Utensils,
  Dumbbell,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, Meal, Food, Workout, Exercise } from '@/store/useStore';
import Onboarding from '@/components/Onboarding';
import AICoach from '@/components/tabs/AICoach';
import DietPlan from '@/components/tabs/DietPlan';
import WorkoutPlan from '@/components/tabs/WorkoutPlan';
import Analytics from '@/components/tabs/Analytics';

export default function Home() {
  const { 
    user, signOut,
    profile, dietPlan, workoutPlan, cardioData, adherenceData,
    generateInitialPlans, setDietPlan, setWorkoutPlan, addFoodToMeal, addMeal,
    isHydrated
  } = useStore();
  
  const [activeTab, setActiveTab] = useState('coach');

  if (!isHydrated) {
    return (
      <div style={{ height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--apple-bg)', color: 'white' }}>
        Carregando...
      </div>
    );
  }

  const handlePlanUpdate = (type: 'diet' | 'workout', payload: { mealId?: string, food?: Food, day?: string, exerciseId?: string, newExercise?: any }) => {
    if (type === 'diet' && payload.mealId && payload.food) {
      const newDiet = dietPlan.map((meal: Meal) => {
        if (meal.id === payload.mealId) {
          return { ...meal, foods: [payload.food!] }; 
        }
        return meal;
      });
      setDietPlan(newDiet);
    } else if (type === 'workout' && payload.day && payload.exerciseId && payload.newExercise) {
      const newWorkouts = workoutPlan.map((w: Workout) => {
        if (w.day === payload.day) {
          return {
            ...w,
            exercises: w.exercises.map((ex: Exercise) => 
              ex.id === payload.exerciseId ? { ...ex, ...payload.newExercise } : ex
            )
          };
        }
        return w;
      });
      setWorkoutPlan(newWorkouts);
    }
  };

  if (!profile && !user) {
    return <Onboarding onComplete={generateInitialPlans} />;
  }

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--apple-bg)' }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ height: '100%' }}
          >
            {activeTab === 'coach' && (
              <AICoach 
                onPlanUpdate={handlePlanUpdate} 
                context={{ profile, dietPlan, workoutPlan }} 
              />
            )}
            {activeTab === 'diet' && (
              <DietPlan 
                meals={dietPlan} 
                onAddFood={addFoodToMeal} 
                onAddMeal={addMeal}
                onReset={() => profile && generateInitialPlans(profile)}
              />
            )}
            {activeTab === 'workout' && <WorkoutPlan workouts={workoutPlan} />}
            {activeTab === 'analytics' && <Analytics cardioData={cardioData} adherenceData={adherenceData} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="tab-bar glass">
        {[
          { id: 'coach', label: 'Coach', icon: <MessageCircle size={24} /> },
          { id: 'diet', label: 'Dieta', icon: <Utensils size={24} /> },
          { id: 'workout', label: 'Treino', icon: <Dumbbell size={24} /> },
          { id: 'analytics', label: 'Progresso', icon: <TrendingUp size={24} /> },
        ].map((tab) => (
          <div 
            key={tab.id} 
            className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            style={{ position: 'relative' }}
          >
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTabIndicator"
                style={{
                  position: 'absolute',
                  top: '-12px',
                  width: '4px',
                  height: '4px',
                  borderRadius: '2px',
                  background: 'var(--apple-blue)',
                  boxShadow: '0 0 10px var(--apple-blue)'
                }}
              />
            )}
            <div style={{ 
              marginBottom: '4px', 
              opacity: activeTab === tab.id ? 1 : 0.5,
              transform: activeTab === tab.id ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}>
              {React.cloneElement(tab.icon as React.ReactElement<LucideProps>, { 
                strokeWidth: activeTab === tab.id ? 2.5 : 2 
              })}
            </div>
            <span style={{ 
              fontSize: '10px', 
              fontWeight: activeTab === tab.id ? 700 : 500,
              opacity: activeTab === tab.id ? 1 : 0.7
            }}>
              {tab.label}
            </span>
          </div>
        ))}
        {user && (
          <div 
            className="tab-item"
            onClick={signOut}
            style={{ color: 'var(--apple-red)', opacity: 0.8 }}
          >
            <div style={{ marginBottom: '4px' }}>
              <TrendingUp size={24} style={{ transform: 'rotate(180deg)' }} />
            </div>
            <span style={{ fontSize: '10px', fontWeight: 700 }}>Sair</span>
          </div>
        )}
      </div>
    </div>
  );
}
