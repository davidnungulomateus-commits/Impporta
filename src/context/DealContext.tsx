'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ProductItem = {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
};

export type DealData = {
  id: string;
  title: string;
  items: ProductItem[];
  status: 'Waiting for Approval' | 'Pending' | 'Accepted' | 'In Progress' | 'Shipped' | 'Rejected';
  currentStep: number;
  createdAt: string;
  receiptUrls?: string[];
  agentFlatFee?: number;
  platformFeePercent?: number;
  agentName?: string;
};

interface DealContextType {
  deals: DealData[];
  addDeal: (deal: Omit<DealData, 'id' | 'createdAt'>) => void;
  updateDeal: (deal: DealData) => void;
  deleteDeal: (id: string) => void;
}

const DealContext = createContext<DealContextType | undefined>(undefined);

export function DealProvider({ children }: { children: ReactNode }) {
  const [deals, setDeals] = useState<DealData[]>([]);

  const addDeal = (deal: Omit<DealData, 'id' | 'createdAt'>) => {
    const newDeal: DealData = {
      ...deal,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toLocaleDateString(),
    };
    setDeals(prev => [newDeal, ...prev]);
  };

  const updateDeal = (deal: DealData) => {
    setDeals(prev => prev.map(d => d.id === deal.id ? deal : d));
  };

  const deleteDeal = (id: string) => {
    setDeals(prev => prev.filter(d => d.id !== id));
  };

  return (
    <DealContext.Provider value={{ deals, addDeal, updateDeal, deleteDeal }}>
      {children}
    </DealContext.Provider>
  );
}

export function useDeals() {
  const context = useContext(DealContext);
  if (context === undefined) {
    throw new Error('useDeals must be used within a DealProvider');
  }
  return context;
}
