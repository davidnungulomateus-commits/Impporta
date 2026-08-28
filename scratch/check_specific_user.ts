
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dtnsxzqnmusuijnzursa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0bnN4enFubXVzdWlqbnp1cnNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MDgxMDAsImV4cCI6MjA5NDA4NDEwMH0.HPCle5cDK6jobvoVABqq0hHS_WChmvfq5gZTvv5aze8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSpecificUser() {
  console.log('Searching for "Worker 06" (63d7a1e3-2ecc-4acc-a821-2cc82818703d)...');
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', '63d7a1e3-2ecc-4acc-a821-2cc82818703d');

  if (error) {
    console.error('Error:', error.message);
  } else if (data && data.length > 0) {
    console.log('SUCCESS! Found user:', data[0].name);
  } else {
    console.log('User not found. This project ID might be wrong or RLS is blocking access.');
    
    // Try to see if we can even list the tables again
    const { data: tables, error: tableErr } = await supabase.from('profiles').select('id').limit(1);
    console.log('Quick check - any profile ID:', tables);
  }
}

checkSpecificUser();
