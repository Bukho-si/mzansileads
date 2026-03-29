import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key' // Using the publishable anon key since we disabled RLS on our mzansi_leads table!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
