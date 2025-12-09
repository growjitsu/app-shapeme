// Utility functions for ShapeMe app
import { WeightEntry, Goal, UserProfile, MeasurementEntry, ProgressPhoto, UserSubscription, MealPlan, User, AuthState } from './types';
import { supabase } from './supabase';

// BMI Calculations
export function calculateBMI(weight: number, height: number): number {
  if (!weight || !height) return 0;
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
}

export function getBMICategory(bmi: number) {
  if (bmi < 18.5) {
    return {
      category: 'Abaixo do peso',
      description: 'Você está abaixo do peso ideal',
      color: 'text-blue-600',
    };
  } else if (bmi < 25) {
    return {
      category: 'Peso normal',
      description: 'Você está no peso ideal',
      color: 'text-green-600',
    };
  } else if (bmi < 30) {
    return {
      category: 'Sobrepeso',
      description: 'Você está acima do peso ideal',
      color: 'text-yellow-600',
    };
  } else if (bmi < 35) {
    return {
      category: 'Obesidade Grau I',
      description: 'Atenção ao seu peso',
      color: 'text-orange-600',
    };
  } else {
    return {
      category: 'Obesidade Grau II',
      description: 'Consulte um profissional de saúde',
      color: 'text-red-600',
    };
  }
}

// Progress Calculations
export function calculateProgress(current: number, start: number, target: number): number {
  if (start === target) return 100;
  const totalChange = Math.abs(target - start);
  const currentChange = Math.abs(current - start);
  return Math.min(100, Math.round((currentChange / totalChange) * 100));
}

export function getWeightDifference(entries: WeightEntry[]): number {
  if (entries.length < 2) return 0;
  const latest = entries[entries.length - 1].weight;
  const previous = entries[entries.length - 2].weight;
  return Number((latest - previous).toFixed(1));
}

// Date Formatting
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

