'use client';

import React, { useState } from 'react';
import {
  Search, Filter, Eye, Clock, FileText,
} from 'lucide-react';
import { useDeals, DealData } from '@/context/DealContext';
import { useProfile } from '@/context/ProfileContext';
import DealModal from '@/components/Chat/DealModal';

const STATUS_MAP: Record<string, { badge: string; dot: string }> = {
  'Accepted':              { badge: 'badge-success', dot: 'dot-success' },
  'In Progress':           { badge: 'badge-info',    dot: 'dot-info' },
  'Shipped':               { badge: 'badge-success', dot: 'dot-success' },
  'Rejected':              { badge: 'badge-danger',  dot: 'dot-danger' },
  'Waiting for Approval':  { badge: 'badge-warning', dot: 'dot-warning' },
  'Pending':               { badge: 'badge-neutral', dot: 'dot-neutral' },
};

const PROGRESS_COLOR: Record<string, string> = {
  'Accepted':             'var(--positive)',
  'In Progress':          'var(--info)',
  'Shipped':              'var(--positive)',
  'Rejected':             'var(--negative)',
  'Waiting for Approval': 'var(--warning)',
  'Pending':              'var(--text-tertiary)',
};

export default function DealsPage() {
  const { deals, updateDeal, deleteDeal } = useDeals();
  const { profile } = useProfile();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeal, setSelectedDeal] = useState<DealData | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (profile === 'user') return deal.status !== 'Waiting for Approval' && deal.status !== 'Rejected';
    return true;
  });

  const stats = [
    { label: 'Total Goods Spend', value: deals.reduce((a, d) => a + d.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0), 0) },
    { label: 'Agent Fees',        value: deals.reduce((a, d) => a + (d.agentFlatFee ?? 500), 0) },
    { label: 'Platform Fees (3%)',value: deals.reduce((a, d) => a + d.items.reduce((s, i) => s + i.unitPrice * i.quantity * 0.03, 0), 0) },
    { label: 'Total Volume',      value: deals.reduce((a, d) => a + d.items.reduce((s, i) => s + i.unitPrice * i.quantity * 1.08, 0), 0) },
  ];

  return (
    <div className="page-container animate-in">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-title">
            {profile === 'worker' ? 'Platform Deals' : 'My Deals'}
          </h1>
          <p className="page-subtitle">
            {profile === 'worker'
              ? 'Monitor and manage all sourcing contracts across the platform.'
              : 'Track and manage all your active sourcing contracts.'}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-stats" style={{ marginBottom: 20 }}>
        {stats.map((s, i) => (
          <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ fontSize: '1.25rem', marginTop: 4 }}>
              ${s.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="card" style={{ display: 'flex', gap: 10, padding: '10px 14px', marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 200 }}>
          <Search size={15} color="var(--text-tertiary)" style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search deals..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              flex: 1, border: 'none', outline: 'none',
              background: 'transparent', color: 'var(--text-primary)',
              fontSize: '0.85rem',
            }}
          />
        </div>
        <button className="btn btn-ghost btn-sm" style={{ flexShrink: 0 }}>
          <Filter size={13} /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        {filteredDeals.length > 0 ? (
          <table className="data-table" style={{ minWidth: 700 }}>
            <thead>
              <tr>
                <th>Contract</th>
                <th>Order Details</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeals.map(deal => {
                const sc = STATUS_MAP[deal.status] ?? { badge: 'badge-neutral', dot: 'dot-neutral' };
                const pct = Math.round((deal.currentStep / 5) * 100);
                return (
                  <tr key={deal.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                          background: 'var(--accent-dim)', color: 'var(--accent)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <FileText size={16} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{deal.title}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: 1 }}>ID: {deal.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                        {deal.items.reduce((a, i) => a + i.quantity, 0)} units
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                        ${deal.items.reduce((a, i) => a + i.unitPrice * i.quantity, 0).toFixed(2)}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${sc.badge}`}>
                        <span className={`dot ${sc.dot}`} />
                        {deal.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ width: 120 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            Step {deal.currentStep}/5
                          </span>
                          <span>{pct}%</span>
                        </div>
                        <div style={{ height: 4, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', width: `${pct}%`,
                            background: PROGRESS_COLOR[deal.status] ?? 'var(--accent)',
                            borderRadius: 4, transition: 'width 0.4s ease',
                          }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => { setSelectedDeal(deal); setIsModalOpen(true); }}
                      >
                        <Eye size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '60px 40px', textAlign: 'center' }}>
            <FileText size={36} style={{ margin: '0 auto 14px', color: 'var(--text-tertiary)', display: 'block' }} />
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 6 }}>No deals found</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
              Head to the chat to begin a sourcing contract.
            </p>
          </div>
        )}
      </div>

      <DealModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedDeal(undefined); }}
        userRole={profile === 'user' ? 'client' : (profile as any)}
        onCreateDeal={updateDeal}
        onDelete={deleteDeal}
        initialDeal={selectedDeal}
      />
    </div>
  );
}
