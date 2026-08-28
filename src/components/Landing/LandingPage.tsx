'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Camera,
  AlertTriangle,
  Sparkles,
  Calendar,
  Send,
  MessageSquare,
  ArrowRight,
  Star,
  Layers,
  ChevronRight,
  Shield,
  HelpCircle,
  Zap,
  Coffee,
  Check,
  Smartphone,
  MapPin,
  Flame,
  KeyRound,
  FileCheck
} from 'lucide-react';

export default function LandingPage() {
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    units: '1 unit',
    neighborhood: 'Baixa / Chiado',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const neighborhoods = [
    'Baixa / Chiado',
    'Alfama / Castelo',
    'Bairro Alto / Misericórdia',
    'Príncipe Real',
    'Arroios / Anjos',
    'Campo de Ourique / Estrela',
    'Avenidas Novas / Saldanha',
    'Santos / Alcântara',
    'Belém / Ajuda',
    'Parque das Nações',
    'Other in Greater Lisbon',
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setFormSubmitted(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Olá! Gostaria de experimentar a primeira limpeza gratuita para o meu Alojamento Local (${formData.units}) em ${formData.neighborhood}.`
  );
  const whatsappUrl = `https://wa.me/351910000000?text=${whatsappMessage}`;

  const scrollToForm = () => {
    const el = document.getElementById('claim-trial');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Slider interaction
  const handleSliderMove = (clientX: number, rect: DOMRect) => {
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percent);
  };

  return (
    <div className="landing-root">
      {/* ── Sticky Announcement / Quick Access Top Bar ─────────────────── */}
      <header className="landing-header">
        <div className="landing-header-container">
          <div className="landing-brand">
            <div className="brand-badge-icon">
              <Sparkles size={18} />
            </div>
            <div className="brand-text-group">
              <span className="brand-name">Impporta AL</span>
              <span className="brand-sub">Lisbon STR Cleaning</span>
            </div>
          </div>

          <nav className="landing-nav">
            <a href="#pain-points" className="nav-item">Why Us</a>
            <a href="#what-is-included" className="nav-item">Inclusions</a>
            <a href="#pricing" className="nav-item">Pricing</a>
            <a href="#how-it-works" className="nav-item">How It Works</a>
            <a href="#faq" className="nav-item">FAQ</a>
          </nav>

          <div className="landing-header-actions">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp-sm"
              title="Chat directly on WhatsApp"
            >
              <MessageSquare size={15} />
              <span className="hidden-mobile">WhatsApp</span>
            </a>
            <button onClick={scrollToForm} className="btn-trial-nav">
              First Clean Free
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Section ────────────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-glow-blob" />
        <div className="hero-container">
          {/* Target Audience Badge */}
          <div className="hero-pill animate-fade-in">
            <span className="pill-dot" />
            <span className="pill-text">Engineered for 1–5 Unit Airbnb & AL Hosts in Lisbon</span>
          </div>

          {/* Core Pain-Driven Headline */}
          <h1 className="hero-headline">
            Your next 1-star review <br />
            <span className="hero-gradient-text">starts in the bathroom.</span>
          </h1>

          <p className="hero-subheadline">
            A dirty turnover doesn&apos;t just lose one guest — it loses the next ten. 
            We protect your AL revenue with 100% photo-verified, hotel-standard turnovers 
            guaranteed ready before your 3:00 PM check-in.
          </p>

          {/* Hero CTAs */}
          <div className="hero-cta-group">
            <button onClick={scrollToForm} className="btn-primary-hero">
              <span>Get Your First Clean Free</span>
              <ArrowRight size={18} />
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary-hero"
            >
              <MessageSquare size={18} className="text-accent" />
              <span>Message on WhatsApp</span>
            </a>
          </div>

          <div className="hero-guarantee-note">
            <CheckCircle2 size={15} className="text-accent" />
            <span>Zero contract lock-in · 100% insured up to €1,000,000 · Cancel anytime</span>
          </div>

          {/* ── Required Stat Callout Box ──────────────────────────────────── */}
          <div className="hero-stats-banner">
            <div className="stat-card-hero stat-highlight">
              <div className="stat-icon-wrapper text-danger">
                <AlertTriangle size={20} />
              </div>
              <div className="stat-content">
                <div className="stat-number text-danger">~$3,000</div>
                <div className="stat-label">Cost of 1 Bad Clean</div>
                <div className="stat-desc">
                  Average revenue lost per host in refunds, cancelled bookings, and Airbnb algorithm penalties.
                </div>
              </div>
            </div>

            <div className="stat-card-hero">
              <div className="stat-icon-wrapper text-warning">
                <Flame size={20} />
              </div>
              <div className="stat-content">
                <div className="stat-number text-warning">-15% to -20%</div>
                <div className="stat-label">Inquiry Drop</div>
                <div className="stat-desc">
                  Caused by a mere 0.5-star drop in cleanliness score on short-term rental platforms.
                </div>
              </div>
            </div>

            <div className="stat-card-hero stat-solution">
              <div className="stat-icon-wrapper text-accent">
                <Camera size={20} />
              </div>
              <div className="stat-content">
                <div className="stat-number text-accent">100% Verified</div>
                <div className="stat-label">Photo Proof & Inspection</div>
                <div className="stat-desc">
                  Timestamped photo verification sent to your phone after every clean before the next guest arrives.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pain Points Section ─────────────────────────────────────────── */}
      <section id="pain-points" className="section-wrapper bg-surface-alt">
        <div className="content-container">
          <div className="section-heading-center">
            <div className="section-tag">The Reality of STR Hosting</div>
            <h2 className="section-title">
              Why traditional cleaners fail Airbnb hosts in Lisbon
            </h2>
            <p className="section-subtitle">
              Domestic cleaners work on weekly routines. Alojamento Local runs on tight, unpredictable guest turnovers where a single missed hair costs superhost status.
            </p>
          </div>

          <div className="pain-grid">
            {/* Card 1 */}
            <div className="pain-card">
              <div className="pain-icon-box">
                <Clock size={24} />
              </div>
              <div className="pain-badge">Turnaround Crunch</div>
              <h3 className="pain-title">The impossible 10am–3pm window</h3>
              <p className="pain-text">
                Checkout at 10:00 AM, next arrival at 3:00 PM. No room for delays, no second chances, and no time for you to rush across Lisbon to fix missed spots.
              </p>
            </div>

            {/* Card 2 */}
            <div className="pain-card">
              <div className="pain-icon-box">
                <Layers size={24} />
              </div>
              <div className="pain-badge">Quality Roulette</div>
              <h3 className="pain-title">Inconsistent quality every turnover</h3>
              <p className="pain-text">
                One clean is great, the next leaves unmade beds or a dusty shower corner. You shouldn&apos;t have to physically inspect every unit yourself to sleep at night.
              </p>
            </div>

            {/* Card 3 */}
            <div className="pain-card">
              <div className="pain-icon-box">
                <Camera size={24} />
              </div>
              <div className="pain-badge">Zero Proof</div>
              <h3 className="pain-title">No visibility when you&apos;re off-site</h3>
              <p className="pain-text">
                You receive a vague &quot;done&quot; text, but what about the fridge, linen tucks, or bathroom drain? You need timestamped photo proof, not blind trust.
              </p>
            </div>

            {/* Card 4 */}
            <div className="pain-card">
              <div className="pain-icon-box">
                <Calendar size={24} />
              </div>
              <div className="pain-badge">Rigid Schedules</div>
              <h3 className="pain-title">Rigid 9–5 cleaners don&apos;t fit STR</h3>
              <p className="pain-text">
                Last-minute bookings, early check-ins, and back-to-back turnovers don&apos;t adhere to standard cleaning agencies. We adapt to your guest calendar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive Before & After Turnover Slider ──────────────────── */}
      <section className="section-wrapper">
        <div className="content-container">
          <div className="section-heading-center">
            <div className="section-tag">Visual Standard</div>
            <h2 className="section-title">
              From post-checkout chaos to 5-star guest-ready
            </h2>
            <p className="section-subtitle">
              Drag the interactive slider below to inspect our turnover reset standard.
            </p>
          </div>

          <div
            className="slider-container"
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            onMouseMove={(e) => {
              if (!isDragging) return;
              const rect = e.currentTarget.getBoundingClientRect();
              handleSliderMove(e.clientX, rect);
            }}
            onTouchMove={(e) => {
              if (!isDragging || !e.touches[0]) return;
              const rect = e.currentTarget.getBoundingClientRect();
              handleSliderMove(e.touches[0].clientX, rect);
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              handleSliderMove(e.clientX, rect);
            }}
          >
            {/* After Image View (Underneath / Left Reveal) */}
            <div className="slider-image-layer slider-after">
              <div className="room-mockup ready-state">
                <div className="room-badge success">
                  <Sparkles size={14} /> 2:30 PM — 5-Star Guest Ready
                </div>
                <div className="staged-details">
                  <div className="detail-tag"><Check size={12} /> Crisp hotel hospital corners</div>
                  <div className="detail-tag"><Check size={12} /> Restocked coffee & amenities</div>
                  <div className="detail-tag"><Check size={12} /> Sanitized bathroom & spotless mirrors</div>
                  <div className="detail-tag"><Check size={12} /> Verified damage-free report</div>
                </div>
              </div>
            </div>

            {/* Before Image View (Clipped) */}
            <div
              className="slider-image-layer slider-before"
              style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
              <div className="room-mockup messy-state">
                <div className="room-badge warning">
                  <Clock size={14} /> 10:05 AM — Post-Checkout Checkout Mess
                </div>
                <div className="staged-details messy-tags">
                  <div className="detail-tag alert"><AlertTriangle size={12} /> Disheveled bedsheets & used towels</div>
                  <div className="detail-tag alert"><AlertTriangle size={12} /> Empty shampoo & coffee pods</div>
                  <div className="detail-tag alert"><AlertTriangle size={12} /> Watermarks, bins unemptied</div>
                </div>
              </div>
            </div>

            {/* Divider Handle */}
            <div className="slider-divider" style={{ left: `${sliderPosition}%` }}>
              <div className="slider-handle">
                <div className="handle-arrows">‹ ›</div>
              </div>
            </div>
          </div>

          <div className="slider-footer-note">
            <span>Drag the bar horizontally to inspect our turnover difference</span>
          </div>
        </div>
      </section>

      {/* ── What's Included (Service Bundle) ────────────────────────────── */}
      <section id="what-is-included" className="section-wrapper bg-surface-alt">
        <div className="content-container">
          <div className="section-heading-center">
            <div className="section-tag">Full Turnover Bundle</div>
            <h2 className="section-title">What is included in every clean</h2>
            <p className="section-subtitle">
              Every turnover is completed against a 42-point short-term rental checklist built to protect your Superhost status.
            </p>
          </div>

          <div className="inclusions-grid">
            <div className="inclusion-card">
              <div className="inclusion-header">
                <div className="inclusion-icon"><Sparkles size={20} /></div>
                <h3 className="inclusion-title">Full Turnover Deep Cleaning</h3>
              </div>
              <p className="inclusion-desc">
                Spotless kitchen, sanitized bathrooms, hair-free floors, dusted baseboards, and sparkling mirrors throughout the apartment.
              </p>
              <div className="inclusion-tag">Standard in every clean</div>
            </div>

            <div className="inclusion-card">
              <div className="inclusion-header">
                <div className="inclusion-icon"><Zap size={20} /></div>
                <h3 className="inclusion-title">Bed Making & Linen Care</h3>
              </div>
              <p className="inclusion-desc">
                Fresh linen change with tight hospital corners, pillow fluffing, and neatly folded bath towel sets staged on the bed.
              </p>
              <div className="inclusion-tag">Hotel standard</div>
            </div>

            <div className="inclusion-card">
              <div className="inclusion-header">
                <div className="inclusion-icon"><Coffee size={20} /></div>
                <h3 className="inclusion-title">Consumables Restocking</h3>
              </div>
              <p className="inclusion-desc">
                Host-supplied toiletries, Nespresso capsules, tea, and paper goods restocked by default. (Optional supply replenishment packs available).
              </p>
              <div className="inclusion-tag">Host supplies or pack add-on</div>
            </div>

            <div className="inclusion-card highlight-card">
              <div className="inclusion-header">
                <div className="inclusion-icon"><Camera size={20} /></div>
                <h3 className="inclusion-title">Photo-Verified Checklist</h3>
              </div>
              <p className="inclusion-desc">
                High-resolution photos of every completed zone sent to your WhatsApp immediately upon turnover completion.
              </p>
              <div className="inclusion-tag text-accent font-bold">100% proof sent to phone</div>
            </div>

            <div className="inclusion-card">
              <div className="inclusion-header">
                <div className="inclusion-icon"><AlertTriangle size={20} /></div>
                <h3 className="inclusion-title">Pre-Arrival Damage Reporting</h3>
              </div>
              <p className="inclusion-desc">
                We document and flag any guest damage, broken glass, or maintenance issues with timestamped photos before the next guest arrives.
              </p>
              <div className="inclusion-tag">Protects your deposit claims</div>
            </div>

            <div className="inclusion-card">
              <div className="inclusion-header">
                <div className="inclusion-icon"><ShieldCheck size={20} /></div>
                <h3 className="inclusion-title">Vetted & Insured Cleaners</h3>
              </div>
              <p className="inclusion-desc">
                Background-checked, STR-trained cleaners with full €1,000,000 public liability insurance coverage for every unit.
              </p>
              <div className="inclusion-tag">€1M Insurance Coverage</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Transparent Pricing Section ─────────────────────────────────── */}
      <section id="pricing" className="section-wrapper">
        <div className="content-container">
          <div className="section-heading-center">
            <div className="section-tag">Transparent Rate Card</div>
            <h2 className="section-title">Clear, fixed pricing per turnover</h2>
            <p className="section-subtitle">
              No hidden quotes, no surprise weekend surcharges. Know your exact cleaning cost before booking.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-tier-badge">Studio / AL</div>
              <h3 className="pricing-typology">Studio / T0</h3>
              <div className="pricing-figure">
                <span className="currency">€</span>
                <span className="amount">42</span>
                <span className="period">/ turnover</span>
              </div>
              <ul className="pricing-features">
                <li><Check size={14} className="text-accent" /> Full apartment turnover clean</li>
                <li><Check size={14} className="text-accent" /> 1 Bed linen change & staging</li>
                <li><Check size={14} className="text-accent" /> Photo checklist to WhatsApp</li>
                <li><Check size={14} className="text-accent" /> Damage inspection report</li>
              </ul>
              <button onClick={scrollToForm} className="btn-pricing">Book Free Trial</button>
            </div>

            <div className="pricing-card popular-card">
              <div className="popular-ribbon">Most Common in Lisbon</div>
              <div className="pricing-tier-badge">1 Bedroom</div>
              <h3 className="pricing-typology">T1 Apartment</h3>
              <div className="pricing-figure">
                <span className="currency">€</span>
                <span className="amount">48</span>
                <span className="period">/ turnover</span>
              </div>
              <ul className="pricing-features">
                <li><Check size={14} className="text-accent" /> Full bedroom, living, bath & kitchen</li>
                <li><Check size={14} className="text-accent" /> Fresh linens & towel setup</li>
                <li><Check size={14} className="text-accent" /> Photo checklist to WhatsApp</li>
                <li><Check size={14} className="text-accent" /> Damage & restocking report</li>
              </ul>
              <button onClick={scrollToForm} className="btn-pricing btn-pricing-highlight">
                Get T1 Clean Free
              </button>
            </div>

            <div className="pricing-card">
              <div className="pricing-tier-badge">2 Bedroom</div>
              <h3 className="pricing-typology">T2 Apartment</h3>
              <div className="pricing-figure">
                <span className="currency">€</span>
                <span className="amount">58</span>
                <span className="period">/ turnover</span>
              </div>
              <ul className="pricing-features">
                <li><Check size={14} className="text-accent" /> Up to 2 bedrooms & 2 bathrooms</li>
                <li><Check size={14} className="text-accent" /> Linen change & presentation</li>
                <li><Check size={14} className="text-accent" /> Photo checklist to WhatsApp</li>
                <li><Check size={14} className="text-accent" /> Damage & maintenance check</li>
              </ul>
              <button onClick={scrollToForm} className="btn-pricing">Book Free Trial</button>
            </div>

            <div className="pricing-card">
              <div className="pricing-tier-badge">3 Bedroom</div>
              <h3 className="pricing-typology">T3 Apartment</h3>
              <div className="pricing-figure">
                <span className="currency">€</span>
                <span className="amount">64</span>
                <span className="period">/ turnover</span>
              </div>
              <ul className="pricing-features">
                <li><Check size={14} className="text-accent" /> Large unit turnover & deep sanitization</li>
                <li><Check size={14} className="text-accent" /> Multiple bed linens & towel sets</li>
                <li><Check size={14} className="text-accent" /> Photo checklist to WhatsApp</li>
                <li><Check size={14} className="text-accent" /> Damage & maintenance check</li>
              </ul>
              <button onClick={scrollToForm} className="btn-pricing">Book Free Trial</button>
            </div>
          </div>

          {/* Volume Note */}
          <div className="volume-discount-banner">
            <div className="volume-icon"><KeyRound size={20} /></div>
            <div className="volume-text">
              <strong>Managing 3 to 5 units in Lisbon?</strong> Volume pricing and dedicated key-holding discounts automatically kick in. 
            </div>
          </div>

          {/* Pricing CTA Banner */}
          <div className="trial-callout-box">
            <div className="trial-callout-content">
              <div className="trial-badge">Risk-Free Offer</div>
              <h3 className="trial-title">First clean free — no commitment, no contract.</h3>
              <p className="trial-desc">
                Test our turnover standard on your next guest checkout. If you don&apos;t think it&apos;s the best clean your AL has ever had, you owe nothing.
              </p>
            </div>
            <button onClick={scrollToForm} className="btn-primary-hero">
              Claim Your Free Clean
            </button>
          </div>
        </div>
      </section>

      {/* ── Trust / Credibility Section ─────────────────────────────────── */}
      <section id="how-it-works" className="section-wrapper bg-surface-alt">
        <div className="content-container">
          <div className="section-heading-center">
            <div className="section-tag">Process Trust</div>
            <h2 className="section-title">How it works in 3 simple steps</h2>
            <p className="section-subtitle">
              We built our process to save Lisbon hosts 10+ hours a week in operational chaos.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon-wrap"><Calendar size={24} /></div>
              <h3 className="step-title">Send your schedule</h3>
              <p className="step-text">
                Connect your Airbnb/iCal link or simply drop checkout dates in our dedicated WhatsApp thread.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon-wrap"><Camera size={24} /></div>
              <h3 className="step-title">We clean & send photo proof</h3>
              <p className="step-text">
                Our insured cleaner arrives on time, follows the 42-point checklist, restocks amenities, and sends timestamped photo verification.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon-wrap"><CheckCircle2 size={24} /></div>
              <h3 className="step-title">You review & relax</h3>
              <p className="step-text">
                Your guest checks in to a pristine apartment. You receive a monthly consolidated invoice. Cancel anytime with zero lock-in contracts.
              </p>
            </div>
          </div>

          {/* Insurance & Trust Badges */}
          <div className="trust-badges-row">
            <div className="trust-badge-item">
              <ShieldCheck size={20} className="text-accent" />
              <span><strong>€1,000,000</strong> Insurance Coverage</span>
            </div>
            <div className="trust-badge-item">
              <FileCheck size={20} className="text-accent" />
              <span><strong>42-Point</strong> Photo Checklist</span>
            </div>
            <div className="trust-badge-item">
              <KeyRound size={20} className="text-accent" />
              <span><strong>Secure</strong> Key Lockbox Handling</span>
            </div>
            <div className="trust-badge-item">
              <Clock size={20} className="text-accent" />
              <span><strong>Guaranteed</strong> Ready by 3:00 PM</span>
            </div>
          </div>

          {/* Launch Cohort Testimonial Placeholder */}
          <div className="cohort-banner">
            <div className="cohort-badge">Lisbon Launch Cohort</div>
            <div className="cohort-title">Currently onboarding hosts in Alfama, Chiado, Arroios & Príncipe Real</div>
            <p className="cohort-sub">
              We limit our Lisbon partner roster to ensure every unit receives guaranteed 3:00 PM turnaround times without compromise.
            </p>
          </div>
        </div>
      </section>

      {/* ── Lisbon Neighborhoods ────────────────────────────────────────── */}
      <section className="section-wrapper neighborhoods-section">
        <div className="content-container">
          <div className="neighborhoods-box">
            <div className="neighborhoods-header">
              <MapPin size={22} className="text-accent" />
              <h3>Covering all core Airbnb hubs in Lisbon</h3>
            </div>
            <div className="neighborhood-chips">
              {neighborhoods.map((n) => (
                <span key={n} className="chip">
                  <Check size={12} /> {n}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ─────────────────────────────────────────────────── */}
      <section id="faq" className="section-wrapper bg-surface-alt">
        <div className="content-container">
          <div className="section-heading-center">
            <div className="section-tag">Frequently Asked Questions</div>
            <h2 className="section-title">Answers for Lisbon AL Hosts</h2>
          </div>

          <div className="faq-grid">
            <div className="faq-card">
              <h4 className="faq-q">How does the &quot;First Clean Free&quot; trial work?</h4>
              <p className="faq-a">
                Submit the form below or message us on WhatsApp. We will schedule your upcoming turnover, complete the full 42-point turnover clean, and send you the verified photo report. No payment details required and zero obligation.
              </p>
            </div>

            <div className="faq-card">
              <h4 className="faq-q">How do your cleaners handle keys and access?</h4>
              <p className="faq-a">
                Most hosts use smart locks or secure lockboxes (e.g. Master Lock, Igloohome, Nuki). Our vetted cleaners follow strict key security protocols and return keys immediately to lockboxes upon departure.
              </p>
            </div>

            <div className="faq-card">
              <h4 className="faq-q">What happens if a guest leaves damage or a severe mess?</h4>
              <p className="faq-a">
                Our cleaners immediately take photos of the damage and notify you via WhatsApp before proceeding, providing the exact documentation needed for Airbnb AirCover deposit claims.
              </p>
            </div>

            <div className="faq-card">
              <h4 className="faq-q">How do you manage linen and towel laundry?</h4>
              <p className="faq-a">
                We handle on-site washing if unit washers/dryers allow, or swap with host-supplied backup sets. For multi-unit hosts, off-site linen service coordination is also available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Low-Friction Trial Booking Form & WhatsApp CTA ───────────────── */}
      <section id="claim-trial" className="section-wrapper trial-form-section">
        <div className="content-container">
          <div className="form-container-card">
            <div className="form-left">
              <div className="section-tag">Limited Launch Spots</div>
              <h2 className="form-headline">
                Claim your first turnover clean free.
              </h2>
              <p className="form-sub">
                No credit card required. No lock-in contracts. See the difference verified photo turnovers make for your Lisbon AL.
              </p>

              <div className="form-perks">
                <div className="perk-item">
                  <CheckCircle2 size={18} className="text-accent" />
                  <span>Full 42-point turnover deep clean</span>
                </div>
                <div className="perk-item">
                  <CheckCircle2 size={18} className="text-accent" />
                  <span>Timestamped photo report to your WhatsApp</span>
                </div>
                <div className="perk-item">
                  <CheckCircle2 size={18} className="text-accent" />
                  <span>Pre-arrival damage check</span>
                </div>
              </div>

              {/* Direct WhatsApp Action */}
              <div className="whatsapp-callout-box">
                <div className="wa-title">Prefer instant response?</div>
                <p className="wa-desc">Chat directly with our Lisbon operations team on WhatsApp.</p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp-full"
                >
                  <MessageSquare size={18} />
                  <span>Chat on WhatsApp Now</span>
                </a>
              </div>
            </div>

            <div className="form-right">
              {formSubmitted ? (
                <div className="form-success-box animate-fade-in">
                  <div className="success-icon"><CheckCircle2 size={48} /></div>
                  <h3 className="success-title">Trial Clean Request Received!</h3>
                  <p className="success-desc">
                    Obrigado, {formData.name}! Our Lisbon team will message your WhatsApp ({formData.phone}) within 15 minutes to confirm your turnover date.
                  </p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary-hero mt-4"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <MessageSquare size={18} /> Fast-track on WhatsApp
                  </a>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="booking-form">
                  <h3 className="form-box-title">Get Your Free Trial Clean</h3>
                  <p className="form-box-subtitle">Fill in 4 quick details to claim your spot.</p>

                  <div className="form-group">
                    <label htmlFor="host-name">Your Name</label>
                    <input
                      id="host-name"
                      type="text"
                      required
                      placeholder="e.g. Manuel Silva"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="host-phone">WhatsApp / Phone Number</label>
                    <input
                      id="host-phone"
                      type="tel"
                      required
                      placeholder="e.g. +351 912 345 678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="host-units">Number of Units</label>
                      <select
                        id="host-units"
                        value={formData.units}
                        onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                      >
                        <option value="1 unit">1 unit</option>
                        <option value="2 units">2 units</option>
                        <option value="3 units">3 units</option>
                        <option value="4 units">4 units</option>
                        <option value="5+ units">5+ units</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="host-zone">Lisbon Neighborhood</label>
                      <select
                        id="host-zone"
                        value={formData.neighborhood}
                        onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                      >
                        {neighborhoods.map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="btn-form-submit">
                    <span>Book Your Free Clean</span>
                    <ArrowRight size={16} />
                  </button>

                  <div className="form-privacy-note">
                    <Shield size={12} /> No spam. We only contact you to schedule your turnover clean.
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="landing-footer-container">
          <div className="footer-left">
            <div className="landing-brand">
              <div className="brand-badge-icon"><Sparkles size={16} /></div>
              <span className="brand-name">Impporta AL</span>
            </div>
            <p className="footer-tagline">
              Dedicated short-term rental turnover cleaning for Airbnb & Alojamento Local hosts in Lisbon.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <span className="footer-col-title">Services</span>
              <a href="#pricing">Studio / T0 (€42)</a>
              <a href="#pricing">T1 Turnover (€48)</a>
              <a href="#pricing">T2 Turnover (€58)</a>
              <a href="#pricing">T3 Turnover (€64)</a>
            </div>
            <div className="footer-column">
              <span className="footer-col-title">Neighborhoods</span>
              <span>Baixa & Chiado</span>
              <span>Alfama & Castelo</span>
              <span>Príncipe Real & Arroios</span>
              <span>Campo de Ourique & Estrela</span>
            </div>
            <div className="footer-column">
              <span className="footer-col-title">Contact & Support</span>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp Support</a>
              <Link href="/deals" style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Platform Portal</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Impporta AL Lisbon. All rights reserved. Registered cleaning & facility management in Portugal.</p>
        </div>
      </footer>
    </div>
  );
}
