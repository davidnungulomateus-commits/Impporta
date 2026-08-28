
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dtnsxzqnmusuijnzursa.supabase.co';
const supabaseAnonKey = 'sb_publishable_GRsgtVpz5ks4oyi1UNf0_A_AVmbCbOr';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDeals() {
  console.log('Checking deals in Supabase...');
  const { data, error } = await supabase.from('deals').select('*');
  if (error) {
    console.error('Error fetching deals:', error.message);
  } else {
    console.log(`Total deals found: ${data?.length}`);
  }
}

checkDeals();
