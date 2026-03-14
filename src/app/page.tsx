'use client';

import React, { useState } from 'react';
import { 
  MessageCircle, 
  Utensils, 
  Dumbbell, 
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import Onboarding from '@/components/Onboarding';
import AICoach from '@/components/tabs/AICoach';
import DietPlan from '@/components/tabs/DietPlan';
import WorkoutPlan from '@/components/tabs/WorkoutPlan';
import Analytics from '@/components/tabs/Analytics';

export default function Home() {
  const { 
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

  const handlePlanUpdate = (type: 'diet' | 'workout', payload: any) => {
    if (type === 'diet') {
      const newDiet = dietPlan.map((meal: any) => {
        if (meal.id === payload.mealId) {
          return { ...meal, foods: [payload.food] }; 
        }
        return meal;
      });
      setDietPlan(newDiet);
    } else if (type === 'workout') {
      const newWorkouts = workoutPlan.map((w: any) => {
        if (w.day === payload.day) {
          return {
            ...w,
            exercises: w.exercises.map((ex: any) => 
              ex.id === payload.exerciseId ? { id: ex.id, ...payload.newExercise } : ex
            )
          };
        }
        return w;
      });
      setWorkoutPlan(newWorkouts);
    }
  };

  if (!profile) {
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
        <div className={`tab-item ${activeTab === 'coach' ? 'active' : ''}`} onClick={() => setActiveTab('coach')}>
          <MessageCircle size={24} strokeWidth={activeTab === 'coach' ? 2.5 : 2} />
          <span style={{ marginTop: '2px' }}>Coach</span>
        </div>
        <div className={`tab-item ${activeTab === 'diet' ? 'active' : ''}`} onClick={() => setActiveTab('diet')}>
          <Utensils size={24} strokeWidth={activeTab === 'diet' ? 2.5 : 2} />
          <span style={{ marginTop: '2px' }}>Dieta</span>
        </div>
        <div className={`tab-item ${activeTab === 'workout' ? 'active' : ''}`} onClick={() => setActiveTab('workout')}>
          <Dumbbell size={24} strokeWidth={activeTab === 'workout' ? 2.5 : 2} />
          <span style={{ marginTop: '2px' }}>Treino</span>
        </div>
        <div className={`tab-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
          <TrendingUp size={24} strokeWidth={activeTab === 'analytics' ? 2.5 : 2} />
          <span style={{ marginTop: '2px' }}>Progresso</span>
        </div>
      </div>
    </div>
  );
}
