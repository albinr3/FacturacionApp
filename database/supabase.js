import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://oqyzpbinvyfwrvrsjmeq.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
