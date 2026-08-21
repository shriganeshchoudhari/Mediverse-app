export type CircuitType = 'cpb' | 'va-ecmo' | 'vv-ecmo';

export interface ECMICircuitConfig {
    type: CircuitType;
    name: string;
    indication: string;
    cannulationSites: { drainage: string; return: string };
    targetFlowLMin: { min: number; max: number };
    targetSweepGasLMin: { min: number; max: number };
    targetACTSec: { min: number; max: number };
    criticalAlerts: string[];
}

export const ECMO_CIRCUIT_CONFIGS: ECMICircuitConfig[] = [
    {
        type: 'cpb',
        name: 'Cardiopulmonary Bypass',
        indication: 'Open heart surgery, complete cardiopulmonary support',
        cannulationSites: { drainage: 'Right Atrium/Vena Cava', return: 'Ascending Aorta' },
        targetFlowLMin: { min: 2.0, max: 2.4 }, // Based on CI * BSA
        targetSweepGasLMin: { min: 2.0, max: 4.0 },
        targetACTSec: { min: 400, max: 480 },
        criticalAlerts: ['Air in venous line', 'Low reservoir level', 'High arterial line pressure']
    },
    {
        type: 'va-ecmo',
        name: 'Veno-Arterial ECMO',
        indication: 'Cardiogenic shock, cardiac arrest (E-CPR)',
        cannulationSites: { drainage: 'Femoral Vein', return: 'Femoral Artery' },
        targetFlowLMin: { min: 3.0, max: 5.0 },
        targetSweepGasLMin: { min: 2.0, max: 5.0 },
        targetACTSec: { min: 160, max: 200 },
        criticalAlerts: ['Limb ischemia', 'Harlequin syndrome', 'Pump thrombosis']
    },
    {
        type: 'vv-ecmo',
        name: 'Veno-Venous ECMO',
        indication: 'Severe ARDS, isolated respiratory failure',
        cannulationSites: { drainage: 'Femoral Vein', return: 'Internal Jugular Vein' },
        targetFlowLMin: { min: 4.0, max: 6.0 },
        targetSweepGasLMin: { min: 4.0, max: 8.0 },
        targetACTSec: { min: 160, max: 200 },
        criticalAlerts: ['Recirculation', 'Hypoxemia despite maximal support', 'Circuit rupture']
    }
];

export function calculateCPBFlow(bsaM2: number, cardiacIndex: number): number {
    return bsaM2 * cardiacIndex;
}

export function estimateBloodGas(flowLMin: number, sweepLMin: number, fdO2Pct: number): { paO2MmHg: number; paCO2MmHg: number; pH: number; status: string } {
    let paO2MmHg = (fdO2Pct / 100) * 500;
    let paCO2MmHg = sweepLMin > 0 ? 40 * (4.0 / sweepLMin) : 100;
    let pH = 7.4 - (paCO2MmHg - 40) * 0.008;

    let status = 'Normal';
    if (pH < 7.35) status = 'Acidotic';
    if (pH > 7.45) status = 'Alkalotic';

    return {
        paO2MmHg: Math.max(0, paO2MmHg),
        paCO2MmHg: Math.max(0, paCO2MmHg),
        pH: pH,
        status
    };
}
