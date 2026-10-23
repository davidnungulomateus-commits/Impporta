import type { Metadata } from "next";
import "./globals.css";
import AppLayoutShell from "@/components/Layout/AppLayoutShell";
import { ProfileProvider } from "@/context/ProfileContext";
import { DealProvider } from "@/context/DealContext";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "Empresa de Limpeza Profissional Lisboa, Cascais, Oeiras & Sintra | Impporta",
  description: "Limpeza profissional para empresas, escritórios, supermercados, restaurantes, alojamento local e condomínios em Lisboa, Cascais, Oeiras e Sintra.",
  keywords: [
    "empresa de limpeza Lisboa",
    "limpeza profissional Cascais",
    "limpeza de escritórios Oeiras",
    "limpeza de supermercados Sintra",
    "limpeza de restaurantes Lisboa",
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
      { url: '/icon.svg?v=3', type: 'image/svg+xml' },
      { url: '/favicon.ico?v=3', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png?v=3', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: "Impporta | Limpeza profissional para empresas e propriedades",
    description: "Equipas profissionais para escritórios, supermercados, restaurantes, alojamento local, condomínios e limpezas profundas.",
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
      <body suppressHydrationWarning style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
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
