'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
      });

      if (resetError) {
        setError(resetError.message === 'Failed to fetch'
          ? 'Não foi possível contactar o serviço de autenticação. Verifique a ligação e tente novamente.'
          : resetError.message);
      } else {
        setMessage('Se o email existir, receberá um link para redefinir a password.');
      }
    } catch {
      setError('Não foi possível contactar o serviço de autenticação. Verifique a ligação e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: '12vh auto', padding: 24 }}>
      <h1>Redefinir password</h1>
      <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
        <label>
          Email
          <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        {error && <p role="alert">{error}</p>}
        {message && <p role="status">{message}</p>}
        <button disabled={loading}>{loading ? 'A enviar…' : 'Enviar link'}</button>
      </form>
      <p><Link href="/auth/login">Voltar ao login</Link></p>
    </main>
  );
}
