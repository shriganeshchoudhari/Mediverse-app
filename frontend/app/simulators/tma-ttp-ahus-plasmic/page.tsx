import React from "react";
import { Metadata } from "next";
import TmaTtpAhusSimulator from "../../../components/simulators/TmaTtpAhusSimulator";

export const metadata: Metadata = {
  title: "TMA Workstation: TTP vs aHUS & PLASMIC Solver | Mediverse",
  description: "Interactive clinical hematology & critical care simulation for thrombotic microangiopathies: TTP vs aHUS vs STEC-HUS, PLASMIC score (0-7), ADAMTS13 kinetics, alternative complement C5b-9 overactivation, platelet transfusion contraindication hazard, and emergent TPE, Caplacizumab, and Eculizumab therapy.",
  openGraph: {
    title: "TMA Workstation: TTP vs aHUS & PLASMIC Solver | Mediverse",
    description: "Interactive clinical hematology & critical care simulation for thrombotic microangiopathies: TTP vs aHUS vs STEC-HUS, PLASMIC score (0-7), ADAMTS13 kinetics, alternative complement C5b-9 overactivation, platelet transfusion contraindication hazard, and emergent TPE, Caplacizumab, and Eculizumab therapy.",
    url: 'https://mediverse.app/simulators/tma-ttp-ahus-plasmic',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "TMA Workstation: TTP vs aHUS & PLASMIC Solver | Mediverse",
    description: "Interactive clinical hematology & critical care simulation for thrombotic microangiopathies: TTP vs aHUS vs STEC-HUS, PLASMIC score (0-7), ADAMTS13 kinetics, alternative complement C5b-9 overactivation, platelet transfusion contraindication hazard, and emergent TPE, Caplacizumab, and Eculizumab therapy.",
  },
};


export const dynamic = 'force-static';
export default function TmaTtpAhusPage() {
  return <TmaTtpAhusSimulator />;
}
