/**
 * Utility to record student clinical simulation runs and telemetry to the backend
 */
export async function recordSimulationRun(
  simulationType: string,
  inputParameters: Record<string, any>,
  outcomeMetrics: Record<string, any>
): Promise<boolean> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch('/api/v1/simulations', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        simulationType,
        inputParameters: JSON.stringify(inputParameters),
        outcomeMetrics: JSON.stringify(outcomeMetrics),
      }),
    });

    return res.ok;
  } catch (err) {
    // Non-blocking telemetry failure
    console.warn(`[SimulationTelemetry] Failed to persist ${simulationType} run:`, err);
    return false;
  }
}
