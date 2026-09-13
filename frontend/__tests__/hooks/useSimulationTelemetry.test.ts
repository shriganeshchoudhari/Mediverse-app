import { renderHook, act } from '@testing-library/react';
import { useSimulationTelemetry } from '@/hooks/useSimulationTelemetry';
import { recordSimulationRun } from '@/lib/simulations/simulationPersistence';

jest.mock('@/lib/simulations/simulationPersistence', () => ({
  recordSimulationRun: jest.fn().mockResolvedValue(true),
}));

describe('useSimulationTelemetry Hook', () => {
  const mockRecordSimulationRun = recordSimulationRun as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRecordSimulationRun.mockResolvedValue(true);
  });

  test('calls recordSimulationRun with simulationType, inputs, and outcomes', async () => {
    const { result } = renderHook(() => useSimulationTelemetry('cardiac-cycle-test'));

    let ok = false;
    await act(async () => {
      ok = await result.current.logSession({ hr: 72 }, { co: 5.0 });
    });

    expect(mockRecordSimulationRun).toHaveBeenCalledTimes(1);
    expect(mockRecordSimulationRun).toHaveBeenCalledWith('cardiac-cycle-test', { hr: 72 }, { co: 5.0 });
    expect(ok).toBe(true);
  });

  test('throttles rapid consecutive telemetry calls within throttleMs window', async () => {
    const { result } = renderHook(() =>
      useSimulationTelemetry('acid-base-test', { throttleMs: 1000 })
    );

    let firstResult = false;
    let secondResult = true;

    await act(async () => {
      firstResult = await result.current.logSession({ ph: 7.4 }, { hco3: 24 });
    });

    // Immediate second call should be throttled out
    await act(async () => {
      secondResult = await result.current.logSession({ ph: 7.35 }, { hco3: 22 });
    });

    expect(firstResult).toBe(true);
    expect(secondResult).toBe(false);
    expect(mockRecordSimulationRun).toHaveBeenCalledTimes(1);
  });

  test('allows forced bypass of throttle when force=true', async () => {
    const { result } = renderHook(() =>
      useSimulationTelemetry('sepsis-test', { throttleMs: 5000 })
    );

    await act(async () => {
      await result.current.logSession({ map: 65 }, { lactate: 2.1 });
    });

    let forcedResult = false;
    await act(async () => {
      forcedResult = await result.current.logSession(
        { map: 60 },
        { lactate: 3.5 },
        true // force
      );
    });

    expect(forcedResult).toBe(true);
    expect(mockRecordSimulationRun).toHaveBeenCalledTimes(2);
  });
});
