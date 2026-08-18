import React from "react";
import MedicalSubjectsExplorer from "../../components/curriculum/MedicalSubjectsExplorer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medical Curriculum Scaffold | Mediverse",
  description: "Explore all 19 medical subjects across Pre-Clinical, Para-Clinical, Clinical, and Transversal AETCOM tiers.",
};

export default function SubjectsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <main className="flex-1">
        <MedicalSubjectsExplorer />
      </main>
    </div>
  );
}
