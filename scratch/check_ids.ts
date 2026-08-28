
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qtfydrnhlkoxasohqzzu.supabase.co';
const supabaseAnonKey = 'sb_publishable_vvyHiZ3q3JsDaNup1AR2Ww_hExYpbWL';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkIds() {
  const { data } = await supabase.from('profiles').select('id, name, role').limit(5);
  console.log('Sample profiles in DB:', data);
}

checkIds();
