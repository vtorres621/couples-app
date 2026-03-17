export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string
          text: string
          is_checked: boolean
          checked_by: string | null
          checked_at: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          text: string
          is_checked?: boolean
          checked_by?: string | null
          checked_at?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          text?: string
          is_checked?: boolean
          checked_by?: string | null
          checked_at?: string | null
          created_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
      grocery_items: {
        Row: {
          id: string
          text: string
          is_checked: boolean
          checked_by: string | null
          checked_at: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          text: string
          is_checked?: boolean
          checked_by?: string | null
          checked_at?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          text?: string
          is_checked?: boolean
          checked_by?: string | null
          checked_at?: string | null
          created_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
      trips: {
        Row: {
          id: string
          name: string
          destination: string | null
          trip_date: string
          notes: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          destination?: string | null
          trip_date: string
          notes?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          destination?: string | null
          trip_date?: string
          notes?: string | null
          created_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
  // Required by @supabase/postgrest-js v2 (ships with supabase-js v2.39+)
} & { PostgrestVersion: "12" }

export type Task = Database['public']['Tables']['tasks']['Row']
export type GroceryItem = Database['public']['Tables']['grocery_items']['Row']
export type Trip = Database['public']['Tables']['trips']['Row']
