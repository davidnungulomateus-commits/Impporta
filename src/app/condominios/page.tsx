import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Limpeza de Condomínios Lisboa, Cascais, Oeiras & Sintra | Impporta AL",
  description: "Limpeza profissional de partes comuns, escadas, halls e elevadores para condomínios em Lisboa, Cascais, Oeiras e Sintra. Preço transparente a €11/hora com simulador de custos instantâneo.",
  keywords: [
    "limpeza de condomínios Lisboa",
    "limpeza de prédios Lisboa",
    "limpeza escadas e hall",
    "limpeza partes comuns condomínio",
    "limpeza condomínio Cascais",
    "limpeza prédio Oeiras",
    "limpeza condomínio Sintra",
    "serviço limpeza condomínio"
  ],
  openGraph: {
    title: "Limpeza de Condomínios Lisboa & Arredores | Simulador de Preço Instantâneo",
    description: "Limpeza profissional de partes comuns para condomínios. Preço transparente por hora com simulador online.",
    locale: "pt_PT",
    type: "website",
  }
};

import CondominiosPage from '@/components/Condominios/CondominiosPage';

export default function CondominiosRoute() {
  return <CondominiosPage />;
}
