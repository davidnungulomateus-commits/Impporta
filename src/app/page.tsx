"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Sun, 
  Moon, 
  Eye, 
  AlertTriangle, 
  Ship, 
  Search, 
  Archive, 
  Clock, 
  MessageCircle, 
  MapPin,
  Languages,
  Camera,
  CheckCircle,
  Menu,
  X
} from "lucide-react";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [emailError, setEmailError] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    spend: "",
    teamSize: "",
    email: ""
  });
  const router = useRouter();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async () => {
    if (!formData.email || !validateEmail(formData.email)) {
      setEmailError(true);
      return;
    }
    
    setEmailError(false);
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
        // Redirect after a brief delay to show success animation
        setTimeout(() => {
          router.push('/success');
        }, 1500);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to send request. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.main}>
      {/* Header */}
      <header className={styles.header}>
        <div className={`container ${styles.headerContainer}`}>
          <div className={styles.logo}>
            <Image src="/icon.png" alt="Impporta Logo" width={24} height={24} style={{ borderRadius: '4px' }} />
            <span>Impport<span className={styles.logoAccent}>a</span></span>
          </div>
          <nav className={styles.nav}>
            <Link href="#features" className={styles.navLink}>Features</Link>
            <Link href="#solutions" className={styles.navLink}>Solutions</Link>
            
            <div className={styles.themeToggle}>
              <button 
                className={`${styles.themeBtn} ${theme === "light" ? styles.themeBtnActive : ""}`}
                onClick={() => setTheme("light")}
                aria-label="Light Mode"
              >
                <Sun size={18} />
              </button>
              <button 
                className={`${styles.themeBtn} ${theme === "dark" ? styles.themeBtnActive : ""}`}
                onClick={() => setTheme("dark")}
                aria-label="Dark Mode"
              >
                <Moon size={18} />
              </button>
            </div>

            <button 
              className="btn-primary" 
              style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}
              onClick={() => setIsModalOpen(true)}
            >
              Request Access
            </button>

            <button 
              className={styles.menuBtn}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={styles.mobileMenu}
            >
              <div className={styles.mobileNav}>
                <Link href="#features" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>Features</Link>
                <Link href="#solutions" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>Solutions</Link>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 0" }}>
                  <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>Theme</span>
                  <div className={styles.themeToggle}>
                    <button 
                      className={`${styles.themeBtn} ${theme === "light" ? styles.themeBtnActive : ""}`}
                      onClick={() => setTheme("light")}
                    >
                      <Sun size={18} />
                    </button>
                    <button 
                      className={`${styles.themeBtn} ${theme === "dark" ? styles.themeBtnActive : ""}`}
                      onClick={() => setTheme("dark")}
                    >
                      <Moon size={18} />
                    </button>
                  </div>
                </div>
                <button 
                  className="btn-primary" 
                  style={{ width: "100%", marginTop: "1rem" }}
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                >
                  Request Access
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}></div>
        <div className="container" style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.heroTag}
          >
            <span style={{ background: "var(--emerald-500)", width: 8, height: 8, borderRadius: "50%" }}></span>
            The New Standard for Global Sourcing
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={styles.heroTitle}
          >
            Centralize your <span className="text-gradient">international sourcing</span> workflow
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={styles.heroDescription}
          >
            A professional, unified workspace bringing buyers, agents, and operations together. 
            Manage deals, negotiate contracts, and communicate in real-time.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={styles.heroActions}
          >
            <button 
              className="btn-primary" 
              style={{ padding: "1rem 2rem", fontSize: "1.125rem" }}
              onClick={() => setIsModalOpen(true)}
            >
              Request Access <ArrowRight size={20} />
            </button>
          </motion.div>

          {/* High-Fidelity Mockup Container */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className={styles.mockupContainer}
          >
            <div className={styles.mockupInner}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Image 
                    src={theme === "light" ? "/product-light.png" : "/product-dark.png"}
                    alt="Impporta Dashboard"
                    width={2000}
                    height={1200}
                    className={styles.mockupImage}
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pillars Section */}
      <section id="features" className={styles.features}>
        <div className="container">
          <div className={styles.featuresHeader}>
            <h2 className={styles.featuresTitle}>The Four Pillars of Sourcing Excellence</h2>
            <p className={styles.heroDescription} style={{ margin: "0 auto" }}>
              Comprehensive tools designed for high-stakes international trade and corporate compliance.
            </p>
          </div>

          {/* Pillar 1 */}
          <div className={styles.featureRow}>
            <div className={styles.featureContent}>
              <div className={styles.featureIcon} style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--emerald-500)" }}>
                <CheckCircle2 size={28} />
              </div>
              <span className={styles.audienceRole} style={{ color: "var(--emerald-500)", background: "rgba(16, 185, 129, 0.1)" }}>Pillar 1</span>
              <h3 className={styles.featureTitle}>Financial Transparency & Control</h3>
              <p className={styles.featureDescription}>
                Eliminating the "sticker shock" of hidden import costs with automated intelligence.
              </p>
              <div className={styles.subFeatureGrid} style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem", marginTop: "2rem" }}>
                <div className={styles.subFeature} style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ flexShrink: 0, width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.checkIcon}><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="16" y2="18"/></svg>
                  </div>
                  <div>
                    <strong style={{ display: "block", marginBottom: "0.25rem" }}>Landed Cost Engine</strong>
                    <p style={{ fontSize: "0.875rem", opacity: 0.8 }}>An automated calculator that factors in SACU duties, Ad Valorem taxes, and specific "Tax-on-Tax" VAT logic.</p>
                  </div>
                </div>
                <div className={styles.subFeature} style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ flexShrink: 0, width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.checkIcon}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <div>
                    <strong style={{ display: "block", marginBottom: "0.25rem" }}>Secure Payment Escrow</strong>
                    <p style={{ fontSize: "0.875rem", opacity: 0.8 }}>A financial safety net that holds funds until quality and loading are confirmed by field agents.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.featureVisual}>
              <div className={styles.visualCard}>
                 <div style={{ padding: "1rem", background: "var(--slate-100)", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "14px" }}>
                      <span>Product + Shipping</span>
                      <span>$12,450.00</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "14px" }}>
                      <span>SACU Duty (15%)</span>
                      <span>$1,867.50</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", fontSize: "14px", borderBottom: "1px dashed var(--border-color)", paddingBottom: "0.5rem" }}>
                      <span>VAT (15% on Total)</span>
                      <span>$2,147.63</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "16px", color: "var(--emerald-500)" }}>
                      <span>Total Landed Cost</span>
                      <span>$16,465.13</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className={styles.featureRow}>
            <div className={styles.featureContent}>
              <div className={styles.featureIcon}>
                <ShieldCheck size={28} />
              </div>
              <span className={styles.audienceRole} style={{ color: "var(--emerald-500)", background: "rgba(16, 185, 129, 0.1)" }}>Pillar 2</span>
              <h3 className={styles.featureTitle}>Risk Management & Quality Assurance</h3>
              <p className={styles.featureDescription}>
                Providing the "eyes on the ground" that large corporations require for compliance and peace of mind.
              </p>
              <div className={styles.subFeatureGrid} style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem", marginTop: "2rem" }}>
                <div className={styles.subFeature} style={{ display: "flex", gap: "1rem" }}>
                  <Eye size={20} className={styles.checkIcon} style={{ flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: "block", marginBottom: "0.25rem" }}>Visual Inspection Hub</strong>
                    <p style={{ fontSize: "0.875rem", opacity: 0.8 }}>A central gallery for agents to upload high-res photos and videos before containers leave China.</p>
                  </div>
                </div>
                <div className={styles.subFeature} style={{ display: "flex", gap: "1rem" }}>
                  <CheckCircle2 size={20} className={styles.checkIcon} style={{ flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: "block", marginBottom: "0.25rem" }}>Supplier Verification Badges</strong>
                    <p style={{ fontSize: "0.875rem", opacity: 0.8 }}>Factories physically audited by agents to ensure legitimacy and ISO/ethical standards.</p>
                  </div>
                </div>
                <div className={styles.subFeature} style={{ display: "flex", gap: "1rem" }}>
                  <AlertTriangle size={20} className={styles.checkIcon} style={{ flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: "block", marginBottom: "0.25rem" }}>Anti-Dumping Alerts</strong>
                    <p style={{ fontSize: "0.875rem", opacity: 0.8 }}>Automated warnings for products carrying heavy protective duties in the SACU region.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.featureVisual}>
              <div className={styles.visualCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid var(--emerald-500)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--emerald-500)", fontSize: "10px", fontWeight: "800" }}>100%</div>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: "700" }}>Visual Audit</div>
                      <div style={{ fontSize: "10px", opacity: 0.6 }}>Batch #8829-QC</div>
                    </div>
                  </div>
                  <span style={{ fontSize: "10px", background: "rgba(16, 185, 129, 0.1)", color: "var(--emerald-500)", padding: "2px 8px", borderRadius: "99px", fontWeight: "600" }}>PASSED</span>
                </div>
                
                <div className={styles.responsiveGrid} style={{ marginBottom: "1.5rem", gap: "0.75rem" }}>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} style={{ aspectRatio: "4/3", background: "var(--slate-100)", borderRadius: "6px", position: "relative", border: "1px solid var(--border-color)", overflow: "hidden" }}>
                       <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.2 }}>
                         <Camera size={20} />
                       </div>
                       <div style={{ position: "absolute", top: 4, right: 4, width: "6px", height: "6px", background: "var(--emerald-500)", borderRadius: "50%" }} />
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><CheckCircle size={12} color="var(--emerald-500)" /> Factory Audit</span>
                    <span style={{ opacity: 0.6 }}>Verified</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><CheckCircle size={12} color="var(--emerald-500)" /> Material Check</span>
                    <span style={{ opacity: 0.6 }}>Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className={styles.featureRow}>
            <div className={styles.featureContent}>
              <div className={styles.featureIcon}>
                <Ship size={28} />
              </div>
              <span className={styles.audienceRole} style={{ color: "var(--blue-500)", background: "rgba(59, 130, 246, 0.1)" }}>Pillar 3</span>
              <h3 className={styles.featureTitle}>Logistics & Compliance Intelligence</h3>
              <p className={styles.featureDescription}>
                Streamlining the movement of goods through complex African ports with real-time data and organization.
              </p>
              <div className={styles.subFeatureGrid} style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem", marginTop: "2rem" }}>
                <div className={styles.subFeature} style={{ display: "flex", gap: "1rem" }}>
                  <Search size={20} className={styles.checkIcon} style={{ flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: "block", marginBottom: "0.25rem" }}>HS Code Lookup Tool</strong>
                    <p style={{ fontSize: "0.875rem", opacity: 0.8 }}>Searchable database of SADC-specific codes to ensure correct duty rates from the start.</p>
                  </div>
                </div>
                <div className={styles.subFeature} style={{ display: "flex", gap: "1rem" }}>
                  <Archive size={20} className={styles.checkIcon} style={{ flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: "block", marginBottom: "0.25rem" }}>Digital Document Vault</strong>
                    <p style={{ fontSize: "0.875rem", opacity: 0.8 }}>Organized home for the "Big Three": Commercial Invoice, Packing List, and Bill of Lading.</p>
                  </div>
                </div>
                <div className={styles.subFeature} style={{ display: "flex", gap: "1rem" }}>
                  <Clock size={20} className={styles.checkIcon} style={{ flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: "block", marginBottom: "0.25rem" }}>Port Congestion Monitor</strong>
                    <p style={{ fontSize: "0.875rem", opacity: 0.8 }}>Real-time updates on delays at Durban or Walvis Bay for inventory planning.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.featureVisual}>
              <div className={styles.visualCard}>
                <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem", marginBottom: "1rem", fontSize: "14px", display: "flex", justifyContent: "space-between" }}>
                  <span>Port of Durban</span>
                  <span style={{ color: "#fbbf24" }}>High Congestion (4.2d)</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <div style={{ height: "40px", background: "var(--slate-100)", borderRadius: "6px", display: "flex", alignItems: "center", padding: "0 0.75rem", gap: "0.5rem" }}>
                    <FileText size={14} color="var(--emerald-500)" />
                    <span style={{ fontSize: "12px" }}>Bill_of_Lading_SH204.pdf</span>
                  </div>
                  <div style={{ height: "40px", background: "var(--slate-100)", borderRadius: "6px", display: "flex", alignItems: "center", padding: "0 0.75rem", gap: "0.5rem" }}>
                    <FileText size={14} color="var(--emerald-500)" />
                    <span style={{ fontSize: "12px" }}>Commercial_Invoice_v2.pdf</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className={styles.featureRow}>
            <div className={styles.featureContent}>
              <div className={styles.featureIcon}>
                <MessageCircle size={28} />
              </div>
              <span className={styles.audienceRole} style={{ color: "var(--emerald-500)", background: "rgba(16, 185, 129, 0.1)" }}>Pillar 4</span>
              <h3 className={styles.featureTitle}>Accountability & Communication</h3>
              <p className={styles.featureDescription}>
                Bridging the language and distance gap between Africa and China with transparency.
              </p>
              <div className={styles.subFeatureGrid} style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem", marginTop: "2rem" }}>
                <div className={styles.subFeature} style={{ display: "flex", gap: "1rem" }}>
                  <Languages size={20} className={styles.checkIcon} style={{ flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: "block", marginBottom: "0.25rem" }}>Agent Chat with Auto-Translate</strong>
                    <p style={{ fontSize: "0.875rem", opacity: 0.8 }}>Seamless messaging between English/Afrikaans and Mandarin for technical specs.</p>
                  </div>
                </div>
                <div className={styles.subFeature} style={{ display: "flex", gap: "1rem" }}>
                  <MapPin size={20} className={styles.checkIcon} style={{ flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: "block", marginBottom: "0.25rem" }}>End-to-End Milestone Tracking</strong>
                    <p style={{ fontSize: "0.875rem", opacity: 0.8 }}>Visual timeline showing progress from factory floor to customs clearance.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.featureVisual}>
              <div className={styles.visualCard}>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ alignSelf: "flex-start", background: "var(--slate-200)", padding: "0.75rem", borderRadius: "12px 12px 12px 0", fontSize: "12px" }}>
                    请确认包装细节。
                    <div style={{ fontSize: "10px", opacity: 0.6, marginTop: "4px", borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: "4px" }}>
                      Translated: Please confirm packing details.
                    </div>
                  </div>
                  <div style={{ alignSelf: "flex-end", background: "var(--emerald-500)", color: "white", padding: "0.75rem", borderRadius: "12px 12px 0 12px", fontSize: "12px" }}>
                    Confirmed, please proceed with loading.
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Target Audience Split */}
      <section id="solutions" className={styles.audience}>
        <div className="container">
          <div className={styles.featuresHeader} style={{ marginBottom: "4rem" }}>
            <h2 className={styles.featuresTitle}>Empowering Every Role</h2>
          </div>
          
          <div className={styles.audienceGrid}>
            <div className={styles.audienceCard}>
              <span className={styles.audienceRole}>For Clients (Buyers)</span>
              <h3 className={styles.audienceTitle}>Source with Confidence</h3>
              <p className={styles.audienceDescription}>
                Discover vetted products in our Explore hub. Work directly with professional agents 
                who guide you through the complexities of international trade in a secure, transparent environment.
              </p>
            </div>
            
            <div className={styles.audienceCard}>
              <span className={styles.audienceRole}>For Agents (Facilitators)</span>
              <h3 className={styles.audienceTitle}>Scale Your Deal Flow</h3>
              <p className={styles.audienceDescription}>
                Manage multiple clients and suppliers from a single dashboard. Keep your communications, 
                contracts, and operations organized without context-switching between different apps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>Ready to transform your sourcing workflow?</h2>
            <p className={styles.ctaDescription}>
              Join top-tier importers and agents who use Impporta to close deals faster and manage complex supply chains with ease.
            </p>
            <button 
              className="btn-primary" 
              style={{ padding: "1.25rem 2.5rem", fontSize: "1.125rem" }}
              onClick={() => setIsModalOpen(true)}
            >
              Request Access Today <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Request Access Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
            <motion.div 
              className={styles.modalContent} 
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <button className={styles.closeBtn} onClick={() => {
                setIsModalOpen(false);
                setIsSuccess(false);
                setCurrentStep(1);
              }}>×</button>
              
              {!isSuccess && (
                <div className={styles.progressContainer}>
                  <div className={styles.progressTrack}>
                    <div 
                      className={styles.progressFill} 
                      style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                    />
                  </div>
                  <div className={styles.stepIndicator}>
                    {[1, 2, 3, 4, 5].map((step) => (
                      <div 
                        key={step} 
                        className={`
                          ${styles.stepDot} 
                          ${currentStep > step ? styles.stepDotCompleted : ""}
                          ${currentStep === step ? styles.stepDotActive : ""}
                        `}
                      />
                    ))}
                  </div>
                </div>
              )}

              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={styles.successStep}
                  >
                    <div className={styles.successIcon}>
                      <motion.svg 
                        viewBox="0 0 52 52" 
                        className={styles.checkmarkSvg}
                      >
                        <motion.circle 
                          cx="26" cy="26" r="25" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                        <motion.path 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="5" 
                          d="M14.1 27.2l7.1 7.2 16.7-16.8" 
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.3, delay: 0.5 }}
                        />
                      </motion.svg>
                    </div>
                    <h2 className={styles.modalTitle}>Request Received!</h2>
                    <p className={styles.modalSubtitle}>
                      We've added you to our priority waitlist. Keep an eye on <strong>{formData.email}</strong> for your invitation.
                    </p>
                    <div className={styles.redirectBadge}>
                      Redirecting to confirmation...
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {currentStep === 1 && (
                      <motion.div 
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className={styles.formStep}
                      >
                        <h2 className={styles.modalTitle}>Tell us about yourself</h2>
                        <p className={styles.modalSubtitle}>What is your business or individual name?</p>
                        <input 
                          type="text" 
                          className={styles.modalInput} 
                          placeholder="e.g. Acme Corp or John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && formData.name && setCurrentStep(2)}
                        />
                        <button 
                          className="btn-primary" 
                          style={{ width: "100%", marginTop: "1rem" }}
                          onClick={() => formData.name && setCurrentStep(2)}
                        >
                          Next
                        </button>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div 
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className={styles.formStep}
                      >
                        <h2 className={styles.modalTitle}>Your Role</h2>
                        <p className={styles.modalSubtitle}>What is your current role or position?</p>
                        <input 
                          type="text" 
                          className={styles.modalInput} 
                          placeholder="e.g. Procurement Manager, CEO"
                          value={formData.role}
                          onChange={(e) => setFormData({...formData, role: e.target.value})}
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && formData.role && setCurrentStep(3)}
                        />
                        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                          <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setCurrentStep(1)}>Back</button>
                          <button className="btn-primary" style={{ flex: 2 }} onClick={() => formData.role && setCurrentStep(3)}>Next</button>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div 
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className={styles.formStep}
                      >
                        <h2 className={styles.modalTitle}>Monthly Import Volume</h2>
                        <p className={styles.modalSubtitle}>Approximately how much do you spend monthly on imports?</p>
                        <select 
                          className={styles.modalSelect} 
                          value={formData.spend}
                          onChange={(e) => setFormData({...formData, spend: e.target.value})}
                        >
                          <option value="">Select a range...</option>
                          <option value="< $10k">Less than $10,000</option>
                          <option value="$10k - $50k">$10,000 - $50,000</option>
                          <option value="$50k - $200k">$50,000 - $200,000</option>
                          <option value="$200k+">$200,000+</option>
                        </select>
                        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                          <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setCurrentStep(2)}>Back</button>
                          <button className="btn-primary" style={{ flex: 2 }} onClick={() => formData.spend && setCurrentStep(4)}>Next</button>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 4 && (
                      <motion.div 
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className={styles.formStep}
                      >
                        <h2 className={styles.modalTitle}>Team Size</h2>
                        <p className={styles.modalSubtitle}>How many people are currently in your business?</p>
                        <div className={styles.radioGrid}>
                          {["1-5", "6-10", "11-50", "51+"].map((size) => (
                            <button 
                              key={size}
                              className={`${styles.radioBtn} ${formData.teamSize === size ? styles.radioBtnActive : ""}`}
                              onClick={() => setFormData({...formData, teamSize: size})}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                          <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setCurrentStep(3)}>Back</button>
                          <button className="btn-primary" style={{ flex: 2 }} onClick={() => formData.teamSize && setCurrentStep(5)}>Next</button>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 5 && (
                      <motion.div 
                        key="step5"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className={styles.formStep}
                      >
                        <h2 className={styles.modalTitle}>Final Step</h2>
                        <p className={styles.modalSubtitle}>Where should we send your access invitation?</p>
                        <div style={{ position: "relative" }}>
                          <input 
                            type="email" 
                            className={`${styles.modalInput} ${emailError ? styles.modalInputError : ""}`} 
                            placeholder="work@example.com"
                            value={formData.email}
                            onChange={(e) => {
                              setFormData({...formData, email: e.target.value});
                              if (emailError) setEmailError(false);
                            }}
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && formData.email && handleSubmit()}
                          />
                          {emailError && (
                            <span className={styles.errorMessage}>Please enter a valid email address</span>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                          <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setCurrentStep(4)}>Back</button>
                          <button 
                            className="btn-primary" 
                            style={{ flex: 2 }} 
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Submitting..." : "Submit Request"}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={`container ${styles.footerInner}`}>
          <div className={styles.logo} style={{ fontSize: "1.25rem" }}>
            Impport<span className={styles.logoAccent}>a</span>
          </div>
          <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            <Link href="/privacy" className={styles.navLink} style={{ fontSize: "0.875rem" }}>Privacy Policy</Link>
            <span>&copy; {new Date().getFullYear()} Impporta Inc. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
