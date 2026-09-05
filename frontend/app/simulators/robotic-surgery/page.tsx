import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Activity,
  Wind,
  Zap,
  Gauge,
  ShieldAlert,
  Cpu,
  Scissors
} from 'lucide-react';
import RoboticSurgerySimulator from '@/components/simulators/RoboticSurgerySimulator';

export const metadata: Metadata = {
  title: 'Minimally Invasive Surgery & Robotic Laparoscopy Workstation | Mediverse',
  description:
    'High-fidelity simulation of da Vinci robotic surgery, EndoWrist 7-DOF kinematics, CO2 pneumoperitoneum hemodynamics, steep Trendelenburg respiratory mechanics, electrosurgical thermal spread, and laparoscopic emergencies.',
};

export default function RoboticSurgeryPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Navigation & Status Badges */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/simulators"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Clinical Simulators
          </Link>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              SURGICAL ROBOTICS &amp; ENDOSURGERY
            </span>
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
              PNEUMOPERITONEUM BIOPHYSICS
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
              SAGES / ACS SURGICAL STANDARDS
            </span>
          </div>
        </div>

        {/* Main Workstation Interactive Component */}
        <RoboticSurgerySimulator />

        {/* High-Yield Board Review & Curriculum Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Card 1: Pneumoperitoneum Physiology & Gas Hemodynamics */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-emerald-400">
              <Wind className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Pneumoperitoneum &amp; Gas Hemodynamics
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-emerald-300 font-semibold block mb-0.5">
                  Safe Operating Pressures (12 - 15 mmHg):
                </strong>
                CO2 is selected for its high blood solubility (20× higher than nitrogen) and low combustion risk. Insufflation pressures above 15 mmHg compress the inferior vena cava (IVC) and renal parenchyma, decreasing venous return, cardiac output, and urine production.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-emerald-300 font-semibold block mb-0.5">
                  Diaphragmatic Splinting &amp; Compliance:
                </strong>
                Cephalad displacement of the diaphragm by pressurized abdominal gas decreases dynamic lung compliance (Crs) and Functional Residual Capacity (FRC). Peak airway pressures rise proportionally: Ppeak = Pbaseline + 1.25 × (IAP - 8).
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-emerald-300 font-semibold block mb-0.5">
                  Steep Trendelenburg (-30°) Physiological Stress:
                </strong>
                Required in pelvic surgery (RARP, hysterectomy) to clear bowel out of the true pelvis. Prolonged steep tilt causes severe facial, pharyngeal, and laryngeal edema, and increases intracranial/intraocular pressure (risk of ischemic optic neuropathy).
              </li>
            </ul>
          </div>

          {/* Card 2: EndoWrist Kinematics & Energy Safety */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-cyan-400">
              <Scissors className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                EndoWrist Kinematics &amp; Energy Safety
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-cyan-300 font-semibold block mb-0.5">
                  7 Degrees of Freedom (EndoWrist):
                </strong>
                Unlike rigid straight laparoscopic tools with only 4 degrees of freedom (fulcrum effect), robotic EndoWrist instruments reproduce natural human wrist movement (pitch, yaw, roll, grip, insertion, tilt, rotation) inside tight anatomical spaces.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-cyan-300 font-semibold block mb-0.5">
                  Motion Scaling &amp; Tremor Filtration:
                </strong>
                Motion scaling (1:1, 2:1, 3:1) translates a 3 cm hand excursion into a 1 cm micro-movement at the tissue level. Electronic tremor filters remove the surgeon&apos;s natural 6-10 Hz resting physiological hand tremors.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-cyan-300 font-semibold block mb-0.5">
                  Capacitive Coupling &amp; Insulation Failure:
                </strong>
                Monopolar coagulation mode uses high peak voltages (up to 4000V) that can jump across micro-cracks in insulation or induce electrical charge in adjacent metal trocars. Bipolar and Ultrasonic shears restrict thermal injury to 1.0 - 1.5 mm.
              </li>
            </ul>
          </div>

          {/* Card 3: Surgical Emergencies & Strasberg Criteria */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Surgical Emergencies &amp; Strasberg CVS
              </h2>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 font-semibold block mb-0.5">
                  Acute CO2 Venous Gas Embolism:
                </strong>
                Caused by gas entrainment through injured deep veins. Hallmarks: sudden precipitous drop in EtCO2 (&lt;20 mmHg), &quot;mill-wheel&quot; cardiac murmur, and acute shock. Emergency treatment: halt insufflation, 100% FiO2, and Durant&apos;s maneuver (steep Left Lateral Decubitus + Trendelenburg).
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 font-semibold block mb-0.5">
                  Critical View of Safety (Strasberg Criteria):
                </strong>
                To prevent catastrophic common bile duct transection (Strasberg E): (1) hepatocystic triangle cleared of fat/fibrous tissue, (2) lower third of gallbladder separated from liver bed, (3) exactly TWO structures seen entering the gallbladder base.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-amber-300 font-semibold block mb-0.5">
                  Warm Ischemia Time (WIT) in Partial Nephrectomy:
                </strong>
                Hilar bulldog clamping stops renal blood flow. Cellular hypoxia sets in immediately; warm ischemia exceeding 25 minutes causes irreversible loss of functional nephron mass and chronic renal impairment.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
