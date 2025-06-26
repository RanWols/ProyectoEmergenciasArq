import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client for server actions
export const createServerClient = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: "administrador" | "coordinador" | "inspector" | "docente"
          department: string | null
          phone: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          role: "administrador" | "coordinador" | "inspector" | "docente"
          department?: string | null
          phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: "administrador" | "coordinador" | "inspector" | "docente"
          department?: string | null
          phone?: string | null
          is_active?: boolean
          updated_at?: string
        }
      }
      alerts: {
        Row: {
          id: string
          type: "incendio" | "sismo" | "medica" | "intruso"
          location: string
          location_id: string
          description: string
          status: "activa" | "resuelta"
          reported_by: string
          resolved_by: string | null
          created_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          type: "incendio" | "sismo" | "medica" | "intruso"
          location: string
          location_id: string
          description: string
          status?: "activa" | "resuelta"
          reported_by: string
          resolved_by?: string | null
          created_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          type?: "incendio" | "sismo" | "medica" | "intruso"
          location?: string
          location_id?: string
          description?: string
          status?: "activa" | "resuelta"
          reported_by?: string
          resolved_by?: string | null
          resolved_at?: string | null
        }
      }
      panic_alerts: {
        Row: {
          id: string
          location: string
          student_info: string
          status: "pending" | "confirmed" | "false_alarm"
          confirmed_by: string | null
          confirmed_at: string | null
          alert_type: "incendio" | "sismo" | "medica" | "intruso" | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          location: string
          student_info: string
          status?: "pending" | "confirmed" | "false_alarm"
          confirmed_by?: string | null
          confirmed_at?: string | null
          alert_type?: "incendio" | "sismo" | "medica" | "intruso" | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          location?: string
          student_info?: string
          status?: "pending" | "confirmed" | "false_alarm"
          confirmed_by?: string | null
          confirmed_at?: string | null
          alert_type?: "incendio" | "sismo" | "medica" | "intruso" | null
          description?: string | null
        }
      }
      geofence_events: {
        Row: {
          id: string
          zone_id: string
          user_id: string
          user_name: string
          user_role: string
          event_type: "entry" | "exit" | "dwell_exceeded" | "unauthorized_access"
          location_id: string
          risk_level: "low" | "medium" | "high" | "critical"
          alert_triggered: boolean
          resolved: boolean
          resolved_by: string | null
          resolved_at: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          zone_id: string
          user_id: string
          user_name: string
          user_role: string
          event_type: "entry" | "exit" | "dwell_exceeded" | "unauthorized_access"
          location_id: string
          risk_level: "low" | "medium" | "high" | "critical"
          alert_triggered?: boolean
          resolved?: boolean
          resolved_by?: string | null
          resolved_at?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          zone_id?: string
          user_id?: string
          user_name?: string
          user_role?: string
          event_type?: "entry" | "exit" | "dwell_exceeded" | "unauthorized_access"
          location_id?: string
          risk_level?: "low" | "medium" | "high" | "critical"
          alert_triggered?: boolean
          resolved?: boolean
          resolved_by?: string | null
          resolved_at?: string | null
          notes?: string | null
        }
      }
    }
  }
}
