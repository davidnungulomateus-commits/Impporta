
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dtnsxzqnmusuijnzursa.supabase.co';
const supabaseAnonKey = 'sb_publishable_GRsgtVpz5ks4oyi1UNf0_A_AVmbCbOr';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedData() {
  console.log('Seeding data into Supabase...');

  // 1. Insert Profiles
  const profiles = [
    { id: '00000000-0000-0000-0000-000000000001', name: 'David Client', role: 'user' },
    { id: '00000000-0000-0000-0000-000000000008', name: 'Maria Santos', role: 'user' },
    { id: '00000000-0000-0000-0000-000000000009', name: 'Robert Smith', role: 'user' },
    { id: '00000000-0000-0000-0000-000000000010', name: 'Anna Kowalski', role: 'user' },
    { id: '00000000-0000-0000-0000-000000000011', name: 'Pierre Dubois', role: 'user' },
    { id: '00000000-0000-0000-0000-000000000012', name: 'Sarah Jenkins', role: 'user' },
    { id: '00000000-0000-0000-0000-000000000003', name: 'Li Wei', role: 'agent' },
    { id: '00000000-0000-0000-0000-000000000004', name: 'Sofia Rodriguez', role: 'agent' },
    { id: '00000000-0000-0000-0000-000000000005', name: 'James Chen', role: 'agent' },
    { id: '00000000-0000-0000-0000-000000000006', name: 'Elena Silva', role: 'agent' },
    { id: '00000000-0000-0000-0000-000000000013', name: 'Ahmed Hassan', role: 'agent' },
    { id: '00000000-0000-0000-0000-000000000014', name: 'Yuki Tanaka', role: 'agent' },
    { id: '00000000-0000-0000-0000-000000000007', name: 'Platform Specialist', role: 'worker' },
    { id: '00000000-0000-0000-0000-000000000015', name: 'Marco Rossi', role: 'worker' },
    { id: '00000000-0000-0000-0000-000000000016', name: 'Linda Wang', role: 'worker' },
    { id: '00000000-0000-0000-0000-000000000017', name: 'Carlos Ruiz', role: 'worker' },
    { id: '00000000-0000-0000-0000-000000000018', name: 'Priya Sharma', role: 'worker' },
    { id: '00000000-0000-0000-0000-000000000019', name: 'Hans Schmidt', role: 'worker' },
  ];

  console.log('Inserting profiles...');
  const { error: pErr } = await supabase.from('profiles').upsert(profiles);
  if (pErr) console.error('Error seeding profiles:', pErr.message);
  else console.log('Profiles seeded successfully.');

  // 2. Insert Conversations
  const conversations = [
    { id: 'aaaaaaaa-0000-0000-0000-000000000001', client_id: '00000000-0000-0000-0000-000000000001', agent_id: '00000000-0000-0000-0000-000000000003' },
    { id: 'aaaaaaaa-0000-0000-0000-000000000002', client_id: '00000000-0000-0000-0000-000000000008', agent_id: '00000000-0000-0000-0000-000000000004' },
    { id: 'aaaaaaaa-0000-0000-0000-000000000003', client_id: '00000000-0000-0000-0000-000000000009', agent_id: '00000000-0000-0000-0000-000000000003' },
    { id: 'aaaaaaaa-0000-0000-0000-000000000004', client_id: '00000000-0000-0000-0000-000000000010', agent_id: '00000000-0000-0000-0000-000000000005' },
  ];

  console.log('Inserting conversations...');
  const { error: cErr } = await supabase.from('conversations').upsert(conversations);
  if (cErr) console.error('Error seeding conversations:', cErr.message);
  else console.log('Conversations seeded successfully.');

  // 3. Insert Messages
  const messages = [
    { conversation_id: 'aaaaaaaa-0000-0000-0000-000000000001', sender_id: '00000000-0000-0000-0000-000000000001', sender_role: 'client', content: 'Hi Li Wei! I am looking for bulk electronics.', type: 'text', status: 'read' },
    { conversation_id: 'aaaaaaaa-0000-0000-0000-000000000001', sender_id: '00000000-0000-0000-0000-000000000003', sender_role: 'agent', content: 'Hello David! Great, what quantities are you looking for?', type: 'text', status: 'read' },
    { conversation_id: 'aaaaaaaa-0000-0000-0000-000000000001', sender_id: '00000000-0000-0000-0000-000000000001', sender_role: 'client', content: 'Around 500 units of wireless earbuds.', type: 'text', status: 'read' },
    { conversation_id: 'aaaaaaaa-0000-0000-0000-000000000001', sender_id: '00000000-0000-0000-0000-000000000003', sender_role: 'agent', content: 'I can source that. Let me prepare a deal proposal for you.', type: 'text', status: 'delivered' },
    { conversation_id: 'aaaaaaaa-0000-0000-0000-000000000002', sender_id: '00000000-0000-0000-0000-000000000008', sender_role: 'client', content: 'Sofia, I need 200 cotton t-shirts for my store.', type: 'text', status: 'read' },
    { conversation_id: 'aaaaaaaa-0000-0000-0000-000000000002', sender_id: '00000000-0000-0000-0000-000000000004', sender_role: 'agent', content: 'Hola Maria! I have great suppliers in Mexico. What sizes?', type: 'text', status: 'read' },
    { conversation_id: 'aaaaaaaa-0000-0000-0000-000000000002', sender_id: '00000000-0000-0000-0000-000000000008', sender_role: 'client', content: 'S, M, L, XL — equal distribution.', type: 'text', status: 'delivered' },
    { conversation_id: 'aaaaaaaa-0000-0000-0000-000000000003', sender_id: '00000000-0000-0000-0000-000000000009', sender_role: 'client', content: 'I need smart home devices sourced from China.', type: 'text', status: 'read' },
    { conversation_id: 'aaaaaaaa-0000-0000-0000-000000000003', sender_id: '00000000-0000-0000-0000-000000000003', sender_role: 'agent', content: 'Perfect, I specialize in that. What is your target price range?', type: 'text', status: 'delivered' },
  ];

  console.log('Inserting messages...');
  const { error: mErr } = await supabase.from('messages').upsert(messages);
  if (mErr) console.error('Error seeding messages:', mErr.message);
  else console.log('Messages seeded successfully.');

  console.log('Seeding complete.');
}

seedData();
