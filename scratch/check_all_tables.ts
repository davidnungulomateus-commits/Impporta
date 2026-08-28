
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dtnsxzqnmusuijnzursa.supabase.co';
const supabaseAnonKey = 'sb_publishable_GRsgtVpz5ks4oyi1UNf0_A_AVmbCbOr';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listTables() {
  console.log('Listing tables and data counts...');
  
  // Profiles check
  const { data: pData, error: pErr } = await supabase.from('profiles').select('*');
  console.log('Profiles:', pErr ? pErr.message : pData?.length);

  // Conversations check
  const { data: cData, error: cErr } = await supabase.from('conversations').select('*');
  console.log('Conversations:', cErr ? cErr.message : cData?.length);

  // Messages check
  const { data: mData, error: mErr } = await supabase.from('messages').select('*');
  console.log('Messages:', mErr ? mErr.message : mData?.length);
}

listTables();
