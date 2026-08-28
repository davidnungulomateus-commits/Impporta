
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dtnsxzqnmusuijnzursa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0bnN4enFubXVzdWlqbnp1cnNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MDgxMDAsImV4cCI6MjA5NDA4NDEwMH0.HPCle5cDK6jobvoVABqq0hHS_WChmvfq5gZTvv5aze8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function insertTest() {
  const testId = '00000000-0000-0000-0000-000000000999';
  console.log('Inserting test user "Agent antigravity (TEST)"...');
  
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      { id: testId, name: 'Agent antigravity (TEST)', role: 'agent' }
    ])
    .select();

  if (error) {
    console.error('Insert failed:', error.message);
  } else {
    console.log('Insert SUCCESS!', data);
    
    console.log('Now checking if I can read it back...');
    const { data: readData, error: readErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', testId);
      
    console.log('Read result:', readData);
  }
}

insertTest();
