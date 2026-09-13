import React from "react";
import { Metadata } from "next";
import AccidentalHypothermiaSimulator from "../../../components/simulators/AccidentalHypothermiaSimulator";

export const metadata: Metadata = {
  title: "Accidental Hypothermia & ECLS Rewarming Workstation | Mediverse",
  description:
    "Interactive critical care simulation for severe accidental hypothermia, Swiss clinical staging (HT I-IV), warm and dead rule (32-35°C), afterdrop biophysics, Osborn (J) wave arrhythmias, modified ACLS, and extracorporeal VA-ECMO rewarming with HOPE score.",
};


export const dynamic = 'force-static';
export default function AccidentalHypothermiaPage() {
  return <AccidentalHypothermiaSimulator />;
}
