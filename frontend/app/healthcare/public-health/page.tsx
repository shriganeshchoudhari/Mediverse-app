import type { Metadata } from 'next';
import Link from 'next/link';
import { DomainPageLayout } from '../DomainPageLayout';

export const metadata: Metadata = {
  title: 'Public Health & Healthcare Administration | MPH MHA | Mediverse',
  description: 'MPH, MHA — epidemiology, biostatistics, Ayushman Bharat policy, hospital operations management, and global health governance frameworks on Mediverse.',
};

export default function PublicHealthPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold text-indigo-900 mb-4">Public Health & Healthcare Administration</h1>
        <p className="text-xl text-slate-400">Explore Master of Public Health (MPH) and Master of Hospital Administration (MHA) programs.</p>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Programs</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Link href="/healthcare/public-health/mph" className="block group">
            <div className="border border-indigo-200 rounded-xl p-6 bg-slate-900/90 text-slate-100 border-slate-800 shadow-xl shadow-sm hover:shadow-md transition-shadow group-hover:border-indigo-500">
              <h3 className="text-2xl font-bold text-indigo-700 mb-2">MPH</h3>
              <h4 className="text-lg font-medium text-slate-200 mb-3">Master of Public Health</h4>
              <p className="text-slate-400">Epidemiology, biostatistics, health policy, environmental health, and global health practice.</p>
            </div>
          </Link>
          <Link href="/healthcare/public-health/mha" className="block group">
            <div className="border border-indigo-200 rounded-xl p-6 bg-slate-900/90 text-slate-100 border-slate-800 shadow-xl shadow-sm hover:shadow-md transition-shadow group-hover:border-indigo-500">
              <h3 className="text-2xl font-bold text-indigo-700 mb-2">MHA</h3>
              <h4 className="text-lg font-medium text-slate-200 mb-3">Master of Hospital Administration</h4>
              <p className="text-slate-400">Hospital operations, financial management, HR, quality (NABH/JCI), and healthcare technology administration.</p>
            </div>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Interactive Simulators</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-indigo-950/20 text-indigo-300 border-indigo-800/40 p-6 rounded-xl border border-indigo-100">
            <h3 className="font-bold text-indigo-900 mb-2">Outbreak Simulator</h3>
            <p className="text-sm text-indigo-700">Epidemiological modeling and containment strategies.</p>
          </div>
          <div className="bg-indigo-950/20 text-indigo-300 border-indigo-800/40 p-6 rounded-xl border border-indigo-100">
            <h3 className="font-bold text-indigo-900 mb-2">Health Policy Simulator</h3>
            <p className="text-sm text-indigo-700">Test policy impacts on population health metrics.</p>
          </div>
          <div className="bg-indigo-950/20 text-indigo-300 border-indigo-800/40 p-6 rounded-xl border border-indigo-100">
            <h3 className="font-bold text-indigo-900 mb-2">Epi Data Analyzer</h3>
            <p className="text-sm text-indigo-700">Interactive biostatistics and data visualization.</p>
          </div>
          <div className="bg-indigo-950/20 text-indigo-300 border-indigo-800/40 p-6 rounded-xl border border-indigo-100">
            <h3 className="font-bold text-indigo-900 mb-2">Disaster Response Sim</h3>
            <p className="text-sm text-indigo-700">Resource allocation and triage during emergencies.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
