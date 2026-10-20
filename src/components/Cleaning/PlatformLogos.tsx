import React from 'react';

export interface PlatformLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

export function AirbnbLogo({ size = 'md', showName = true }: PlatformLogoProps) {
  const iconH = size === 'sm' ? 14 : size === 'lg' ? 22 : 17;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', userSelect: 'none' }}>
      <svg
        height={iconH}
        viewBox="0 0 32 32"
        fill="#FF385C"
        style={{ flexShrink: 0 }}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533.992c2.146 4.093 4.148 8.423 5.753 12.384.808 1.992 1.348 3.731 1.621 5.215.352 1.912-.047 3.593-1.188 4.965-1.242 1.493-2.99 2.175-5.055 1.972-2.193-.215-4.143-1.637-6.415-4.159-2.272 2.522-4.222 3.944-6.415 4.159-2.065.203-3.813-.479-5.055-1.972-1.141-1.372-1.54-3.053-1.188-4.965.273-1.484.813-3.223 1.621-5.215 1.605-3.961 3.607-8.291 5.753-12.384l.533-.992C12.537 1.963 13.992 1 16 1zm0 3c-1.042 0-1.892.518-2.85 2.191l-.478.891c-1.956 3.731-3.872 7.842-5.419 11.66-.723 1.782-1.205 3.32-1.442 4.606-.245 1.328-.014 2.378.718 3.259.789.948 1.927 1.372 3.313 1.236 1.696-.166 3.376-1.474 5.372-3.884l.786-.967.786.967c1.996 2.41 3.676 3.718 5.372 3.884 1.386.136 2.524-.288 3.313-1.236.732-.881.963-1.931.718-3.259-.237-1.286-.719-2.824-1.442-4.606-1.547-3.818-3.463-7.929-5.419-11.66l-.478-.891C17.892 4.518 17.042 4 16 4zm0 8c2.209 0 4 1.791 4 4 0 2.21-1.791 4.5-4 7-2.209-2.5-4-4.79-4-7 0-2.209 1.791-4 4-4zm0 2c-1.105 0-2 .895-2 2 0 1.246 1.054 2.873 2 4.12.946-1.247 2-2.874 2-4.12 0-1.105-.895-2-2-2z" />
      </svg>
      {showName && (
        <span style={{ fontWeight: 800, fontSize: size === 'sm' ? '0.78rem' : '0.88rem', color: '#111625', letterSpacing: '-0.02em' }}>
          airbnb
        </span>
      )}
    </div>
  );
}

export function BookingLogo({ size = 'md', showName = true }: PlatformLogoProps) {
  const iconH = size === 'sm' ? 14 : size === 'lg' ? 22 : 17;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', userSelect: 'none' }}>
      <div
        style={{
          width: `${iconH + 2}px`,
          height: `${iconH + 2}px`,
          borderRadius: '4px',
          background: '#003580',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 900,
          fontSize: size === 'sm' ? '0.65rem' : '0.78rem',
          flexShrink: 0,
          lineHeight: 1
        }}
      >
        B.
      </div>
      {showName && (
        <span style={{ fontWeight: 800, fontSize: size === 'sm' ? '0.78rem' : '0.88rem', color: '#003580', letterSpacing: '-0.01em' }}>
          Booking<span style={{ color: '#00BAFE' }}>.com</span>
        </span>
      )}
    </div>
  );
}

export function VrboLogo({ size = 'md', showName = true }: PlatformLogoProps) {
  const iconH = size === 'sm' ? 14 : size === 'lg' ? 22 : 17;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', userSelect: 'none' }}>
      <svg
        height={iconH}
        viewBox="0 0 24 24"
        fill="#00256C"
        style={{ flexShrink: 0 }}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zm0 8.5L4.5 7 12 3.25 19.5 7 12 10.5zm-8 4l8 4 8-4v2.5l-8 4-8-4v-2.5z" />
      </svg>
      {showName && (
        <span style={{ fontWeight: 900, fontSize: size === 'sm' ? '0.82rem' : '0.92rem', color: '#00256C', letterSpacing: '-0.04em', fontStyle: 'italic' }}>
          vrbo
        </span>
      )}
    </div>
  );
}

