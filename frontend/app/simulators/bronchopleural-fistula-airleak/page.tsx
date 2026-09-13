import React from "react";
import { Metadata } from "next";
import BronchopleuralFistulaSimulator from "../../../components/simulators/BronchopleuralFistulaSimulator";

export const metadata: Metadata = {
  title: "Bronchopleural Fistula & Air Leak Workstation | Mediverse",
  description: "Interactive pulmonology & thoracic critical care simulation for bronchopleural fistula (BPF) and persistent air leak (PAL), Cerfolio classification (C/I/E/F), ventilatory steal mechanics, dual-ventilator independent lung ventilation (ILV), pleural suction dilemma, and one-way endobronchial valves (EBV).",
  openGraph: {
    title: "Bronchopleural Fistula & Air Leak Workstation | Mediverse",
    description: "Interactive pulmonology & thoracic critical care simulation for bronchopleural fistula (BPF) and persistent air leak (PAL), Cerfolio classification (C/I/E/F), ventilatory steal mechanics, dual-ventilator independent lung ventilation (ILV), pleural suction dilemma, and one-way endobronchial valves (EBV).",
    url: 'https://mediverse.app/simulators/bronchopleural-fistula-airleak',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Bronchopleural Fistula & Air Leak Workstation | Mediverse",
    description: "Interactive pulmonology & thoracic critical care simulation for bronchopleural fistula (BPF) and persistent air leak (PAL), Cerfolio classification (C/I/E/F), ventilatory steal mechanics, dual-ventilator independent lung ventilation (ILV), pleural suction dilemma, and one-way endobronchial valves (EBV).",
  },
};


export const dynamic = 'force-static';
export default function BronchopleuralFistulaPage() {
  return <BronchopleuralFistulaSimulator />;
}
