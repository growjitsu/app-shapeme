// Types for ShapeMe app

export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  note?: string;
}

export interface MeasurementEntry {
  id: string;
  date: string;
  chest?: number;
  waist?: number;
  abdomen?: number;
  hips?: number;
  thigh?: number;
  arm?: number;
  calf?: number;
}

export interface Goal {
  id: string;
  type: 'lose' | 'gain';
  currentWeight: number;
  targetWeight: number;
  startDate: string;
  targetDate?: string;
  startingWeight: number;
}

export interface UserProfile {
  height: number; // in cm
  age?: number;
  gender?: 'male' | 'female' | 'other';
  fitnessGoal?: 'weight_loss' | 'muscle_gain' | 'maintenance';
}

// Meal Plan Types
export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  description: string;
  ingredients: string[];
}

export interface MealPlan {
  id: string;
  date: string;
  type: 'weight_loss' | 'muscle_gain' | 'maintenance';
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal[];
}

// Workout Types
export type WorkoutCategory = 'home' | 'outdoor' | 'gym';
export type WorkoutLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: string;
  duration?: string;
  description: string;
  muscleGroup?: string;
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  category: WorkoutCategory;
  level: WorkoutLevel;
  duration: string;
  exercises: Exercise[];
  description: string;
}

// Progress Photos
export interface ProgressPhoto {
  id: string;
  date: string;
  imageUrl: string;
  weight: number;
  note?: string;
}

// Subscription Plans
export type PlanType = 'simple' | 'medium' | 'top';
export type BillingCycle = 'monthly' | 'yearly';

export interface SubscriptionPlan {
  type: PlanType;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  limits: {
    progressPhotos: number | 'unlimited';
    workoutAccess: boolean;
    mealPlanAccess: boolean;
    advancedAnalytics: boolean;
    customization: boolean;
    smartGoals: boolean;
  };
}

export interface UserSubscription {
  planType: PlanType;
  billingCycle: BillingCycle;
  startDate: string;
  expiryDate: string;
  isActive: boolean;
}

// Authentication Types
export interface User {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  height?: number; // optional during signup
  fitnessGoal?: 'weight_loss' | 'muscle_gain' | 'maintenance'; // optional during signup
  createdAt: string;
  hasCompletedOnboarding: boolean; // true after choosing a plan
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
