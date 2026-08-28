
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dtnsxzqnmusuijnzursa.supabase.co';
const supabaseAnonKey = 'sb_publishable_GRsgtVpz5ks4oyi1UNf0_A_AVmbCbOr';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProfiles() {
  console.log('Checking profiles in Supabase...');
  const { data: allProfiles, error: allErr } = await supabase.from('profiles').select('id, name, role');
  if (allErr) {
    console.error('Error fetching all profiles:', allErr);
  } else {
    console.log(`Total profiles found: ${allProfiles.length}`);
    const counts: Record<string, number> = {};
    allProfiles.forEach(p => {
      counts[p.role] = (counts[p.role] || 0) + 1;
      console.log(`- [${p.role}] ${p.name} (${p.id})`);
    });
    console.log('Counts by role:', counts);
  }
}

checkProfiles();
