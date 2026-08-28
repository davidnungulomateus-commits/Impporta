import React from 'react';

export function Logo({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="10 20 80 90" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      {/* BOTTOM CONTAINER */}
      {/* Left Face (Door) */}
      <path d="M 20 90 L 40 100 L 40 80 L 20 70 Z" fill="currentColor" fillOpacity="0.1" />
      {/* Right Face (Side) */}
      <path d="M 40 100 L 80 80 L 80 60 L 40 80 Z" fill="currentColor" fillOpacity="0.05" />
      {/* Top Face */}
      <path d="M 40 80 L 80 60 L 60 50 L 20 70 Z" fill="currentColor" fillOpacity="0.2" />

      {/* TOP CONTAINER */}
      {/* Left Face (Door) */}
      <path d="M 20 70 L 40 80 L 40 60 L 20 50 Z" fill="currentColor" fillOpacity="0.15" />
      {/* Right Face (Side) */}
      <path d="M 40 80 L 80 60 L 80 40 L 40 60 Z" fill="currentColor" fillOpacity="0.1" />
      {/* Top Face */}
      <path d="M 40 60 L 80 40 L 60 30 L 20 50 Z" fill="currentColor" fillOpacity="0.25" />

      {/* DETAILS: Corrugated Lines (Bottom Right Face) */}
      <path d="M 53.3 93.3 L 53.3 73.3" />
      <path d="M 66.6 86.6 L 66.6 66.6" />

      {/* DETAILS: Corrugated Lines (Top Right Face) */}
      <path d="M 53.3 73.3 L 53.3 53.3" />
      <path d="M 66.6 66.6 L 66.6 46.6" />

      {/* DETAILS: Door Splits (Left Faces) */}
      <path d="M 30 95 L 30 75" />
      <path d="M 30 75 L 30 55" />
      
      {/* DETAILS: Corner Castings (Little boxes on corners) */}
      {/* Top Container Corners */}
      <path d="M 38 61 L 42 61" strokeWidth="6" />
      <path d="M 18 51 L 22 51" strokeWidth="6" />
      <path d="M 78 41 L 82 41" strokeWidth="6" />
      <path d="M 38 80 L 42 80" strokeWidth="6" />
    </svg>
  );
}
