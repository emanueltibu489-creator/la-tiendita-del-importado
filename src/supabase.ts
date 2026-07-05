import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://npszwrggqidncvqlvqvw.supabase.co';
const supabaseAnonKey = 'sb_publishable_h4S_FlztgZBjvgxszRjnnw_0-POnpu8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);