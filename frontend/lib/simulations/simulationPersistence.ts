/**
 * Utility to record student clinical simulation runs and telemetry to the backend
 */
import { getCookie } from '../utils/cookies';

export async function recordSimulationRun(
  simulationType: string,
  inputParameters: Record<string, any>,
  outcomeMetrics: Record<string, any>
): Promise<boolean> {
  try {
    const token = typeof window !== 'undefined' ? (getCookie('token') || getCookie('auth_token') || localStorage.getItem('token')) : null;
    const tenantId = typeof window !== 'undefined' ? (getCookie('tenant_id') || localStorage.getItem('tenantId') || 'default') : 'default';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Tenant-ID': tenantId,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch('/api/v1/simulations', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        simulationType,
        inputParameters,
        outcomeMetrics,
      }),
    });

    return res.ok;
  } catch (err) {
    // Non-blocking telemetry failure
    console.warn(`[SimulationTelemetry] Failed to persist ${simulationType} run:`, err);
    return false;
  }
}
