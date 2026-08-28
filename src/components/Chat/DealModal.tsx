'use client';

import React, { useState } from 'react';
import { DealData, ProductItem } from '@/context/DealContext';
import { 
  X, 
  Package, 
  DollarSign, 
  Layers, 
  Calculator,
  ArrowRight,
  ShieldCheck,
  User,
  CheckCircle2,
  FileUp,
  Plus,
  Trash2
} from 'lucide-react';

type DealModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'agent' | 'client' | 'worker';
  onCreateDeal: (deal: DealData) => void;
  onDelete?: (id: string) => void;
  initialDeal?: DealData;
};

export default function DealModal({ isOpen, onClose, userRole, onCreateDeal, onDelete, initialDeal }: DealModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'contract' | 'payment' | 'lifecycle'>(
    initialDeal && (initialDeal.status === 'Accepted' || initialDeal.status === 'In Progress' || initialDeal.status === 'Shipped') ? 'lifecycle' : 'contract'
  );
  const [dealData, setDealData] = useState<DealData & { agentName: string; agentFlatFee: number; platformFeePercent: number }>(() => {
    if (initialDeal) {
      return {
        ...initialDeal,
        agentName: 'Sourcing Agent John',
        agentFlatFee: 500,
        platformFeePercent: 3
      };
    }
    return {
      id: '',
      title: 'Electronics Sourcing Order',
      items: [
        { id: Math.random().toString(), name: 'Wireless Earbuds Pro', unitPrice: 15.00, quantity: 500 }
      ],
      status: 'Pending',
      currentStep: 1,
      createdAt: new Date().toLocaleDateString(),
      agentName: 'Sourcing Agent John',
      agentFlatFee: 500,
      platformFeePercent: 3
    };
  });

  // Update view if initialDeal changes
  React.useEffect(() => {
    if (initialDeal) {
      if (initialDeal.status === 'Accepted' || initialDeal.status === 'In Progress' || initialDeal.status === 'Shipped') {
        setView('lifecycle');
      } else {
        setView('contract');
      }
      setDealData({
        ...initialDeal,
        agentName: 'Sourcing Agent John',
        agentFlatFee: initialDeal.agentFlatFee || 500,
        platformFeePercent: 3
      });
    } else {
      setView('contract');
      setDealData({
        id: '',
        title: 'Electronics Sourcing Order',
        items: [{ id: Math.random().toString(), name: 'Wireless Earbuds Pro', unitPrice: 15.00, quantity: 500 }],
        status: 'Pending',
        currentStep: 1,
        createdAt: new Date().toLocaleDateString(),
        agentName: 'Sourcing Agent John',
        agentFlatFee: 500,
        platformFeePercent: 3
      });
    }
    setError(null);
  }, [initialDeal, isOpen]);

  if (!isOpen) return null;

  const subtotal = dealData.items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const totalItemsCount = dealData.items.reduce((acc, item) => acc + item.quantity, 0);
  const agentFee = dealData.agentFlatFee;
  const platformFee = (subtotal * dealData.platformFeePercent) / 100;
  const total = subtotal + agentFee + platformFee;

  const handleSubmit = () => {
    setError(null);
    if (userRole === 'client') {
      setView('payment');
    } else if (userRole === 'worker') {
      onCreateDeal({ ...dealData, status: 'Pending' });
      onClose();
    } else {
      if (!dealData.receiptUrls || dealData.receiptUrls.length === 0) {
        setError("Please upload at least one receipt before submitting.");
        return;
      }
      if (dealData.items.length === 0) {
        setError("You must add at least one product item.");
        return;
      }
      onCreateDeal({ ...dealData, status: 'Waiting for Approval' });
      onClose();
    }
  };

  const handleReject = () => {
    if (userRole === 'worker') {
      onCreateDeal({ ...dealData, status: 'Rejected' });
      onClose();
    }
  };

  const handlePaymentComplete = () => {
    onCreateDeal({ ...dealData, status: 'Accepted', currentStep: 1 });
    setView('lifecycle');
  };

  const advanceStep = () => {
    if (dealData.currentStep < 5) {
      const nextStep = dealData.currentStep + 1;
      const newStatus = nextStep === 5 ? 'Shipped' : 'In Progress';
      const updatedDeal = { ...dealData, currentStep: nextStep, status: newStatus as any };
      setDealData(updatedDeal);
      onCreateDeal(updatedDeal); // Sync back to ChatBox
    }
  };

  const addItem = () => {
    setDealData({
      ...dealData,
      items: [...dealData.items, { id: Math.random().toString(), name: '', unitPrice: 0, quantity: 1 }]
    });
  };

  const updateItem = (id: string, field: keyof ProductItem, value: any) => {
    setDealData({
      ...dealData,
      items: dealData.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    });
  };

  const removeItem = (id: string) => {
    setDealData({
      ...dealData,
      items: dealData.items.filter(item => item.id !== id)
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 35, 24, 0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--surface)',
        width: '100%',
        maxWidth: view === 'contract' ? '600px' : '440px',
        borderRadius: '28px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid var(--border)',
        animation: 'modalPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transition: 'max-width 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh'
      }}>
        {view === 'contract' ? (
          <>
            {/* Modal Header */}
            <div style={{ 
              padding: '24px 32px', 
              borderBottom: '1px solid var(--border)', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              backgroundColor: 'var(--background)',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  backgroundColor: 'var(--primary)', 
                  color: 'white', 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ShieldCheck size={18} />
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  {userRole === 'agent' ? 'Create New Contract' : userRole === 'worker' ? 'Approve Contract' : 'Review Contract'}
                </h2>
              </div>
              <button onClick={onClose} style={{ color: 'var(--text-secondary)', padding: '4px', cursor: 'pointer', background: 'none', border: 'none' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Agent Info */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '16px', 
                  backgroundColor: 'var(--background)', 
                  borderRadius: '16px',
                  border: '1px solid var(--border)'
                }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--tertiary)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'var(--neutral)'
                  }}>
                    <User size={20} />
                  </div>
                  <div className="flex-col">
                    <span className="text-small" style={{ fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sourcing Professional</span>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{dealData.agentName}</span>
                  </div>
                </div>

                {/* Contract Title */}
                <div className="flex-col gap-2">
                  <label className="text-small" style={{ fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Package size={14} /> CONTRACT TITLE
                  </label>
                  {userRole === 'agent' ? (
                    <input 
                      type="text" 
                      placeholder="e.g. Q3 Electronics Sourcing"
                      value={dealData.title}
                      onChange={e => setDealData({...dealData, title: e.target.value})}
                      style={{ 
                        padding: '14px 16px', 
                        borderRadius: '12px', 
                        border: '1px solid var(--border)', 
                        fontFamily: 'inherit', 
                        fontSize: '1rem',
                        backgroundColor: 'var(--background)'
                      }}
                    />
                  ) : (
                    <div style={{ padding: '14px 16px', borderRadius: '12px', backgroundColor: 'var(--background)', fontWeight: 600 }}>
                      {dealData.title}
                    </div>
                  )}
                </div>

                {/* Items List */}
                <div className="flex-col gap-3">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="text-small" style={{ fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Layers size={14} /> PRODUCT ITEMS
                    </label>
                    {userRole === 'agent' && (
                      <button 
                        onClick={addItem}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px', 
                          padding: '6px 12px', 
                          borderRadius: '8px', 
                          backgroundColor: 'var(--tertiary)', 
                          color: 'var(--neutral)', 
                          fontSize: '0.75rem', 
                          fontWeight: 700, 
                          border: 'none', 
                          cursor: 'pointer' 
                        }}
                      >
                        <Plus size={14} strokeWidth={3} />
                        Add Item
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {dealData.items.map((item, index) => (
                      <div key={item.id} style={{ 
                        display: 'flex', 
                        gap: '12px', 
                        padding: '16px', 
                        backgroundColor: 'var(--background)', 
                        borderRadius: '12px', 
                        border: '1px solid var(--border)',
                        alignItems: 'flex-start'
                      }}>
                        {userRole === 'agent' ? (
                          <>
                            <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <input 
                                type="text" 
                                placeholder="Product Name"
                                value={item.name}
                                onChange={e => updateItem(item.id, 'name', e.target.value)}
                                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.9rem' }}
                              />
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>$</span>
                                <input 
                                  type="number" 
                                  placeholder="Price"
                                  value={item.unitPrice}
                                  onChange={e => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                  style={{ width: '100%', padding: '10px 12px 10px 24px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.9rem' }}
                                />
                              </div>
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <input 
                                type="number" 
                                placeholder="Qty"
                                value={item.quantity}
                                onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.9rem' }}
                              />
                            </div>
                            <button 
                              onClick={() => removeItem(item.id)}
                              style={{ padding: '10px', color: '#EF4444', backgroundColor: '#FEF2F2', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        ) : (
                          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.name || 'Unnamed Product'}</span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{item.quantity} Units @ ${item.unitPrice.toFixed(2)}</span>
                            </div>
                            <span style={{ fontWeight: 800, color: 'var(--primary)' }}>
                              ${(item.unitPrice * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                    {dealData.items.length === 0 && (
                      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', backgroundColor: 'var(--background)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
                        No items added to this contract yet.
                      </div>
                    )}
                  </div>
                </div>

                {/* Receipt Upload (Agent Only) */}
                {userRole === 'agent' && (
                  <div className="flex-col gap-2">
                    <label className="text-small" style={{ fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileUp size={14} /> OFFICIAL RECEIPT / INVOICE
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="file" 
                        accept="image/*,.pdf"
                        multiple
                        onChange={e => {
                          const files = e.target.files;
                          if (files && files.length > 0) {
                            const newUrls = Array.from(files).map(file => URL.createObjectURL(file));
                            setDealData({...dealData, receiptUrls: [...(dealData.receiptUrls || []), ...newUrls]});
                          }
                        }}
                        style={{ display: 'none' }}
                        id="receipt-upload"
                      />
                      <label 
                        htmlFor="receipt-upload"
                        style={{ 
                          padding: '16px', 
                          borderRadius: '12px', 
                          border: '2px dashed var(--border)', 
                          backgroundColor: 'var(--background)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          fontWeight: 600,
                          color: 'var(--text-secondary)'
                        }}
                      >
                        <FileUp size={18} />
                        Click to Upload Receipts (Multiple Allowed)
                      </label>
                      
                      {dealData.receiptUrls && dealData.receiptUrls.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px', marginTop: '12px' }}>
                          {dealData.receiptUrls.map((url, idx) => (
                            <div key={idx} style={{ position: 'relative', width: '100%', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                              <img src={url} alt="Receipt" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  setDealData({
                                    ...dealData, 
                                    receiptUrls: dealData.receiptUrls!.filter((_, i) => i !== idx)
                                  });
                                }}
                                style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* View Receipt (Worker Only) */}
                {userRole === 'worker' && dealData.receiptUrls && dealData.receiptUrls.length > 0 && (
                  <div className="flex-col gap-2">
                    <label className="text-small" style={{ fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileUp size={14} /> SUBMITTED RECEIPTS ({dealData.receiptUrls.length})
                    </label>
                    <div style={{ 
                      padding: '16px', 
                      borderRadius: '16px', 
                      backgroundColor: 'var(--background)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        {dealData.receiptUrls.map((url, idx) => (
                           <div key={idx} style={{ 
                             width: '100%', 
                             height: '140px', 
                             borderRadius: '8px', 
                             overflow: 'hidden',
                             backgroundColor: '#f8fafc',
                             display: 'flex',
                             flexDirection: 'column',
                             border: '1px solid var(--border)',
                             position: 'relative'
                           }}>
                             <a href={url} target="_blank" rel="noreferrer" style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'var(--primary)', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Open</a>
                             <img 
                               src={url} 
                               alt={`Receipt ${idx + 1}`} 
                               style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                               onError={(e) => {
                                 e.currentTarget.style.display = 'none';
                               }}
                             />
                           </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Fee Breakdown */}
                <div style={{ 
                  marginTop: '8px',
                  padding: '24px', 
                  borderRadius: '20px', 
                  backgroundColor: 'var(--background)', 
                  border: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Items Subtotal ({totalItemsCount} units)</span>
                    <span style={{ fontWeight: 600 }}>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="flex-row gap-2" style={{ alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Agent Flat Fee</span>
                    </div>
                    {userRole === 'agent' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>$</span>
                        <input 
                          type="number" 
                          value={dealData.agentFlatFee}
                          onChange={(e) => setDealData({ ...dealData, agentFlatFee: parseFloat(e.target.value) || 0 })}
                          style={{ 
                            width: '80px', 
                            padding: '6px 12px', 
                            borderRadius: '8px', 
                            border: '1px solid var(--border)', 
                            fontWeight: 600, 
                            fontSize: '0.95rem',
                            textAlign: 'right'
                          }} 
                        />
                      </div>
                    ) : (
                      <span style={{ fontWeight: 600 }}>${agentFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="flex-row gap-2">
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Platform Protection Fee</span>
                      <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--secondary)', color: 'var(--primary)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>{dealData.platformFeePercent}%</span>
                    </div>
                    <span style={{ fontWeight: 600 }}>${platformFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  
                  <div style={{ 
                    marginTop: '8px',
                    paddingTop: '16px',
                    borderTop: '2px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div className="flex-col">
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Amount</span>
                      <span className="text-small" style={{ fontSize: '0.7rem' }}>Securely held in escrow</span>
                    </div>
                    <span style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-0.5px' }}>
                      ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div style={{ 
                padding: '16px 32px', 
                color: '#EF4444', 
                backgroundColor: '#FEF2F2', 
                borderTop: '1px solid #FEE2E2',
                fontWeight: 700, 
                fontSize: '0.9rem', 
                textAlign: 'center',
                flexShrink: 0
              }}>
                {error}
              </div>
            )}

            <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border)', display: 'flex', gap: '12px', backgroundColor: 'var(--surface)', flexShrink: 0 }}>
              {userRole === 'worker' ? (
                <>
                  <button 
                    onClick={handleReject} 
                    style={{ 
                      flex: 1, 
                      padding: '16px', 
                      borderRadius: '14px', 
                      fontWeight: 700, 
                      backgroundColor: '#FEF2F2',
                      border: '1px solid #FEE2E2',
                      color: '#EF4444',
                      cursor: 'pointer'
                    }}
                  >
                    Reject Contract
                  </button>
                  <button 
                    onClick={handleSubmit} 
                    style={{ 
                      flex: 1.5, 
                      padding: '16px', 
                      borderRadius: '14px', 
                      fontWeight: 700, 
                      backgroundColor: 'var(--primary)', 
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 10px 20px -5px rgba(29, 158, 117, 0.4)',
                      cursor: 'pointer'
                    }}
                  >
                    Approve & Send
                    <ArrowRight size={18} />
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={onClose} 
                    style={{ 
                      flex: 1, 
                      padding: '16px', 
                      borderRadius: '14px', 
                      fontWeight: 600, 
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer'
                    }}
                  >
                    Close
                  </button>
                  <button 
                    onClick={handleSubmit} 
                    style={{ 
                      flex: 2, 
                      padding: '16px', 
                      borderRadius: '14px', 
                      fontWeight: 700, 
                      backgroundColor: 'var(--primary)', 
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 10px 20px -5px rgba(29, 158, 117, 0.4)',
                      cursor: 'pointer'
                    }}
                  >
                    {userRole === 'agent' ? 'Submit for Approval' : 'Accept & Pay Order'}
                    <ArrowRight size={18} />
                  </button>
                </>
              )}
            </div>
          </>
        ) : view === 'lifecycle' ? (
          <div style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div className="flex-col">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Order Status</h2>
                <span className="text-small" style={{ color: 'var(--text-secondary)' }}>{dealData.title} • {totalItemsCount} Units Total</span>
              </div>
              <button onClick={onClose} style={{ color: 'var(--text-secondary)', padding: '4px', cursor: 'pointer', background: 'none', border: 'none' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative' }}>
              {[
                { step: 1, title: 'Payment Confirmed', desc: 'Funds successfully processed and held in escrow.' },
                { step: 2, title: 'Agent Received', desc: 'Agent has verified the transaction details.' },
                { step: 3, title: 'Supplier Received', desc: 'Funds released to the supplier for fulfillment.' },
                { step: 4, title: 'Preparation', desc: 'Items are being packed and inspected.' },
                { step: 5, title: 'Product Shipped', desc: 'Tracking details provided. Order in transit.' }
              ].map((item, idx, arr) => {
                const isCompleted = dealData.currentStep > item.step;
                const isCurrent = dealData.currentStep === item.step;
                const isPending = dealData.currentStep < item.step;

                return (
                  <div key={item.step} style={{ display: 'flex', gap: '24px', minHeight: '85px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ 
                        width: '36px', 
                        height: '36px', 
                        borderRadius: '50%', 
                        backgroundColor: isCompleted ? 'var(--primary)' : (isCurrent ? 'var(--surface)' : 'var(--background)'),
                        border: isCurrent ? '2px solid var(--primary)' : (isPending ? '1px solid var(--border)' : 'none'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isCompleted ? 'white' : (isCurrent ? 'var(--primary)' : 'var(--text-secondary)'),
                        zIndex: 2,
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isCurrent ? '0 0 0 4px var(--secondary)' : 'none'
                      }}>
                        {isCompleted ? <CheckCircle2 size={20} /> : <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{item.step}</span>}
                      </div>
                      {idx !== arr.length - 1 && (
                        <div style={{ 
                          width: '2px', 
                          flex: 1, 
                          backgroundColor: isCompleted ? 'var(--primary)' : 'var(--border)',
                          margin: '6px 0',
                          transition: 'background-color 0.4s ease'
                        }}></div>
                      )}
                    </div>
                    <div style={{ paddingTop: '6px', paddingBottom: '24px' }}>
                      <h4 style={{ 
                        margin: 0, 
                        fontSize: '1rem', 
                        fontWeight: 700, 
                        color: isPending ? 'var(--text-secondary)' : 'var(--text-primary)',
                        transition: 'color 0.3s ease'
                      }}>
                        {item.title}
                      </h4>
                      <p style={{ 
                        margin: '6px 0 0 0', 
                        fontSize: '0.85rem', 
                        color: 'var(--text-secondary)',
                        lineHeight: '1.5',
                        maxWidth: '280px'
                      }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* View Receipt (Worker Only) in Lifecycle view */}
            {userRole === 'worker' && dealData.receiptUrls && dealData.receiptUrls.length > 0 && (
              <div className="flex-col gap-2" style={{ marginTop: '24px' }}>
                <label className="text-small" style={{ fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileUp size={14} /> APPROVED RECEIPTS ({dealData.receiptUrls.length})
                </label>
                <div style={{ 
                  padding: '16px', 
                  borderRadius: '16px', 
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {dealData.receiptUrls.map((url, idx) => (
                       <div key={idx} style={{ 
                         width: '100%', 
                         height: '140px', 
                         borderRadius: '8px', 
                         overflow: 'hidden',
                         backgroundColor: '#f8fafc',
                         display: 'flex',
                         flexDirection: 'column',
                         border: '1px solid var(--border)',
                         position: 'relative'
                       }}>
                         <a href={url} target="_blank" rel="noreferrer" style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'var(--primary)', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Open</a>
                         <img 
                           src={url} 
                           alt={`Receipt ${idx + 1}`} 
                           style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                           onError={(e) => {
                             e.currentTarget.style.display = 'none';
                           }}
                         />
                       </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
              <button 
                onClick={onClose} 
                style={{ 
                  flex: 1, 
                  padding: '16px', 
                  borderRadius: '16px', 
                  fontWeight: 600, 
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
              {userRole === 'agent' && dealData.currentStep < 5 && (
                <button 
                  onClick={advanceStep} 
                  style={{ 
                    flex: 2, 
                    padding: '16px', 
                    borderRadius: '16px', 
                    fontWeight: 700, 
                    backgroundColor: 'var(--primary)', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 10px 20px -5px rgba(29, 158, 117, 0.4)'
                  }}
                >
                  Advance Status <ArrowRight size={18} />
                </button>
              )}
              {dealData.currentStep < 2 && onDelete && (
                <button 
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this deal?')) {
                      onDelete(dealData.id);
                      onClose();
                    }
                  }}
                  style={{ 
                    flex: 1, 
                    padding: '16px', 
                    borderRadius: '16px', 
                    fontWeight: 700, 
                    backgroundColor: '#FEF2F2', 
                    color: '#EF4444',
                    border: '1px solid #FEE2E2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Delete Deal
                </button>
              )}
            </div>
          </div>
        ) : (
          <div style={{ 
            padding: '48px 32px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            textAlign: 'center',
            backgroundColor: 'var(--bg-surface)'
          }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              backgroundColor: '#ECFDF5', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#10B981',
              marginBottom: '24px'
            }}>
              <CheckCircle2 size={40} strokeWidth={2.5} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--neutral)', marginBottom: '8px' }}>
              Payment Workflow
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '280px', lineHeight: '1.6' }}>
              Your order is being processed. You will be notified once the transaction is complete.
            </p>
            <button 
              onClick={handlePaymentComplete}
              style={{
                marginTop: '32px',
                padding: '14px 28px',
                borderRadius: '12px',
                backgroundColor: 'var(--neutral)',
                color: 'white',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                width: '100%',
                justifyContent: 'center'
              }}
            >
              Finish Process <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}



