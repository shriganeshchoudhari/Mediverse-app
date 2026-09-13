import React from 'react';
import { Metadata } from 'next';
import OncologyGenomicsSimulator from '@/components/simulators/OncologyGenomicsSimulator';

export const metadata: Metadata = {
  title: 'Clinical Genomics, Somatic Oncology NGS & Precision Targeted Therapy | Mediverse',
  description: 'Precision molecular oncology workstation modeling next-generation sequencing (NGS) gene panels, Variant Allele Fraction (VAF %) deconvolution, AMP/ASCO/CAP 4-tier actionability, and targeted TKI clonal resistance dynamics.'
};

export const dynamic = 'force-static';

export default function OncologyGenomicsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <OncologyGenomicsSimulator />
    </main>
  );
}
