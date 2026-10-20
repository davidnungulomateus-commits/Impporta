'use client';

import { FormEvent, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault(); setLoading(true); setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message); else router.push('/explore');
    setLoading(false);
  }

  return <main style={{ maxWidth: 420, margin: '12vh auto', padding: 24 }}>
    <h1>Entrar na Impporta</h1>
    <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
      <label>Email<input required type="email" value={email} onChange={e => setEmail(e.target.value)} /></label>
      <label>Password<input required type="password" value={password} onChange={e => setPassword(e.target.value)} /></label>
      {error && <p role="alert">{error}</p>}
      <button disabled={loading}>{loading ? 'A entrar…' : 'Entrar'}</button>
    </form>
  </main>;
}
