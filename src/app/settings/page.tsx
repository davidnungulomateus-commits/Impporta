'use client';

import React, { useState } from 'react';
import {
  User, CreditCard, Package, MapPin, Bell,
  Shield, Camera, Plus, Trash2, ExternalLink,
  ChevronRight, DollarSign,
} from 'lucide-react';
import { useProfile } from '@/context/ProfileContext';

type SettingTab = 'profile' | 'billing' | 'saved' | 'notifications';

/* ── shared input style ─────────────────────────────────────────────────────── */
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 13px',
  background: 'var(--bg-base)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--text-primary)',
  fontSize: '0.85rem',
  outline: 'none',
  fontFamily: 'inherit',
};

/* ── section card wrapper ───────────────────────────────────────────────────── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
        {title}
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { profile } = useProfile();
  const [activeTab, setActiveTab] = useState<SettingTab>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [userData, setUserData] = useState({
    name: 'David Client',
    email: 'david@example.com',
    image: null as string | null,
    initials: 'DC',
    address: '123 Business Way, San Francisco, CA 94107',
    company: 'Impporta Global',
    phone: '+1 (555) 000-0000',
    flatFee: '500',
  });

  const savedProducts = [
    { id: 1, name: 'Wireless Earbuds Pro', category: 'Electronics', supplier: 'TechFlow Shenzhen', price: '$12.50', emoji: '🎧' },
    { id: 2, name: 'Eco-Friendly Yoga Mats', category: 'Fitness', supplier: 'GreenLeaf Textiles', price: '$8.20', emoji: '🧘' },
    { id: 3, name: 'Minimalist Coffee Grinder', category: 'Home', supplier: 'PureBrew Mfg', price: '$18.90', emoji: '☕' },
  ];

  const billingHistory = [
    { id: 'INV-001', date: 'May 10, 2026', amount: '$4,250.00', status: 'Paid' },
    { id: 'INV-002', date: 'Apr 22, 2026', amount: '$1,120.00', status: 'Paid' },
    { id: 'INV-003', date: 'Mar 15, 2026', amount: '$850.00',   status: 'Paid' },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setUserData(u => ({ ...u, image: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  /* ── TAB: Profile ─────────────────────────────────────────────────────────── */
  const renderProfile = () => (
    <>
      <Section title="Public Profile">
        <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} accept="image/*" />
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: 88, height: 88, borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-elevated)', border: '2px dashed var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent)',
                cursor: 'pointer', overflow: 'hidden',
              }}
            >
              {userData.image
                ? <img src={userData.image} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : userData.initials}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: 'absolute', bottom: -6, right: -6,
                width: 28, height: 28, borderRadius: 'var(--radius-sm)',
                background: 'var(--accent)', color: '#fff', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}
            >
              <Camera size={13} />
            </button>
          </div>

          {/* Fields */}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Full Name</label>
              <input style={inputStyle} value={userData.name} onChange={e => setUserData(u => ({ ...u, name: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Email Address</label>
              <input style={inputStyle} type="email" value={userData.email} onChange={e => setUserData(u => ({ ...u, email: e.target.value }))} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Company Name</label>
              <input style={inputStyle} value={userData.company} onChange={e => setUserData(u => ({ ...u, company: e.target.value }))} />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Business Logistics">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Primary Shipping Address</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input style={{ ...inputStyle, paddingLeft: 36 }} value={userData.address} onChange={e => setUserData(u => ({ ...u, address: e.target.value }))} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Contact Phone</label>
            <input style={inputStyle} value={userData.phone} onChange={e => setUserData(u => ({ ...u, phone: e.target.value }))} />
          </div>
        </div>
      </Section>

      {profile === 'agent' && (
        <Section title="Sourcing Configuration">
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
            Set your standard flat fee applied to each client deal automatically.
          </p>
          <div style={{ maxWidth: 280 }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Flat Fee per Deal (USD)</label>
            <div style={{ position: 'relative' }}>
              <DollarSign size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input type="number" style={{ ...inputStyle, paddingLeft: 36, fontWeight: 700 }} value={userData.flatFee} onChange={e => setUserData(u => ({ ...u, flatFee: e.target.value }))} min="0" step="10" />
            </div>
          </div>
        </Section>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4 }}>
        <button className="btn btn-ghost">Discard</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </>
  );

  /* ── TAB: Billing ─────────────────────────────────────────────────────────── */
  const renderBilling = () => (
    <>
      <Section title="Payment Methods">
        <div style={{
          padding: '14px 16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--accent-glow)',
          background: 'var(--accent-dim)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 28, background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-primary)' }}>VISA</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Visa ending in 4242</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Expiry 12/28 · Default</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm"><Plus size={12} /> Add</button>
            <ChevronRight size={16} color="var(--text-tertiary)" />
          </div>
        </div>
      </Section>

      <Section title="Invoice History">
        {billingHistory.map((inv, i) => (
          <div key={inv.id} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '11px 0',
            borderBottom: i < billingHistory.length - 1 ? '1px solid var(--border-subtle)' : 'none',
          }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{inv.id}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{inv.date}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{inv.amount}</span>
              <span className="badge badge-success"><span className="dot dot-success" /> {inv.status}</span>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}><ExternalLink size={14} /></button>
            </div>
          </div>
        ))}
      </Section>
    </>
  );

  /* ── TAB: Saved Products ──────────────────────────────────────────────────── */
  const renderSaved = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
      {savedProducts.map(p => (
        <div key={p.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ height: 110, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
            {p.emoji}
          </div>
          <div style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{p.category}</span>
              <button style={{ background: 'none', border: 'none', color: 'var(--negative)', cursor: 'pointer' }}><Trash2 size={13} /></button>
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: 2 }}>{p.name}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: 12 }}>by {p.supplier}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{p.price}</span>
              <button className="btn btn-primary btn-sm">Source Now</button>
            </div>
          </div>
        </div>
      ))}
      <button
        className="card"
        style={{
          minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 8, color: 'var(--text-tertiary)',
          cursor: 'pointer', border: '2px dashed var(--border)', background: 'transparent',
          fontSize: '0.82rem', fontWeight: 600,
        }}
      >
        <Plus size={22} />
        Save New Product
      </button>
    </div>
  );

  /* ── TAB: Notifications ───────────────────────────────────────────────────── */
  const renderNotifications = () => (
    <Section title="Notification Preferences">
      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
        Configure how you receive updates about deals, agents, and shipments.
      </p>
      {[
        { label: 'Deal status updates', desc: 'When a deal moves to a new stage' },
        { label: 'New agent messages', desc: 'Unread messages in your sourcing chats' },
        { label: 'Shipment tracking', desc: 'Real-time updates when goods ship' },
        { label: 'Platform announcements', desc: 'Product updates and policy changes' },
      ].map((n, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < 3 ? '1px solid var(--border-subtle)' : 'none' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{n.label}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: 2 }}>{n.desc}</div>
          </div>
          {/* Simple toggle */}
          <div style={{
            width: 36, height: 20, borderRadius: 10,
            background: i < 3 ? 'var(--accent)' : 'var(--border)',
            position: 'relative', cursor: 'pointer', flexShrink: 0,
          }}>
            <div style={{
              width: 14, height: 14, borderRadius: '50%', background: '#fff',
              position: 'absolute', top: 3,
              left: i < 3 ? 18 : 3,
              transition: 'left 0.2s',
            }} />
          </div>
        </div>
      ))}
    </Section>
  );

  /* ── TABS CONFIG ──────────────────────────────────────────────────────────── */
  const tabs = [
    { id: 'profile',       label: 'My Profile',       icon: User },
    { id: 'billing',       label: 'Billing & Plans',   icon: CreditCard },
    { id: 'saved',         label: 'Saved Products',    icon: Package },
    { id: 'notifications', label: 'Notifications',     icon: Bell },
  ] as const;

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1200 }}>
      <div className="page-header">
        <h1 className="page-title">Account Settings</h1>
        <p className="page-subtitle">Manage your profile, billing, and sourcing preferences.</p>
      </div>

      <div style={{ display: 'flex', gap: 28 }}>
        {/* Side nav */}
        <div style={{ width: 200, flexShrink: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, position: 'sticky', top: 0 }}>
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as SettingTab)}
                className={`nav-link ${activeTab === id ? 'active' : ''}`}
                style={{ width: '100%', textAlign: 'left', borderRadius: 'var(--radius-sm)' }}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
            <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />
            <button className="nav-link" style={{ width: '100%', color: 'var(--negative)', textAlign: 'left', borderRadius: 'var(--radius-sm)' }}>
              <Shield size={14} />
              Privacy & Security
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          {activeTab === 'profile'       && renderProfile()}
          {activeTab === 'billing'       && renderBilling()}
          {activeTab === 'saved'         && renderSaved()}
          {activeTab === 'notifications' && renderNotifications()}
        </div>
      </div>
    </div>
  );
}