// Supabase Storage Functions
export const storage = {
  // Auth State
  async getAuthState(): Promise<AuthState> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { user: null, isAuthenticated: false };
    }

    // Get user profile from database
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return { user: null, isAuthenticated: false };
    }

    // CORRIGIDO: height e fitness_goal não existem no banco
    // Buscar do localStorage se necessário
    const storedProfile = localStorage.getItem('shapeme_profile');
    const localProfile = storedProfile ? JSON.parse(storedProfile) : null;

    const userData: User = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      dateOfBirth: profile.birth_date,
      gender: profile.gender,
      height: localProfile?.height,
      fitnessGoal: localProfile?.fitnessGoal,
      createdAt: profile.created_at,
      hasCompletedOnboarding: profile.has_completed_onboarding,
    };

    return { user: userData, isAuthenticated: true };
  },

  async saveAuthState(state: AuthState): Promise<void> {
    // Auth state is managed by Supabase Auth
    // User profile is saved separately
  },

  // Weight Entries
  async getWeightEntries(): Promise<WeightEntry[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('weight_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching weight entries:', error);
      return [];
    }

    return data.map(entry => ({
      id: entry.id,
      date: entry.date,
      weight: entry.weight,
      note: entry.note || undefined,
    }));
  },

  async saveWeightEntries(entries: WeightEntry[]): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get existing entries
    const { data: existing } = await supabase
      .from('weight_entries')
      .select('id')
      .eq('user_id', user.id);

    const existingIds = new Set(existing?.map(e => e.id) || []);

    // Insert new entries
    const newEntries = entries.filter(e => !existingIds.has(e.id));
    if (newEntries.length > 0) {
      await supabase.from('weight_entries').insert(
        newEntries.map(entry => ({
          id: entry.id,
          user_id: user.id,
          date: entry.date,
          weight: entry.weight,
          note: entry.note || null,
        }))
      );
    }
  },

  // Measurements
  async getMeasurements(): Promise<MeasurementEntry[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('measurements')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching measurements:', error);
      return [];
    }

    return data.map(m => ({
      id: m.id,
      date: m.date,
      chest: m.chest || undefined,
      waist: m.waist || undefined,
      abdomen: m.abdomen || undefined,
      hips: m.hips || undefined,
      thigh: m.thigh || undefined,
      arm: m.arm || undefined,
      calf: m.calf || undefined,
    }));
  },

  async saveMeasurements(measurements: MeasurementEntry[]): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: existing } = await supabase
      .from('measurements')
      .select('id')
      .eq('user_id', user.id);

    const existingIds = new Set(existing?.map(m => m.id) || []);
    const newMeasurements = measurements.filter(m => !existingIds.has(m.id));

    if (newMeasurements.length > 0) {
      await supabase.from('measurements').insert(
        newMeasurements.map(m => ({
          id: m.id,
          user_id: user.id,
          date: m.date,
          chest: m.chest || null,
          waist: m.waist || null,
          abdomen: m.abdomen || null,
          hips: m.hips || null,
          thigh: m.thigh || null,
          arm: m.arm || null,
          calf: m.calf || null,
        }))
      );
    }
  },

  // Goal
  async getGoal(): Promise<Goal | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      type: data.type,
      currentWeight: data.current_weight,
      targetWeight: data.target_weight,
      startDate: data.start_date,
      targetDate: data.target_date || undefined,
      startingWeight: data.starting_weight,
    };
  },

  async saveGoal(goal: Goal): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('goals').upsert({
      id: goal.id,
      user_id: user.id,
      type: goal.type,
      current_weight: goal.currentWeight,
      target_weight: goal.targetWeight,
      start_date: goal.startDate,
      target_date: goal.targetDate || null,
      starting_weight: goal.startingWeight,
    });
  },

  // Profile - CORRIGIDO: height e fitness_goal não existem no banco
  // Serão gerenciados apenas no localStorage
  async getProfile(): Promise<UserProfile | null> {
    const stored = localStorage.getItem('shapeme_profile');
    if (!stored) return null;
    return JSON.parse(stored);
  },

  async saveProfile(profile: UserProfile): Promise<void> {
    localStorage.setItem('shapeme_profile', JSON.stringify(profile));
  },

  // Progress Photos
  async getProgressPhotos(): Promise<ProgressPhoto[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('progress_photos')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching progress photos:', error);
      return [];
    }

    return data.map(p => ({
      id: p.id,
      date: p.date,
      imageUrl: p.image_url,
      weight: p.weight,
      note: p.note || undefined,
    }));
  },

  async saveProgressPhotos(photos: ProgressPhoto[]): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: existing } = await supabase
      .from('progress_photos')
      .select('id')
      .eq('user_id', user.id);

    const existingIds = new Set(existing?.map(p => p.id) || []);
    const newPhotos = photos.filter(p => !existingIds.has(p.id));

    if (newPhotos.length > 0) {
      await supabase.from('progress_photos').insert(
        newPhotos.map(p => ({
          id: p.id,
          user_id: user.id,
          date: p.date,
          image_url: p.imageUrl,
          weight: p.weight,
          note: p.note || null,
        }))
      );
    }
  },

  // Subscription
  async getSubscription(): Promise<UserSubscription | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;

    return {
      planType: data.plan_type,
      billingCycle: data.billing_cycle,
      startDate: data.start_date,
      expiryDate: data.expiry_date,
      isActive: data.is_active,
    };
  },

  async saveSubscription(subscription: UserSubscription): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Deactivate old subscriptions
    await supabase
      .from('subscriptions')
      .update({ is_active: false })
      .eq('user_id', user.id);

    // Insert new subscription
    await supabase.from('subscriptions').insert({
      user_id: user.id,
      plan_type: subscription.planType,
      billing_cycle: subscription.billingCycle,
      start_date: subscription.startDate,
      expiry_date: subscription.expiryDate,
      is_active: subscription.isActive,
    });

    // Update user onboarding status
    await supabase
      .from('users')
      .update({ has_completed_onboarding: true })
      .eq('id', user.id);
  },

  // Meal Plans (not stored in DB, generated on-demand)
  getMealPlans(): MealPlan[] {
    return [];
  },

  saveMealPlans(plans: MealPlan[]): void {
    // Meal plans are generated on-demand, not stored
  },
};

