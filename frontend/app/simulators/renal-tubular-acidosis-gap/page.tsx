import { Metadata } from 'next';
import RenalTubularAcidosisSimulator from '@/components/simulators/RenalTubularAcidosisSimulator';

export const metadata: Metadata = {
  title: 'Renal Tubular Acidosis (RTA) & Urine Anion Gap Workstation | Mediverse',
  description:
    'Interactive Normal Anion Gap Metabolic Acidosis (NAGMA) solver, RTA Types 1, 2, and 4 differentiation, Urine Anion Gap (UAG), Urine Osmolal Gap (UOG), and precision alkali pharmacotherapy.',
};

export default function RenalTubularAcidosisPage() {
  return <RenalTubularAcidosisSimulator />;
}
