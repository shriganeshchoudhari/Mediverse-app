import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Allied Health Sciences | Perfusion Radiology OT | Mediverse',
  description: 'B.Sc Perfusion, Radiology, OT Technology — ECMO/CPB circuit simulation, CT/MRI 3D slice explorer, and operating theatre workflow modules on Mediverse.',
};

export default function AlliedPage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-extrabold mb-4 text-orange-600">Allied Health Sciences Portal</h1>
      <p className="text-lg text-gray-700 mb-8">
        High-technology allied health programs training specialist paramedical teams for modern hospitals.
      </p>

      <h2 className="text-2xl font-bold mb-4">Undergraduate Programs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Link href="/healthcare/allied/curriculum?major=BSCPERF" className="block border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold text-blue-800 mb-2">B.Sc Perfusion Technology</h3>
          <p className="text-sm text-gray-600">Cardiopulmonary bypass, ECMO, and intra-aortic balloon pump management.</p>
        </Link>
        <Link href="/healthcare/allied/curriculum?major=BSCRIT" className="block border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold text-green-800 mb-2">B.Sc Radiology & Imaging</h3>
          <p className="text-sm text-gray-600">X-ray, CT, MRI, ultrasound, nuclear medicine imaging principles.</p>
        </Link>
        <Link href="/healthcare/allied/curriculum?major=BSCOTT" className="block border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold text-purple-800 mb-2">B.Sc OT & Anaesthesia</h3>
          <p className="text-sm text-gray-600">Operation theatre instrumentation, anesthesia workstations, and sterile processing.</p>
        </Link>
        <Link href="/healthcare/allied/curriculum?major=BSCDIAL" className="block border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold text-red-800 mb-2">B.Sc Renal Dialysis</h3>
          <p className="text-sm text-gray-600">Hemodialysis, CRRT, peritoneal dialysis, and water treatment systems.</p>
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-4">High-Tech Clinical Simulators</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-6 rounded-lg shadow-sm border border-blue-200">
          <h3 className="text-xl font-bold mb-2">ECMO / CPB Circuit Simulation</h3>
          <p className="mb-4 text-sm">Interactive 3D circuit priming, oxygenator assembly, and pump control.</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Launch Simulator</button>
        </div>
        <div className="bg-gradient-to-r from-green-100 to-green-50 p-6 rounded-lg shadow-sm border border-green-200">
          <h3 className="text-xl font-bold mb-2">CT / MRI 3D Slice Explorer</h3>
          <p className="mb-4 text-sm">Volumetric rendering of DICOM datasets with interactive slice navigation.</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded">Launch Explorer</button>
        </div>
        <div className="bg-gradient-to-r from-purple-100 to-purple-50 p-6 rounded-lg shadow-sm border border-purple-200">
          <h3 className="text-xl font-bold mb-2">Operation Theatre Workflow</h3>
          <p className="mb-4 text-sm">Sterile processing, anesthesia machine checks, and surgical instrumentation.</p>
          <button className="bg-purple-600 text-white px-4 py-2 rounded">Launch Workflow</button>
        </div>
        <div className="bg-gradient-to-r from-red-100 to-red-50 p-6 rounded-lg shadow-sm border border-red-200">
          <h3 className="text-xl font-bold mb-2">Dialysis Machine Setup Protocol</h3>
          <p className="mb-4 text-sm">Extracorporeal circuit setup, clearance monitoring, and alarm troubleshooting.</p>
          <button className="bg-red-600 text-white px-4 py-2 rounded">Launch Protocol</button>
        </div>
      </div>
    </div>
  );
}
