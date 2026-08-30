import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppLayoutShell from "@/components/Layout/AppLayoutShell";
import { ProfileProvider } from "@/context/ProfileContext";
import { DealProvider } from "@/context/DealContext";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Limpeza Alojamento Local Lisboa, Cascais, Oeiras & Sintra | Airbnb Turnover Cleaning",
  description: "Limpeza de turnover para Alojamento Local e Airbnb em Lisboa, Cascais, Oeiras e Sintra. 100% verificado por fotos, relatórios de danos e 1ª limpeza gratuita.",
  keywords: [
    "limpeza alojamento local Lisboa",
    "limpeza Airbnb Cascais",
    "limpeza AL Oeiras",
    "turnover cleaning Sintra",
    "limpeza alojamento local Sintra",
    "short term rental cleaning Lisbon Cascais",
    "limpeza AL Estoril Carcavelos"
  ],
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: "Limpeza Alojamento Local Lisboa, Cascais, Oeiras & Sintra | 1ª Limpeza Grátis",
    description: "Proteção de receita e turnover profissional para anfitriões de AL em Lisboa, Cascais, Oeiras e Sintra.",
    locale: "pt_PT",
    type: "website",
  }
};

const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('impporta-theme') || 'light';
    document.documentElement.setAttribute('data-theme', t);
  } catch(e) {
    document.documentElement.setAttribute('data-theme', 'light');
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
      <body suppressHydrationWarning style={{ fontFamily: 'Inter, sans-serif' }}>
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
