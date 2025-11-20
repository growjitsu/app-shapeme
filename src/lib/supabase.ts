import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Variáveis de ambiente do Supabase não configuradas!');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓ Configurada' : '✗ Faltando');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ Configurada' : '✗ Faltando');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Database types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          date_of_birth: string;
          gender: 'male' | 'female' | 'other';
          height: number | null;
          fitness_goal: 'weight_loss' | 'muscle_gain' | 'maintenance' | null;
          created_at: string;
          has_completed_onboarding: boolean;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          date_of_birth: string;
          gender: 'male' | 'female' | 'other';
          height?: number | null;
          fitness_goal?: 'weight_loss' | 'muscle_gain' | 'maintenance' | null;
          created_at?: string;
          has_completed_onboarding?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          date_of_birth?: string;
          gender?: 'male' | 'female' | 'other';
          height?: number | null;
          fitness_goal?: 'weight_loss' | 'muscle_gain' | 'maintenance' | null;
          created_at?: string;
          has_completed_onboarding?: boolean;
        };
      };
      weight_entries: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          weight: number;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          weight: number;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          weight?: number;
          note?: string | null;
          created_at?: string;
        };
      };
      measurements: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          chest: number | null;
          waist: number | null;
          abdomen: number | null;
          hips: number | null;
          thigh: number | null;
          arm: number | null;
          calf: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          chest?: number | null;
          waist?: number | null;
          abdomen?: number | null;
          hips?: number | null;
          thigh?: number | null;
          arm?: number | null;
          calf?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          chest?: number | null;
          waist?: number | null;
          abdomen?: number | null;
          hips?: number | null;
          thigh?: number | null;
          arm?: number | null;
          calf?: number | null;
          created_at?: string;
        };
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          type: 'lose' | 'gain';
          current_weight: number;
          target_weight: number;
          start_date: string;
          target_date: string | null;
          starting_weight: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'lose' | 'gain';
          current_weight: number;
          target_weight: number;
          start_date: string;
          target_date?: string | null;
          starting_weight: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'lose' | 'gain';
          current_weight?: number;
          target_weight?: number;
          start_date?: string;
          target_date?: string | null;
          starting_weight?: number;
          created_at?: string;
        };
      };
      progress_photos: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          image_url: string;
          weight: number;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          image_url: string;
          weight: number;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          image_url?: string;
          weight?: number;
          note?: string | null;
          created_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_type: 'simple' | 'medium' | 'top';
          billing_cycle: 'monthly' | 'yearly';
          start_date: string;
          expiry_date: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_type: 'simple' | 'medium' | 'top';
          billing_cycle: 'monthly' | 'yearly';
          start_date: string;
          expiry_date: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_type?: 'simple' | 'medium' | 'top';
          billing_cycle?: 'monthly' | 'yearly';
          start_date?: string;
          expiry_date?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
    };
  };
};
