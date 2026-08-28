
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dtnsxzqnmusuijnzursa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0bnN4enFubXVzdWlqbnp1cnNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MDgxMDAsImV4cCI6MjA5NDA4NDEwMH0.HPCle5cDK6jobvoVABqq0hHS_WChmvfq5gZTvv5aze8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verify() {
  console.log('Verifying connection with NEW key...');
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log(`Success! Found ${data?.length} profiles.`);
    if (data && data.length > 0) {
      console.log('Sample profile names:', data.slice(0, 3).map(p => p.name));
    }
  }
}

verify();
