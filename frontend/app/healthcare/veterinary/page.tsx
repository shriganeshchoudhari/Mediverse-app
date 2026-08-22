import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Veterinary & Comparative Medicine | Mediverse',
  description: 'Veterinary education portal featuring BVSc and MVSc programs, and advanced clinical simulators.',
};

export default function VeterinaryDomainPortal() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      <header className="text-center py-10 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl">
        <div className="text-5xl mb-4">🐾</div>
        <h1 className="text-4xl font-extrabold text-green-900 mb-4">Veterinary & Comparative Medicine</h1>
        <p className="text-lg text-green-800 max-w-3xl mx-auto">
          Comprehensive veterinary education covering small and large animal medicine, comparative anatomy, zoonotic diseases, and One Health epidemiology.
        </p>
      </header>

      <section>
        <h2 className="text-2xl font-bold text-white font-bold mb-6 border-b pb-2">Academic Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/healthcare/veterinary/bvsc" className="group block border rounded-xl p-6 hover:shadow-lg transition bg-slate-900/90 text-slate-100 border-slate-800 shadow-xl">
            <h3 className="text-2xl font-bold text-green-700 group-hover:text-green-800 mb-2">BVSc & AH</h3>
            <p className="text-slate-400 mb-4">Bachelor of Veterinary Science & Animal Husbandry. The 5.5-year foundational degree.</p>
            <span className="inline-flex items-center text-green-600 font-medium">
              Explore Curriculum <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </span>
          </Link>
          <Link href="/healthcare/veterinary/mvsc" className="group block border rounded-xl p-6 hover:shadow-lg transition bg-slate-900/90 text-slate-100 border-slate-800 shadow-xl">
            <h3 className="text-2xl font-bold text-indigo-700 group-hover:text-indigo-800 mb-2">MVSc</h3>
            <p className="text-slate-400 mb-4">Master of Veterinary Science. 2-year postgraduate specializations in medicine, surgery, pathology, etc.</p>
            <span className="inline-flex items-center text-indigo-600 font-medium">
              Explore Specialties <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </span>
          </Link>
        </div>
      </section>

      <section className="bg-slate-950/60 text-slate-300 border-slate-800 p-8 rounded-xl">
        <h2 className="text-2xl font-bold text-white font-bold mb-6">Advanced Clinical Simulators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900/90 text-slate-100 border-slate-800 shadow-xl p-5 rounded-lg border shadow-sm flex flex-col items-center text-center">
            <div className="text-3xl mb-3">🦴</div>
            <h4 className="font-bold text-white font-bold mb-2">Comparative Anatomy 3D</h4>
            <p className="text-sm text-slate-400 mb-4">Interactive 3D models comparing human and veterinary anatomy.</p>
            <button className="mt-auto px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 w-full">Launch</button>
          </div>
          <div className="bg-slate-900/90 text-slate-100 border-slate-800 shadow-xl p-5 rounded-lg border shadow-sm flex flex-col items-center text-center">
            <div className="text-3xl mb-3">🦠</div>
            <h4 className="font-bold text-white font-bold mb-2">Rumen Fermentation Sim</h4>
            <p className="text-sm text-slate-400 mb-4">Physiological solver for ruminant digestion.</p>
            <button className="mt-auto px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 w-full">Launch</button>
          </div>
          <div className="bg-slate-900/90 text-slate-100 border-slate-800 shadow-xl p-5 rounded-lg border shadow-sm flex flex-col items-center text-center">
            <div className="text-3xl mb-3">🌍</div>
            <h4 className="font-bold text-white font-bold mb-2">Zoonotic Outbreak Tracker</h4>
            <p className="text-sm text-slate-400 mb-4">One Health epidemiology investigation module.</p>
            <button className="mt-auto px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 w-full">Launch</button>
          </div>
          <div className="bg-slate-900/90 text-slate-100 border-slate-800 shadow-xl p-5 rounded-lg border shadow-sm flex flex-col items-center text-center">
            <div className="text-3xl mb-3">🩺</div>
            <h4 className="font-bold text-white font-bold mb-2">Surgical Maneuvers VR</h4>
            <p className="text-sm text-slate-400 mb-4">Virtual practice for common veterinary surgeries.</p>
            <button className="mt-auto px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 w-full">Launch</button>
          </div>
        </div>
      </section>
    </div>
  );
}
