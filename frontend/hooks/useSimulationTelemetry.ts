import { useCallback, useRef } from 'react';
import { recordSimulationRun } from '@/lib/simulations/simulationPersistence';

export interface UseSimulationTelemetryOptions {
  throttleMs?: number;
}

/**
 * Enterprise Clinical Simulation Telemetry Hook
 * 
 * Provides throttled, non-blocking telemetry recording of student clinical encounters,
 * physiological interventions, diagnostic decisions, and learning outcomes to the backend
 * (POST /api/v1/simulations).
 */
export function useSimulationTelemetry(
  simulationType: string,
  options: UseSimulationTelemetryOptions = {}
) {
  const { throttleMs = 3000 } = options;
  const lastRecordedRef = useRef<number>(0);

  const logSession = useCallback(
    async (
      inputParameters: Record<string, any>,
      outcomeMetrics: Record<string, any>,
      force: boolean = false
    ): Promise<boolean> => {
      const now = Date.now();
      if (!force && now - lastRecordedRef.current < throttleMs) {
        return false;
      }
      lastRecordedRef.current = now;
      return recordSimulationRun(simulationType, inputParameters, outcomeMetrics);
    },
    [simulationType, throttleMs]
  );

  return { logSession };
}

export default useSimulationTelemetry;
