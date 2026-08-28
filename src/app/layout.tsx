import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppLayoutShell from "@/components/Layout/AppLayoutShell";
import { ProfileProvider } from "@/context/ProfileContext";
import { DealProvider } from "@/context/DealContext";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Limpeza Alojamento Local Lisboa | Turnover Cleaning for Airbnb Hosts",
  description: "Turnover cleaning in Lisbon engineered for 1–5 unit Airbnb & AL hosts. 100% photo-verified, insured cleaners, damage reporting. Claim your first clean free.",
  keywords: [
    "limpeza alojamento local Lisboa",
    "limpeza Airbnb Lisboa",
    "turnover cleaning Lisboa",
    "short term rental cleaning Lisbon",
    "limpeza AL Lisboa"
  ],
  openGraph: {
    title: "Limpeza Alojamento Local Lisboa | First Clean Free for Airbnb Hosts",
    description: "Revenue protection cleaning for Lisbon Airbnb & AL hosts. 100% photo-verified checkouts, damage reports, no lock-in contracts.",
    locale: "pt_PT",
    type: "website",
  }
};

const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('impporta-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', t);
  } catch(e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} suppressHydrationWarning />
      </head>
      <body style={{ fontFamily: 'Inter, sans-serif' }}>
        <ThemeProvider>
          <ProfileProvider>
            <DealProvider>
              <AppLayoutShell>
                {children}
              </AppLayoutShell>
            </DealProvider>
          </ProfileProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
