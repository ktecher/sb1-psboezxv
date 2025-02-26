export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      places: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string
          address: string | null
          coordinates: [number, number] | null
          images: string[] | null
          rating: number
          opening_hours: Json | null
          contact_info: Json | null
          created_at: string
          seasonal: 'summer' | 'winter' | null
          features: string[] | null
          user_id: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: string
          address?: string | null
          coordinates?: [number, number] | null
          images?: string[] | null
          rating?: number
          opening_hours?: Json | null
          contact_info?: Json | null
          created_at?: string
          seasonal?: 'summer' | 'winter' | null
          features?: string[] | null
          user_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string
          address?: string | null
          coordinates?: [number, number] | null
          images?: string[] | null
          rating?: number
          opening_hours?: Json | null
          contact_info?: Json | null
          created_at?: string
          seasonal?: 'summer' | 'winter' | null
          features?: string[] | null
          user_id?: string | null
        }
      }
      plans: {
        Row: {
          id: string
          user_id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      plan_items: {
        Row: {
          id: string
          plan_id: string
          place_id: string
          scheduled_for: string
          duration_minutes: number
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          plan_id: string
          place_id: string
          scheduled_for: string
          duration_minutes: number
          order: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          plan_id?: string
          place_id?: string
          scheduled_for?: string
          duration_minutes?: number
          order?: number
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          place_id: string
          user_id: string
          rating: number
          content: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          place_id: string
          user_id: string
          rating: number
          content?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          place_id?: string
          user_id?: string
          rating?: number
          content?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      saved_places: {
        Row: {
          id: string
          user_id: string
          place_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          place_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          place_id?: string
          created_at?: string
        }
      }
    }
  }
}