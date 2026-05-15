"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import styles from "../page.module.css";
import { useEffect } from "react";

export default function SuccessPage() {
  // Ensure the theme is consistent with the landing page
  useEffect(() => {
    const savedTheme = document.documentElement.getAttribute("data-theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  return (
    <main className={styles.main} style={{ justifyContent: "center", alignItems: "center", padding: "2rem" }}>
      <div className={styles.heroBackground}></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={styles.visualCard}
        style={{ maxWidth: "500px", textAlign: "center", padding: "3rem 2rem", position: "relative", zIndex: 10 }}
      >
        <div className={styles.successIcon} style={{ margin: "0 auto 1.5rem" }}>
          <ShieldCheck size={48} />
        </div>
        
        <h1 className={styles.heroTitle} style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          Registration <span className="text-gradient">Successful</span>
        </h1>
        
        <p className={styles.heroDescription} style={{ marginBottom: "2rem", fontSize: "1.125rem" }}>
          Your request for access to the Impporta platform has been received. 
          Our team will review your details and send an invitation link to your inbox shortly.
        </p>
        
        <Link href="/" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          <ArrowLeft size={18} /> Return to Home
        </Link>
        
        <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border-color)", fontSize: "0.875rem", opacity: 0.6 }}>
          You can now close this tab.
        </div>
      </motion.div>
    </main>
  );
}
