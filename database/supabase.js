import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://oqyzpbinvyfwrvrsjmeq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xeXpwYmludnlmd3J2cnNqbWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NTQzNTYsImV4cCI6MjA1OTQzMDM1Nn0.DHaZiCZUx2n_qgc4cT0ygyCbmwH_sRGOY7OQz5nj_IE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
