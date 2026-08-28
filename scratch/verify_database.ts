
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dtnsxzqnmusuijnzursa.supabase.co';
const supabaseAnonKey = 'sb_publishable_GRsgtVpz5ks4oyi1UNf0_A_AVmbCbOr';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listTables() {
  console.log('Listing all public tables...');
  // Note: Standard Supabase anon key cannot usually query information_schema 
  // but we can try common table names.
  const tables = ['profiles', 'conversations', 'messages', 'deals', 'users', 'agents', 'clients'];
  for (const table of tables) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) {
      console.log(`Table [${table}]: Not found or error: ${error.message}`);
    } else {
      console.log(`Table [${table}]: Found! Row count: ${count}`);
    }
  }
}

listTables();
