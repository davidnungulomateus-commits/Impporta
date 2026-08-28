'use client';

import React, { useEffect } from 'react';
import { Search, MapPin, MessageSquare, TrendingUp, Filter } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/context/ProfileContext';

export default function ExplorePage() {
  const { profile, isExploreVisible, setIsExploreVisible } = useProfile();
  const router = useRouter();

  useEffect(() => {
    if (profile !== 'worker' && !isExploreVisible) {
      router.push('/');
    }
  }, [profile, isExploreVisible, router]);

  if (profile !== 'worker' && !isExploreVisible) {
    return null; // Prevents flashing the page before redirect
  }

  const categories = [
    { name: 'Electronics',   count: '1.2k+', icon: '📱' },
    { name: 'Fashion',       count: '850+',  icon: '👕' },
    { name: 'Home & Garden', count: '600+',  icon: '🏡' },
    { name: 'Industrial',    count: '300+',  icon: '🏗️' },
    { name: 'Beauty',        count: '450+',  icon: '💄' },
    { name: 'Toys',          count: '200+',  icon: '🧸' },
  ];

  const products = [
    { id: 'P1', name: 'Ultra-Quiet Massage Gun',     category: 'Health & Wellness', price: '$14.50', minOrder: '200 units', icon: '💆', trend: '+12% this month' },
    { id: 'P2', name: 'Foldable Solar Charger',      category: 'Electronics',       price: '$22.90', minOrder: '100 units', icon: '☀️', trend: 'Best Seller' },
    { id: 'P3', name: 'Ergonomic Standing Desk',     category: 'Furniture',         price: '$85.00', minOrder: '50 units',  icon: '🪑', trend: 'New Arrival' },
    { id: 'P4', name: 'Smart Garden Kit',            category: 'Home & Garden',     price: '$32.00', minOrder: '150 units', icon: '🌱', trend: '+8% this month' },
    { id: 'P5', name: 'Portable Coffee Grinder',     category: 'Kitchen',           price: '$18.50', minOrder: '300 units', icon: '☕', trend: 'High ROI' },
    { id: 'P6', name: 'Wireless Mechanical Keyboard',category: 'Electronics',       price: '$42.00', minOrder: '100 units', icon: '⌨️', trend: 'Trending' },
  ];

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1400 }}>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Discover Products</h1>
          <p className="page-subtitle">Browse trending sourcing opportunities and find the best manufacturers.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
          {/* Worker visibility toggle */}
          {profile === 'worker' && (
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 16px' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>Public Visibility</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Show to clients & agents</div>
              </div>
              <button
                onClick={() => setIsExploreVisible(!isExploreVisible)}
                style={{
                  width: 40, height: 22, borderRadius: 11,
                  background: isExploreVisible ? 'var(--accent)' : 'var(--border)',
                  border: 'none', position: 'relative', cursor: 'pointer',
                  transition: 'background 0.2s', flexShrink: 0,
                }}
              >
                <div style={{
                  width: 16, height: 16, borderRadius: '50%', background: '#fff',
                  position: 'absolute', top: 3,
                  left: isExploreVisible ? 21 : 3,
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
                }} />
              </button>
            </div>
          )}
          {/* Search */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', width: 340 }}>
            <Search size={14} color="var(--text-tertiary)" />
            <input
              type="text"
              placeholder="Search products or categories…"
              style={{ flex: 1, border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '0.82rem' }}
            />
            <button className="btn btn-ghost btn-sm"><Filter size={13} /></button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="section-header">
        <span className="section-title">Trending Categories</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }}>View all</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginBottom: 28 }}>
        {categories.map(cat => (
          <div key={cat.name} className="card" style={{ textAlign: 'center', cursor: 'pointer', padding: '16px 12px' }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>{cat.icon}</div>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 2 }}>{cat.name}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{cat.count} listings</div>
          </div>
        ))}
      </div>

      {/* Products */}
      <div className="section-header">
        <span className="section-title">Top Sourcing Opportunities</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 14, marginBottom: 28 }}>
        {products.map(product => (
          <div key={product.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Visual */}
            <div style={{
              height: 160, background: 'var(--bg-elevated)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '4rem', position: 'relative',
            }}>
              <span className="badge badge-info" style={{ position: 'absolute', top: 12, right: 12, fontSize: '0.65rem' }}>
                {product.trend}
              </span>
              {product.icon}
            </div>
            {/* Info */}
            <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                  {product.category}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{product.name}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div className="card" style={{ padding: '8px 10px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Price</div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', marginTop: 2 }}>{product.price}</div>
                </div>
                <div className="card" style={{ padding: '8px 10px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>MOQ</div>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', marginTop: 2 }}>{product.minOrder}</div>
                </div>
              </div>
              <Link href={`/chat?worker=true&productId=${product.id}`} style={{ marginTop: 'auto' }}>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  <MessageSquare size={13} /> Start Sourcing
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Request CTA */}
      <div className="card card-accent" style={{ textAlign: 'center', padding: '40px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, opacity: 0.05 }}>
          <TrendingUp size={200} />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: '1.15rem', marginBottom: 8 }}>Don't see what you're looking for?</div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 20, maxWidth: 480, margin: '0 auto 20px' }}>
            Tell our platform specialists your exact requirements and we'll find and vet the perfect manufacturer for you.
          </p>
          <Link href="/chat?worker=true">
            <button className="btn btn-primary">
              <MapPin size={14} /> Request Custom Sourcing
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
