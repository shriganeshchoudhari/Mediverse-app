export interface DialysisPrescription {
    bloodFlowRateMlMin: number;
    dialysateFlowRateMlMin: number;
    durationHours: number;
    patientDryWeightKg: number;
    preBUNMgDl: number;
    postBUNMgDl: number;
    ultrafiltrationGoalL: number;
}

export function calculateKtV(preBUN: number, postBUN: number, durationHours: number, ultrafiltrationL: number, postWeightKg: number): { ktV: number; urrPct: number; isAdequate: boolean; interpretation: string } {
    // Daugirdas single-pool formula
    const R = postBUN / preBUN;
    const urr = (1 - R) * 100;
    const spKtV = -Math.log(R - 0.008 * durationHours) + (4 - 3.5 * R) * (ultrafiltrationL / postWeightKg);
    const isAdequate = spKtV >= 1.2;
    
    return {
        ktV: Number(spKtV.toFixed(2)),
        urrPct: Number(urr.toFixed(1)),
        isAdequate,
        interpretation: isAdequate ? 'Dialysis dose is adequate (spKt/V >= 1.2)' : 'Dialysis dose is inadequate (spKt/V < 1.2), consider adjusting prescription'
    };
}

export interface CRRTMode {
    mode: 'CVVH' | 'CVVHD' | 'CVVHDF' | 'SCUF';
    name: string;
    primaryMechanism: 'Convection' | 'Diffusion' | 'Both' | 'Ultrafiltration only';
    indications: string[];
}

export const CRRT_MODES: CRRTMode[] = [
    {
        mode: 'CVVH',
        name: 'Continuous Venovenous Hemofiltration',
        primaryMechanism: 'Convection',
        indications: ['Severe uremia', 'Volume overload', 'Middle molecule clearance']
    },
    {
        mode: 'CVVHD',
        name: 'Continuous Venovenous Hemodialysis',
        primaryMechanism: 'Diffusion',
        indications: ['Small molecule clearance', 'Severe acidosis', 'Hyperkalemia']
    },
    {
        mode: 'CVVHDF',
        name: 'Continuous Venovenous Hemodiafiltration',
        primaryMechanism: 'Both',
        indications: ['Combined indications needing maximum clearance', 'Septic shock with AKI']
    },
    {
        mode: 'SCUF',
        name: 'Slow Continuous Ultrafiltration',
        primaryMechanism: 'Ultrafiltration only',
        indications: ['Diuretic-resistant heart failure', 'Pure volume overload without significant uremia']
    }
];
