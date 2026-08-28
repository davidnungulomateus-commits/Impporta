'use client';

import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function PaymentWorkflow({ onComplete }: { onComplete: () => void }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'var(--bg-surface)',
      zIndex: 3000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
      animation: 'fadeIn 0.5s ease-out'
    }}>
      <div style={{ 
        width: '120px', 
        height: '120px', 
        borderRadius: '50%', 
        backgroundColor: '#ECFDF5', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#10B981',
        animation: 'scaleUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}>
        <CheckCircle2 size={64} strokeWidth={2.5} />
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--neutral)', marginBottom: '8px' }}>
          Payment Workflow
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Securely processing your transaction...
        </p>
      </div>

      <button 
        onClick={onComplete}
        style={{
          marginTop: '32px',
          padding: '16px 32px',
          borderRadius: '12px',
          backgroundColor: 'var(--neutral)',
          color: 'white',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer'
        }}
      >
        Finish Process <ArrowRight size={18} />
      </button>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
