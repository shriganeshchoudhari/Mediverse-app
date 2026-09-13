import React from 'react';
import type { Metadata } from 'next';
import PheochromocytomaSimulator from '@/components/simulators/PheochromocytomaSimulator';

export const metadata: Metadata = {
  title: 'Pheochromocytoma & Paraganglioma (PPGL) Workstation | Mediverse',
  description: 'Interactive endocrinology and anesthesiology simulator: The Alpha-Blocker First Rule (avoiding unopposed alpha-1 disaster), Roizen Preoperative Criteria, intraoperative catecholamine storm vs post-ligation vasoplegic collapse, plasma free metanephrines, and SDHB/VHL/RET genetics.',
  openGraph: {
    title: 'Pheochromocytoma & Paraganglioma (PPGL) Workstation | Mediverse',
    description: 'Interactive endocrinology and anesthesiology simulator: The Alpha-Blocker First Rule (avoiding unopposed alpha-1 disaster), Roizen Preoperative Criteria, intraoperative catecholamine storm vs post-ligation vasoplegic collapse, plasma free metanephrines, and SDHB/VHL/RET genetics.',
    url: 'https://mediverse.app/simulators/pheochromocytoma-alpha-blockade',
    siteName: 'Mediverse Medical Simulation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pheochromocytoma & Paraganglioma (PPGL) Workstation | Mediverse',
    description: 'Interactive endocrinology and anesthesiology simulator: The Alpha-Blocker First Rule (avoiding unopposed alpha-1 disaster), Roizen Preoperative Criteria, intraoperative catecholamine storm vs post-ligation vasoplegic collapse, plasma free metanephrines, and SDHB/VHL/RET genetics.',
  },
};


export const dynamic = 'force-static';
export default function PheochromocytomaPage() {
  return <PheochromocytomaSimulator />;
}