// Authentication Functions
export const auth = {
  async register(
    name: string,
    email: string,
    password: string,
    dateOfBirth: string,
    gender: 'male' | 'female' | 'other',
    height?: number,
    fitnessGoal?: 'weight_loss' | 'muscle_gain' | 'maintenance'
  ): Promise<User> {
    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw new Error(authError.message);
    if (!authData.user) throw new Error('Erro ao criar conta');

    // Create user profile - CORRIGIDO: birth_date em vez de date_of_birth
    // NOTA: height e fitness_goal não existem no banco, serão salvos no perfil depois
    const { error: profileError } = await supabase.from('users').insert({
      id: authData.user.id,
      email,
      name,
      birth_date: dateOfBirth, // CORRIGIDO
      gender,
    });

    if (profileError) throw new Error(profileError.message);

    // Salvar height e fitnessGoal no localStorage se fornecidos
    if (height !== undefined || fitnessGoal !== undefined) {
      const localProfile: any = {};
      if (height !== undefined) localProfile.height = height;
      if (fitnessGoal !== undefined) localProfile.fitnessGoal = fitnessGoal;
      localStorage.setItem('shapeme_profile', JSON.stringify(localProfile));
    }

    return {
      id: authData.user.id,
      name,
      email,
      dateOfBirth,
      gender,
      height,
      fitnessGoal,
      createdAt: new Date().toISOString(),
      hasCompletedOnboarding: false,
    };
  },

  async login(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Erro ao fazer login');

    // Get user profile - CORRIGIDO: birth_date em vez de date_of_birth
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) throw new Error('Perfil não encontrado');

    // CORRIGIDO: height e fitness_goal do localStorage
    const storedProfile = localStorage.getItem('shapeme_profile');
    const localProfile = storedProfile ? JSON.parse(storedProfile) : null;

    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      dateOfBirth: profile.birth_date,
      gender: profile.gender,
      height: localProfile?.height,
      fitnessGoal: localProfile?.fitnessGoal,
      createdAt: profile.created_at,
      hasCompletedOnboarding: profile.has_completed_onboarding,
    };
  },

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    // CORRIGIDO: Atualizar apenas campos que existem no banco
    const { error } = await supabase
      .from('users')
      .update({
        name: updates.name,
        email: updates.email,
        birth_date: updates.dateOfBirth,
        gender: updates.gender,
      })
      .eq('id', userId);

    if (error) throw new Error(error.message);

    // Salvar height e fitnessGoal no localStorage
    if (updates.height !== undefined || updates.fitnessGoal !== undefined) {
      const storedProfile = localStorage.getItem('shapeme_profile');
      const localProfile = storedProfile ? JSON.parse(storedProfile) : {};
      
      if (updates.height !== undefined) localProfile.height = updates.height;
      if (updates.fitnessGoal !== undefined) localProfile.fitnessGoal = updates.fitnessGoal;
      
      localStorage.setItem('shapeme_profile', JSON.stringify(localProfile));
    }

    // Get updated user
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (!profile) throw new Error('Erro ao atualizar perfil');

    const storedProfile = localStorage.getItem('shapeme_profile');
    const localProfile = storedProfile ? JSON.parse(storedProfile) : null;

    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      dateOfBirth: profile.birth_date,
      gender: profile.gender,
      height: localProfile?.height,
      fitnessGoal: localProfile?.fitnessGoal,
      createdAt: profile.created_at,
      hasCompletedOnboarding: profile.has_completed_onboarding,
    };
  },
};

// Feature Access Control
export function hasFeatureAccess(
  subscription: UserSubscription | null,
  feature: 'meal_plans' | 'workouts' | 'unlimited_photos' | 'advanced_analytics' | 'customization'
): boolean {
  if (!subscription || !subscription.isActive) return false;

  const { planType } = subscription;

  switch (feature) {
    case 'meal_plans':
    case 'workouts':
    case 'advanced_analytics':
      return planType === 'medium' || planType === 'top';
    case 'unlimited_photos':
      return planType === 'medium' || planType === 'top';
    case 'customization':
      return planType === 'top';
    default:
      return false;
  }
}
