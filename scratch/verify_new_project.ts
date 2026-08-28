
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qtfydrnhlkoxasohqzzu.supabase.co';
const supabaseAnonKey = 'sb_publishable_vvyHiZ3q3JsDaNup1AR2Ww_hExYpbWL';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verify() {
  console.log('Verifying connection with NEW project qtfydrnhlkoxasohqzzu...');
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log(`Success! Found ${data?.length} profiles.`);
    if (data && data.length > 0) {
      console.log('Profile roles:', [...new Set(data.map(p => p.role))]);
    }
  }
}

verify();
