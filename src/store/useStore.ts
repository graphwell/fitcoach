export interface UserProfile {
  name?: string;
  photoURL?: string;
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female';
  experience: 'beginner' | 'intermediate' | 'advanced';
  goal: 'lose_fat' | 'gain_muscle' | 'recomposition';
  role?: 'admin' | 'user';
  status?: 'active' | 'disabled';
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

export { useStore } from './StoreContext';
