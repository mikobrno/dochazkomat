import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oskdjmfzewcuheucjyty.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9za2RqbWZ6ZXdjdWhldWNqeXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0Mzk4OTYsImV4cCI6MjA2OTAxNTg5Nn0.QX0YKKWu8N1_Y08MvSluMLsVnekp_04cqAH6_NAG4RI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          firstName: string;
          lastName: string;
          email: string;
          password: string;
          role: 'admin' | 'employee';
          hourlyRate: number;
          monthlyDeductions: number;
          isActive: boolean;
          createdAt: string;
        };
        Insert: {
          id?: string;
          firstName: string;
          lastName: string;
          email: string;
          password: string;
          role: 'admin' | 'employee';
          hourlyRate: number;
          monthlyDeductions: number;
          isActive?: boolean;
          createdAt?: string;
        };
        Update: {
          id?: string;
          firstName?: string;
          lastName?: string;
          email?: string;
          password?: string;
          role?: 'admin' | 'employee';
          hourlyRate?: number;
          monthlyDeductions?: number;
          isActive?: boolean;
          createdAt?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          name: string;
          isActive: boolean;
          createdAt: string;
        };
        Insert: {
          id?: string;
          name: string;
          isActive?: boolean;
          createdAt?: string;
        };
        Update: {
          id?: string;
          name?: string;
          isActive?: boolean;
          createdAt?: string;
        };
      };
      time_entries: {
        Row: {
          id: string;
          userId: string;
          date: string;
          startTime: string;
          endTime: string;
          hoursWorked: number;
          projectId: string;
          description: string | null;
          createdAt: string;
        };
        Insert: {
          id?: string;
          userId: string;
          date: string;
          startTime: string;
          endTime: string;
          hoursWorked: number;
          projectId: string;
          description?: string | null;
          createdAt?: string;
        };
        Update: {
          id?: string;
          userId?: string;
          date?: string;
          startTime?: string;
          endTime?: string;
          hoursWorked?: number;
          projectId?: string;
          description?: string | null;
          createdAt?: string;
        };
      };
    };
  };
}