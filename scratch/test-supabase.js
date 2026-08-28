const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length === 2) {
    env[parts[0].trim()] = parts[1].trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Connecting to Supabase URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  try {
    const { data: profiles, error: pError } = await supabase.from('profiles').select('*');
    if (pError) {
      console.error('Error fetching profiles:', pError);
    } else {
      console.log('Profiles in database:', profiles);
    }

    const { data: conversations, error: cError } = await supabase.from('conversations').select('*');
    if (cError) {
      console.error('Error fetching conversations:', cError);
    } else {
      console.log('Conversations in database count:', conversations?.length);
    }

    const { data: buckets, error: bError } = await supabase.storage.listBuckets();
    if (bError) {
      console.error('Error listing storage buckets:', bError);
    } else {
      console.log('Storage Buckets in database:', buckets);
    }
  } catch (err) {
    console.error('Failed to run test:', err);
  }
}

run();
