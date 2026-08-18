import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ClinicalPg10LabViewer } from "@/components/pg10/ClinicalPg10LabViewer";

export const metadata: Metadata = {
  title: "PG-610: Advanced Psychiatry & Interventional Neuromodulation | Mediverse",
  description:
    "Postgraduate residency interactive laboratory covering Treatment-Resistant Depression, ECT & rTMS Neuromodulation, Catatonia, NMS & Serotonin Syndrome, Clozapine ANC REMS, and Bipolar Mania Lithium Resuscitation."
};

export default function PostgraduatePsychiatryLabPage() {
  return (
    <main style={{ minHeight: "100vh", padding: "2rem 1.5rem", background: "#0b0f19" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
              <Link href="/curriculum" style={{ color: "#38bdf8", textDecoration: "none", fontSize: "0.875rem" }}>
                &larr; Return to Curriculum
              </Link>
              <span style={{ color: "#64748b" }}>/</span>
              <span style={{ color: "#94a3b8", fontSize: "0.875rem" }}>Semester 10 &bull; Postgraduate Residency</span>
            </div>
            <h1 style={{ color: "#f8fafc", fontSize: "2rem", fontWeight: "800", margin: 0 }}>
              PG-610: Advanced Psychiatry, Neuropsychiatry &amp; Interventional Neuromodulation
            </h1>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Link
              href="/lessons/fa750005-0000-0000-0000-000000000001"
              style={{
                background: "#0284c7",
                color: "#ffffff",
                padding: "0.6rem 1.2rem",
                borderRadius: "0.5rem",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "0.9rem"
              }}
            >
              📖 Open Psychiatry Curriculum Lessons
            </Link>
          </div>
        </div>

        <ClinicalPg10LabViewer />
      </div>
    </main>
  );
}
