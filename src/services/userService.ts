import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile, Meal, Workout } from "@/store/useStore";

export interface UserData {
  profile: UserProfile | null;
  dietPlan: Meal[];
  workoutPlan: Workout[];
  cardioData: number[];
  adherenceData: number[];
  updatedAt: number;
}

export const saveUserData = async (uid: string, data: Partial<UserData>) => {
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
      ...data,
      updatedAt: Date.now()
    }, { merge: true });
  } catch (error) {
    console.error("Erro ao salvar dados do usuário no Firestore:", error);
    throw error;
  }
};

export const loadUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error("Erro ao carregar dados do usuário do Firestore:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }));
  } catch (e) {
    console.error("Error fetching all users:", e);
    return [];
  }
};

export const updateUserRole = async (uid: string, role: 'admin' | 'user') => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { 'profile.role': role });
  } catch (e) {
    console.error("Error updating user role:", e);
  }
};
