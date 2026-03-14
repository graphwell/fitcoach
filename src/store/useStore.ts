'use client';

import { useState, useEffect } from 'react';

export interface UserProfile {
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female';
  experience: 'beginner' | 'intermediate' | 'advanced';
  goal: 'lose_fat' | 'gain_muscle' | 'recomposition';
}

export interface Food {
  name: string;
  amount: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  imageUrl?: string;
  brand?: string;
  nutriscore?: string;
}

export interface Meal {
  id: string;
  name: string;
  foods: Food[];
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
}

export interface Workout {
  day: string;
  title: string;
  exercises: Exercise[];
}

export const useStore = () => {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('fitcoach_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [dietPlan, setDietPlan] = useState<Meal[]>(() => {
    const saved = localStorage.getItem('fitcoach_diet');
    return saved ? JSON.parse(saved) : [];
  });

  const [workoutPlan, setWorkoutPlan] = useState<Workout[]>(() => {
    const saved = localStorage.getItem('fitcoach_workouts');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [cardioData, setCardioData] = useState<number[]>(() => {
    const saved = localStorage.getItem('fitcoach_cardio');
    return saved ? JSON.parse(saved) : [0, 0, 0, 0, 0, 0, 0];
  });

  const [adherenceData, setAdherenceData] = useState<number[]>(() => {
    const saved = localStorage.getItem('fitcoach_adherence');
    return saved ? JSON.parse(saved) : [100, 100, 100, 100, 100, 100, 100];
  });

  useEffect(() => {
    if (profile) localStorage.setItem('fitcoach_profile', JSON.stringify(profile));
    if (dietPlan.length > 0) localStorage.setItem('fitcoach_diet', JSON.stringify(dietPlan));
    if (workoutPlan.length > 0) localStorage.setItem('fitcoach_workouts', JSON.stringify(workoutPlan));
    localStorage.setItem('fitcoach_cardio', JSON.stringify(cardioData));
    localStorage.setItem('fitcoach_adherence', JSON.stringify(adherenceData));
  }, [profile, dietPlan, workoutPlan, cardioData, adherenceData]);

  const generateInitialPlans = (prof: UserProfile) => {
    // Lógica básica para geração de plano inicial
    const isGaining = prof.goal === 'gain_muscle';
    const baseCalories = prof.gender === 'male' ? 2500 : 1900;
    const targetCalories = isGaining ? baseCalories + 300 : baseCalories - 300;
    
    const initialDiet: Meal[] = [
      {
        id: '1',
        name: 'Café da Manhã',
        foods: [
          { name: 'Aveia', amount: '60g', protein: 8, carbs: 40, fat: 5, calories: 230 },
          { name: 'Ovos', amount: '2 grandes', protein: 12, carbs: 1, fat: 10, calories: 140 }
        ]
      },
      {
        id: '2',
        name: 'Almoço',
        foods: [
          { name: 'Peito de Frango', amount: '150g', protein: 45, carbs: 0, fat: 3, calories: 220 },
          { name: 'Arroz Integral', amount: '150g', protein: 4, carbs: 45, fat: 1, calories: 200 }
        ]
      },
      {
        id: '3',
        name: 'Lanche',
        foods: [
          { name: 'Banana', amount: '1 média', protein: 1, carbs: 27, fat: 0, calories: 105 }
        ]
      },
      {
        id: '4',
        name: 'Jantar',
        foods: [
          { name: 'Patinho Moído', amount: '150g', protein: 40, carbs: 0, fat: 10, calories: 250 },
          { name: 'Batata Doce', amount: '150g', protein: 3, carbs: 30, fat: 0, calories: 130 }
        ]
      },
      {
        id: '5',
        name: 'Ceia',
        foods: []
      }
    ];

    const initialWorkouts: Workout[] = [
      {
        day: 'Segunda-feira',
        title: 'Empurrar (Peito, Ombros, Tríceps)',
        exercises: [
          { id: 'ex1', name: 'Supino Reto', sets: 4, reps: '8-10', rest: '2 min' },
          { id: 'ex2', name: 'Desenvolvimento Militar', sets: 3, reps: '10-12', rest: '90s' },
          { id: 'ex3', name: 'Tríceps Pulley', sets: 3, reps: '12-15', rest: '60s' }
        ]
      },
      {
        day: 'Quarta-feira',
        title: 'Puxar (Costas, Bíceps)',
        exercises: [
          { id: 'ex4', name: 'Puxada Aberta', sets: 4, reps: '10-12', rest: '90s' },
          { id: 'ex5', name: 'Remada Curvada', sets: 3, reps: '8-10', rest: '90s' },
          { id: 'ex6', name: 'Rosca Direta', sets: 3, reps: '12-15', rest: '60s' }
        ]
      },
      {
        day: 'Sexta-feira',
        title: 'Membros Inferiores (Pernas)',
        exercises: [
          { id: 'ex7', name: 'Agachamento Livre', sets: 4, reps: '8-10', rest: '2 min' },
          { id: 'ex8', name: 'Cadeira Extensora', sets: 3, reps: '12-15', rest: '60s' },
          { id: 'ex9', name: 'Panturrilha em Pé', sets: 4, reps: '15-20', rest: '60s' }
        ]
      }
    ];

    setDietPlan(initialDiet);
    setWorkoutPlan(initialWorkouts);
    setProfile(prof);
  };

  const addFoodToMeal = (mealId: string, food: Food) => {
    setDietPlan(prev => prev.map(meal => {
      if (meal.id === mealId) {
        return { ...meal, foods: [...meal.foods, food] };
      }
      return meal;
    }));
  };

  const addMeal = (name: string) => {
    const newMeal: Meal = {
      id: Date.now().toString(),
      name,
      foods: []
    };
    setDietPlan(prev => [...prev, newMeal]);
  };

  return {
    profile,
    dietPlan,
    workoutPlan,
    cardioData,
    adherenceData,
    generateInitialPlans,
    setDietPlan,
    setWorkoutPlan,
    setCardioData,
    setAdherenceData,
    addFoodToMeal,
    addMeal
  };
};
