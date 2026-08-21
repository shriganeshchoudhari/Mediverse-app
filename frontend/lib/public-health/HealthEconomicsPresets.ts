export interface HealthEconomicsComparator {
  strategyA: {
    name: string;
    costInr: number;
    survivalYears: number;
    utilityQoL: number; // Quality of Life weight (0 to 1)
  };
  strategyB: {
    name: string;
    costInr: number;
    survivalYears: number;
    utilityQoL: number;
  };
}

export function calculateICER(comparator: HealthEconomicsComparator, gdpPerCapitaInr: number): {
  qalyA: number;
  qalyB: number;
  deltaQALY: number;
  deltaCostInr: number;
  icerInrPerQALY: number;
  costEffectivenessCategory: 'Highly Cost-Effective' | 'Cost-Effective' | 'Not Cost-Effective' | 'Dominant' | 'Dominated';
  recommendation: string;
} {
  const { strategyA, strategyB } = comparator;

  const qalyA = strategyA.survivalYears * strategyA.utilityQoL;
  const qalyB = strategyB.survivalYears * strategyB.utilityQoL;

  const deltaQALY = qalyA - qalyB;
  const deltaCostInr = strategyA.costInr - strategyB.costInr;

  // Handle case where deltaQALY is 0 to avoid division by zero
  const icerInrPerQALY = deltaQALY !== 0 ? deltaCostInr / deltaQALY : Infinity;

  let costEffectivenessCategory: 'Highly Cost-Effective' | 'Cost-Effective' | 'Not Cost-Effective' | 'Dominant' | 'Dominated';
  
  if (deltaCostInr < 0 && deltaQALY > 0) {
    costEffectivenessCategory = 'Dominant';
  } else if (deltaCostInr > 0 && deltaQALY < 0) {
    costEffectivenessCategory = 'Dominated';
  } else if (icerInrPerQALY < gdpPerCapitaInr) {
    costEffectivenessCategory = 'Highly Cost-Effective';
  } else if (icerInrPerQALY < 3 * gdpPerCapitaInr) {
    costEffectivenessCategory = 'Cost-Effective';
  } else {
    costEffectivenessCategory = 'Not Cost-Effective';
  }

  let recommendation = '';
  switch (costEffectivenessCategory) {
    case 'Dominant':
      recommendation = `Adopt Strategy A (${strategyA.name}) as it is cheaper and more effective than Strategy B (${strategyB.name}).`;
      break;
    case 'Dominated':
      recommendation = `Reject Strategy A (${strategyA.name}) as it is more expensive and less effective than Strategy B (${strategyB.name}).`;
      break;
    case 'Highly Cost-Effective':
      recommendation = `Strategy A (${strategyA.name}) is highly cost-effective compared to Strategy B (${strategyB.name}) (ICER < 1x GDP per capita).`;
      break;
    case 'Cost-Effective':
      recommendation = `Strategy A (${strategyA.name}) is cost-effective compared to Strategy B (${strategyB.name}) (ICER < 3x GDP per capita).`;
      break;
    case 'Not Cost-Effective':
      recommendation = `Strategy A (${strategyA.name}) is not cost-effective compared to Strategy B (${strategyB.name}) at the current willingness-to-pay threshold.`;
      break;
  }

  return {
    qalyA,
    qalyB,
    deltaQALY,
    deltaCostInr,
    icerInrPerQALY,
    costEffectivenessCategory,
    recommendation
  };
}