export function HostkitLogo({ size = 'md', showName = true }: PlatformLogoProps) {
  const iconH = size === 'sm' ? 14 : size === 'lg' ? 22 : 17;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', userSelect: 'none' }}>
      <div
        style={{
          width: `${iconH + 2}px`,
          height: `${iconH + 2}px`,
          borderRadius: '5px',
          background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 900,
          fontSize: size === 'sm' ? '0.65rem' : '0.78rem',
          flexShrink: 0
        }}
      >
        H
      </div>
      {showName && (
        <span style={{ fontWeight: 800, fontSize: size === 'sm' ? '0.78rem' : '0.88rem', color: '#0369a1', letterSpacing: '-0.02em' }}>
          hostkit
        </span>
      )}
    </div>
  );
}

export function HostifyLogo({ size = 'md', showName = true }: PlatformLogoProps) {
  const iconH = size === 'sm' ? 14 : size === 'lg' ? 22 : 17;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', userSelect: 'none' }}>
      <div
        style={{
          width: `${iconH + 2}px`,
          height: `${iconH + 2}px`,
          borderRadius: '5px',
          background: '#4f46e5',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: size === 'sm' ? '0.65rem' : '0.78rem',
          flexShrink: 0
        }}
      >
        h
      </div>
      {showName && (
        <span style={{ fontWeight: 800, fontSize: size === 'sm' ? '0.78rem' : '0.88rem', color: '#4338ca', letterSpacing: '-0.01em' }}>
          hostify
        </span>
      )}
    </div>
  );
}

export function TalkguestLogo({ size = 'md', showName = true }: PlatformLogoProps) {
  const iconH = size === 'sm' ? 14 : size === 'lg' ? 22 : 17;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', userSelect: 'none' }}>
      <svg
        height={iconH}
        viewBox="0 0 24 24"
        fill="none"
        style={{ flexShrink: 0 }}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="24" height="24" rx="6" fill="#f97316" />
        <path d="M6 8h12M6 12h8M6 16h5" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      {showName && (
        <span style={{ fontWeight: 800, fontSize: size === 'sm' ? '0.78rem' : '0.88rem', color: '#0f172a', letterSpacing: '-0.01em' }}>
          Talk<span style={{ color: '#ea580c' }}>Guest</span>
        </span>
      )}
    </div>
  );
}

export function GuestyLogo({ size = 'md', showName = true }: PlatformLogoProps) {
  const iconH = size === 'sm' ? 14 : size === 'lg' ? 22 : 17;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', userSelect: 'none' }}>
      <div
        style={{
          width: `${iconH + 2}px`,
          height: `${iconH + 2}px`,
          borderRadius: '50%',
          background: '#FF5B37',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 900,
          fontSize: size === 'sm' ? '0.65rem' : '0.78rem',
          flexShrink: 0
        }}
      >
        g
      </div>
      {showName && (
        <span style={{ fontWeight: 800, fontSize: size === 'sm' ? '0.78rem' : '0.88rem', color: '#1e293b', letterSpacing: '-0.02em' }}>
          guesty
        </span>
      )}
    </div>
  );
}

export function LodgifyLogo({ size = 'md', showName = true }: PlatformLogoProps) {
  const iconH = size === 'sm' ? 14 : size === 'lg' ? 22 : 17;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', userSelect: 'none' }}>
      <svg
        height={iconH}
        viewBox="0 0 24 24"
        fill="#0052FF"
        style={{ flexShrink: 0 }}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M12 2L2 9.5l2.5 1.9L12 5.8l7.5 5.6 2.5-1.9L12 2zm-7 9.5v8.5a2 2 0 002 2h10a2 2 0 002-2v-8.5l-7-5.2-7 5.2z" />
      </svg>
      {showName && (
        <span style={{ fontWeight: 800, fontSize: size === 'sm' ? '0.78rem' : '0.88rem', color: '#0052FF', letterSpacing: '-0.01em' }}>
          lodgify
        </span>
      )}
    </div>
  );
}

export interface PlatformItem {
  id: string;
  name: string;
  component: React.FC<PlatformLogoProps>;
}

export const PLATFORM_LOGOS: PlatformItem[] = [
  { id: 'airbnb', name: 'Airbnb', component: AirbnbLogo },
  { id: 'booking', name: 'Booking.com', component: BookingLogo },
  { id: 'vrbo', name: 'Vrbo', component: VrboLogo },
  { id: 'hostkit', name: 'Hostkit', component: HostkitLogo },
  { id: 'hostify', name: 'Hostify', component: HostifyLogo },
  { id: 'talkguest', name: 'Talkguest', component: TalkguestLogo },
  { id: 'guesty', name: 'Guesty', component: GuestyLogo },
  { id: 'lodgify', name: 'Lodgify', component: LodgifyLogo }
];
