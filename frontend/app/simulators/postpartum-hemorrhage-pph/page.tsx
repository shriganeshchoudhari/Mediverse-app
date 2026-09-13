import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PostpartumHemorrhageSimulator } from '../../../components/simulators/PostpartumHemorrhageSimulator';

export const metadata: Metadata = {
  title: 'Postpartum Hemorrhage (PPH) & Bakri Tamponade Simulator | Mediverse',
  description: 'CMQCC / ACOG 4-stage obstetric hemorrhage simulation: quantitative blood loss (QBL), maternal shock index, contraindication-guarded uterotonics, and Bakri intrauterine balloon tamponade.',
  openGraph: {
    title: 'Postpartum Hemorrhage (PPH) & Bakri Tamponade Simulator | Mediverse',
    description: 'CMQCC / ACOG 4-stage obstetric hemorrhage simulation: quantitative blood loss (QBL), maternal shock index, contraindication-guarded uterotonics, and Bakri intrauterine balloon tamponade.',
    url: 'https://mediverse.app/simulators/postpartum-hemorrhage-pph',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Postpartum Hemorrhage (PPH) & Bakri Tamponade Simulator | Mediverse',
    description: 'CMQCC / ACOG 4-stage obstetric hemorrhage simulation: quantitative blood loss (QBL), maternal shock index, contraindication-guarded uterotonics, and Bakri intrauterine balloon tamponade.',
  },
};


export const dynamic = 'force-static';
export default function PostpartumHemorrhagePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
        <Link
          href="/simulators"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-rose-400 transition mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Clinical Simulators Catalog
        </Link>
      </div>
      <PostpartumHemorrhageSimulator />
    </main>
  );
}
