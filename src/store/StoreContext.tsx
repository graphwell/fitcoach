'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { loginWithGoogle, logout as firebaseLogout, subscribeToAuthChanges, signUpWithEmail, signInWithEmail } from '@/services/authService';
import { saveUserData, loadUserData } from '@/services/userService';
import { Meal, Food, Workout, UserProfile } from './useStore'; // Keep types for now or move them

interface StoreContextType {
  user: User | null;
  profile: UserProfile | null;
  dietPlan: Meal[];
  workoutPlan: Workout[];
  cardioData: number[];
  adherenceData: number[];
  isHydrated: boolean;
  signIn: () => Promise<void>;
  loginEmail: (email: string, pass: string) => Promise<void>;
  signupEmail: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
  generateInitialPlans: (prof: UserProfile) => void;
  setDietPlan: (meals: Meal[]) => void;
  setWorkoutPlan: (workouts: Workout[]) => void;
  setCardioData: (data: number[]) => void;
  setAdherenceData: (data: number[]) => void;
  addFoodToMeal: (mealId: string, food: Food) => void;
  addMeal: (name: string) => void;
  updateMeal: (mealId: string, name: string) => void;
  deleteMeal: (mealId: string) => void;
  removeFoodFromMeal: (mealId: string, foodIndex: number) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  applyNewDietPlan: (meals: Meal[]) => void;
  applyNewWorkoutPlan: (workouts: Workout[]) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dietPlan, setDietPlan] = useState<Meal[]>([]);
  const [workoutPlan, setWorkoutPlan] = useState<Workout[]>([]);
  const [cardioData, setCardioData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [adherenceData, setAdherenceData] = useState<number[]>([100, 100, 100, 100, 100, 100, 100]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Sync to Cloud if authenticated
  const syncToCloud = useCallback((data: any) => {
    if (user) {
      saveUserData(user.uid, data);
    }
  }, [user]);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const cloudData = await loadUserData(firebaseUser.uid);
        if (cloudData) {
          if (cloudData.profile) setProfile(cloudData.profile);
          if (cloudData.dietPlan) setDietPlan(cloudData.dietPlan);
          if (cloudData.workoutPlan) setWorkoutPlan(cloudData.workoutPlan);
          if (cloudData.cardioData) setCardioData(cloudData.cardioData);
          if (cloudData.adherenceData) setAdherenceData(cloudData.adherenceData);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Hydration from LocalStorage
  useEffect(() => {
    try {
      const p = localStorage.getItem('fitcoach_profile');
      const d = localStorage.getItem('fitcoach_diet');
      const w = localStorage.getItem('fitcoach_workouts');
      const c = localStorage.getItem('fitcoach_cardio');
      const a = localStorage.getItem('fitcoach_adherence');

      if (!profile && p) setProfile(JSON.parse(p));
      if (dietPlan.length === 0 && d) setDietPlan(JSON.parse(d));
      if (workoutPlan.length === 0 && w) setWorkoutPlan(JSON.parse(w));
      if (c && cardioData.every(v => v === 0)) setCardioData(JSON.parse(c));
      if (a && adherenceData.every(v => v === 100)) setAdherenceData(JSON.parse(a));
    } catch (e) {
      console.error("Error loading state:", e);
    } finally {
      setIsHydrated(true);
    }
  }, [isHydrated, profile, dietPlan.length, workoutPlan.length, cardioData, adherenceData]);

  // Sync to LocalStorage AND Firestore
  useEffect(() => {
    if (!isHydrated) return;
    if (profile) localStorage.setItem('fitcoach_profile', JSON.stringify(profile));
    if (dietPlan.length > 0) localStorage.setItem('fitcoach_diet', JSON.stringify(dietPlan));
    if (workoutPlan.length > 0) localStorage.setItem('fitcoach_workouts', JSON.stringify(workoutPlan));
    localStorage.setItem('fitcoach_cardio', JSON.stringify(cardioData));
    localStorage.setItem('fitcoach_adherence', JSON.stringify(adherenceData));

    if (user) {
      saveUserData(user.uid, { profile, dietPlan, workoutPlan, cardioData, adherenceData });
    }
  }, [profile, dietPlan, workoutPlan, cardioData, adherenceData, isHydrated, user]);

  const signIn = async () => await loginWithGoogle();
  const loginEmail = async (email: string, pass: string) => await signInWithEmail(email, pass);
  const signupEmail = async (email: string, pass: string) => await signUpWithEmail(email, pass);
  const signOut = async () => {
    await firebaseLogout();
    setProfile(null);
    setDietPlan([]);
    setWorkoutPlan([]);
    localStorage.clear();
  };

  const generateInitialPlans = (prof: UserProfile) => {
    const isGaining = prof.goal === 'gain_muscle';
    const baseCalories = prof.gender === 'male' ? 2500 : 1900;
    const targetCalories = isGaining ? baseCalories + 300 : baseCalories - 300;
    
    const initialDiet: Meal[] = [
      { id: '1', name: 'Café da Manhã', foods: [
        { name: 'Aveia', amount: '60g', protein: 8, carbs: 40, fat: 5, calories: 230 },
        { name: 'Ovos', amount: '2 grandes', protein: 12, carbs: 1, fat: 10, calories: 140 }
      ]},
      { id: '2', name: 'Almoço', foods: [
        { name: 'Peito de Frango', amount: '150g', protein: 45, carbs: 0, fat: 3, calories: 220 },
        { name: 'Arroz Integral', amount: '150g', protein: 3, carbs: 45, fat: 1, calories: 200 }
      ]},
      { id: '3', name: 'Lanche', foods: [{ name: 'Banana', amount: '1 média', protein: 1, carbs: 27, fat: 0, calories: 105 }]},
      { id: '4', name: 'Jantar', foods: [
        { name: 'Patinho Moído', amount: '150g', protein: 40, carbs: 0, fat: 10, calories: 250 },
        { name: 'Batata Doce', amount: '150g', protein: 3, carbs: 30, fat: 0, calories: 130 }
      ]},
      { id: '5', name: 'Ceia', foods: [] }
    ];

    setDietPlan(initialDiet);
    setProfile(prof);
  };

  const addFoodToMeal = (mealId: string, food: Food) => {
    setDietPlan(prev => prev.map(meal => meal.id === mealId ? { ...meal, foods: [...meal.foods, food] } : meal));
  };

  const addMeal = (name: string) => {
    setDietPlan(prev => [...prev, { id: Date.now().toString(), name, foods: [] }]);
  };

  const updateMeal = (mealId: string, name: string) => {
    setDietPlan(prev => prev.map(m => m.id === mealId ? { ...m, name } : m));
  };

  const deleteMeal = (mealId: string) => {
    setDietPlan(prev => prev.filter(m => m.id !== mealId));
  };

  const removeFoodFromMeal = (mealId: string, foodIndex: number) => {
    setDietPlan(prev => prev.map(meal => {
      if (meal.id === mealId) {
        const newFoods = [...meal.foods];
        newFoods.splice(foodIndex, 1);
        return { ...meal, foods: newFoods };
      }
      return meal;
    }));
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => prev ? { ...prev, ...updates } : null);
  };

  const applyNewDietPlan = (meals: Meal[]) => setDietPlan(meals);
  const applyNewWorkoutPlan = (workouts: Workout[]) => setWorkoutPlan(workouts);

  const value = {
    user, profile, dietPlan, workoutPlan, cardioData, adherenceData, isHydrated,
    signIn, loginEmail, signupEmail, signOut, generateInitialPlans,
    setDietPlan, setWorkoutPlan, setCardioData, setAdherenceData,
    addFoodToMeal, addMeal, updateMeal, deleteMeal, removeFoodFromMeal,
    updateProfile, applyNewDietPlan, applyNewWorkoutPlan
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
