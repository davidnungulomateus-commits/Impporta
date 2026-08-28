
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qtfydrnhlkoxasohqzzu.supabase.co';
const supabaseAnonKey = 'sb_publishable_vvyHiZ3q3JsDaNup1AR2Ww_hExYpbWL';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkChat() {
  console.log('Checking conversations and messages in project qtfydrnhlkoxasohqzzu...');
  const { count: convCount } = await supabase.from('conversations').select('*', { count: 'exact', head: true });
  const { count: msgCount } = await supabase.from('messages').select('*', { count: 'exact', head: true });
  
  console.log(`Conversations: ${convCount}`);
  console.log(`Messages: ${msgCount}`);
}

checkChat();
