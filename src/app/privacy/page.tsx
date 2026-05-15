"use client";

import { motion } from "framer-motion";
import { Shield, ArrowLeft, Lock, Eye, Database, Globe } from "lucide-react";
import Link from "next/link";
import styles from "../page.module.css";
import { useEffect } from "react";

export default function PrivacyPage() {
  // Ensure the theme is consistent with the landing page
  useEffect(() => {
    const savedTheme = document.documentElement.getAttribute("data-theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  return (
    <main className={styles.main} style={{ padding: "8rem 2rem 4rem" }}>
      <div className={styles.heroBackground}></div>
      
      <div className="container" style={{ maxWidth: "800px", position: "relative", zIndex: 10 }}>
        <Link href="/" className={styles.navLink} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "3rem" }}>
          <ArrowLeft size={18} /> Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.heroTitle} style={{ fontSize: "3rem", textAlign: "left", marginBottom: "1.5rem" }}>
            Privacy <span className="text-gradient">Policy</span>
          </h1>
          <p className={styles.heroDescription} style={{ textAlign: "left", marginLeft: 0, marginBottom: "4rem" }}>
            At Impporta, we are committed to protecting your privacy and ensuring transparency in how we handle your information.
          </p>
        </motion.div>

        <div style={{ display: "grid", gap: "3rem" }}>
          <section>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div className={styles.successIcon} style={{ width: "40px", height: "40px", marginBottom: 0 }}>
                <Database size={20} />
              </div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700" }}>Data We Collect</h2>
            </div>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.8", marginBottom: "1rem" }}>
              When you use the Impporta platform, we collect information to provide a better experience for all our users. This includes:
            </p>
            <ul style={{ color: "var(--text-secondary)", lineHeight: "1.8", paddingLeft: "1.5rem", listStyleType: "disc" }}>
              <li><strong>Personal Information:</strong> Name, email address, and business details provided through our Request Access form.</li>
              <li><strong>Usage Information:</strong> We use Microsoft Clarity and Google Analytics to capture how you use and interact with our website through behavioral metrics, heatmaps, and session replay to improve our services.</li>
              <li><strong>Technical Data:</strong> IP address, browser type, and device information.</li>
            </ul>
          </section>

          <section>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div className={styles.successIcon} style={{ width: "40px", height: "40px", marginBottom: 0 }}>
                <Eye size={20} />
              </div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700" }}>How We Use Data</h2>
            </div>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.8" }}>
              The information we collect is used solely to provide, maintain, and improve our services. Specifically:
              <br /><br />
              • To process your request for platform access.
              <br />
              • To understand user behavior via <strong>Microsoft Clarity</strong> to optimize our UI/UX.
              <br />
              • To measure marketing performance using the <strong>Google Tag</strong>.
              <br />
              • To communicate important platform updates and security alerts.
            </p>
          </section>

          <section>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div className={styles.successIcon} style={{ width: "40px", height: "40px", marginBottom: 0 }}>
                <Lock size={20} />
              </div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700" }}>Data Security</h2>
            </div>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.8" }}>
              We implement industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure. Our integration with third-party tools like Microsoft and Google adheres to their strict security protocols.
            </p>
          </section>

          <section>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div className={styles.successIcon} style={{ width: "40px", height: "40px", marginBottom: 0 }}>
                <Globe size={20} />
              </div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700" }}>Third-Party Disclosure</h2>
            </div>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.8" }}>
              We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website and conducting our business (like Microsoft and Google), so long as those parties agree to keep this information confidential.
            </p>
          </section>
        </div>

        <div style={{ marginTop: "6rem", paddingTop: "3rem", borderTop: "1px solid var(--border-color)", textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            Last updated: May 15, 2026. If you have any questions, please contact our support team.
          </p>
        </div>
      </div>
    </main>
  );
}
