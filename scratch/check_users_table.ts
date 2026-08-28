
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dtnsxzqnmusuijnzursa.supabase.co';
const supabaseAnonKey = 'sb_publishable_GRsgtVpz5ks4oyi1UNf0_A_AVmbCbOr';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkOtherTables() {
  console.log('Checking for users table...');
  const { data, error } = await supabase.from('users').select('*');
  if (error) {
    console.error('Error fetching users:', error.message);
  } else {
    console.log(`Total users found: ${data?.length}`);
  }
}

checkOtherTables();
