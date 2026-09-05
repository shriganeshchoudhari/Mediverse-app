/**
 * EEGNeurophysiologyEngine.test.ts
 *
 * Unit tests for the Clinical Neurophysiology & Quantitative EEG (qEEG) Simulation Engine.
 */

import {
  getMontageChannels,
  EEG_PRESETS,
  synthesizeEEGEpoch,
  computeQEEGMetrics,
  getBandForFrequency,
  formatUv
} from '../../.gemini/skills/EEGNeurophysiologyEngine';

describe('EEGNeurophysiologyEngine', () => {
  describe('Montage Definitions', () => {
    it('returns the standard 18-channel Longitudinal Double-Banana montage', () => {
      const channels = getMontageChannels('LONGITUDINAL_DOUBLE_BANANA');
      expect(channels).toHaveLength(18);
      expect(channels[0].label).toBe('Fp1 - F7');
      expect(channels[0].region).toBe('LEFT_TEMPORAL');
      expect(channels[4].label).toBe('Fp1 - F3');
      expect(channels[4].region).toBe('LEFT_PARASAGITTAL');
    });

    it('returns the standard Transverse montage with 16 coronal channels', () => {
      const channels = getMontageChannels('TRANSVERSE');
      expect(channels).toHaveLength(16);
      expect(channels.some((c) => c.label === 'Fp1 - Fp2')).toBe(true);
      expect(channels.some((c) => c.label === 'O1 - O2')).toBe(true);
    });

    it('returns the Average Referential montage with 16 channels', () => {
      const channels = getMontageChannels('REFERENTIAL_AVG');
      expect(channels).toHaveLength(16);
      expect(channels[0].lead2).toBe('AVG');
    });
  });

  describe('Clinical Presets Catalog', () => {
    it('contains all 8 curated clinical EEG presets with complete diagnostic metadata', () => {
      const presetIds = Object.keys(EEG_PRESETS);
      expect(presetIds).toHaveLength(8);

      presetIds.forEach((id) => {
        const preset = EEG_PRESETS[id as keyof typeof EEG_PRESETS];
        expect(preset.name).toBeDefined();
        expect(preset.clinicalCategory).toBeDefined();
        expect(preset.diagnosticCriteria.length).toBeGreaterThanOrEqual(3);
        expect(preset.treatmentGuidance).toBeDefined();
        expect(preset.typicalBands.dominantBand).toBeDefined();
      });
    });
  });

  describe('Multi-Channel Waveform Synthesis', () => {
    it('synthesizes multi-channel epoch with correct duration and sample rate', () => {
      const epoch = synthesizeEEGEpoch(
        'normal-awake-alpha',
        'LONGITUDINAL_DOUBLE_BANANA',
        0,
        2.0, // 2 seconds
        128  // 128 Hz
      );

      expect(epoch.durationSec).toBe(2.0);
      expect(epoch.sampleRateHz).toBe(128);
      expect(epoch.channels).toHaveLength(18);

      const ch1 = epoch.channels[0];
      expect(ch1.samples).toHaveLength(256);
      expect(typeof ch1.samples[0].voltageUv).toBe('number');
      expect(Number.isFinite(ch1.samples[0].voltageUv)).toBe(true);
    });

    it('demonstrates electrocerebral inactivity (<2 µV) in brain death preset', () => {
      const epoch = synthesizeEEGEpoch(
        'electrocerebral-inactivity-brain-death',
        'LONGITUDINAL_DOUBLE_BANANA',
        0,
        1.0,
        64
      );

      epoch.channels.forEach((ch) => {
        ch.samples.forEach((pt) => {
          expect(Math.abs(pt.voltageUv)).toBeLessThan(2.0);
        });
      });
    });

    it('demonstrates left temporal lateralization in PLEDs/LPDs', () => {
      const epoch = synthesizeEEGEpoch(
        'pleds-herpes-encephalitis',
        'LONGITUDINAL_DOUBLE_BANANA',
        0,
        2.0,
        128
      );

      // Find Left Temporal channel (F7 - T3) and Right Temporal channel (F8 - T4)
      const leftTemp = epoch.channels.find((c) => c.definition.label === 'F7 - T3')!;
      const rightTemp = epoch.channels.find((c) => c.definition.label === 'F8 - T4')!;

      const maxLeft = Math.max(...leftTemp.samples.map((s) => Math.abs(s.voltageUv)));
      const maxRight = Math.max(...rightTemp.samples.map((s) => Math.abs(s.voltageUv)));

      // PLEDs on the left should exhibit significantly higher amplitude spikes than right
      expect(maxLeft).toBeGreaterThan(maxRight * 1.5);
    });
  });

  describe('Quantitative EEG (qEEG) & Spectral Analysis', () => {
    it('demonstrates Berger effect: eye-opening attenuates alpha and increases beta/SEF95', () => {
      const eyesClosed = computeQEEGMetrics('normal-awake-alpha', {
        eyesOpen: false,
        hyperventilationActive: false,
        hyperventilationSeconds: 0,
        photicStimulationHz: 0
      });

      const eyesOpen = computeQEEGMetrics('normal-awake-alpha', {
        eyesOpen: true,
        hyperventilationActive: false,
        hyperventilationSeconds: 0,
        photicStimulationHz: 0
      });

      expect(eyesClosed.alphaPowerPct).toBeGreaterThan(50);
      expect(eyesOpen.alphaPowerPct).toBeLessThan(eyesClosed.alphaPowerPct);
      expect(eyesOpen.spectralEdgeFrequency95Hz).toBeGreaterThan(eyesClosed.spectralEdgeFrequency95Hz);
      expect(eyesClosed.alphaDeltaRatio).toBeGreaterThan(eyesOpen.alphaDeltaRatio);
    });

    it('computes therapeutic burst suppression ratio (BSR) in propofol coma', () => {
      const qeeg = computeQEEGMetrics('burst-suppression-propofol');
      expect(qeeg.burstSuppressionRatioPct).toBe(75);
      expect(qeeg.aEEG.classification).toBe('BURST_SUPPRESSION');
      expect(qeeg.aEEG.lowerMarginUv).toBeLessThan(5);
    });

    it('detects severe delta slowing in triphasic hepatic encephalopathy', () => {
      const qeeg = computeQEEGMetrics('triphasic-hepatic-encephalopathy');
      expect(qeeg.deltaPowerPct).toBeGreaterThan(70);
      expect(qeeg.spectralEdgeFrequency95Hz).toBeLessThan(7.0);
      expect(qeeg.alphaDeltaRatio).toBeLessThan(0.1);
    });

    it('confirms isoelectric flatline in brain death qEEG', () => {
      const qeeg = computeQEEGMetrics('electrocerebral-inactivity-brain-death');
      expect(qeeg.burstSuppressionRatioPct).toBe(100);
      expect(qeeg.aEEG.classification).toBe('ISOELECTRIC');
      expect(qeeg.aEEG.upperMarginUv).toBeLessThan(2.0);
      expect(qeeg.meanAmplitudeUv).toBeLessThan(1.0);
    });

    it('hyperventilation increases 3 Hz absence seizure paroxysm amplitude', () => {
      const baseline = computeQEEGMetrics('childhood-absence-3hz', {
        eyesOpen: false,
        hyperventilationActive: false,
        hyperventilationSeconds: 0,
        photicStimulationHz: 0
      });

      const hvActive = computeQEEGMetrics('childhood-absence-3hz', {
        eyesOpen: false,
        hyperventilationActive: true,
        hyperventilationSeconds: 60,
        photicStimulationHz: 0
      });

      expect(hvActive.meanAmplitudeUv).toBeGreaterThan(baseline.meanAmplitudeUv);
      expect(hvActive.deltaPowerPct).toBeGreaterThan(baseline.deltaPowerPct);
    });
  });

  describe('Helper Functions', () => {
    it('correctly maps frequencies to EEG frequency bands', () => {
      expect(getBandForFrequency(2.5)).toBe('Delta');
      expect(getBandForFrequency(5.5)).toBe('Theta');
      expect(getBandForFrequency(10.0)).toBe('Alpha');
      expect(getBandForFrequency(20.0)).toBe('Beta');
      expect(getBandForFrequency(40.0)).toBe('Gamma');
    });

    it('formats voltage strings with sign', () => {
      expect(formatUv(14.2)).toBe('+14.2 µV');
      expect(formatUv(-28.5)).toBe('-28.5 µV');
      expect(formatUv(0)).toBe('+0.0 µV');
    });
  });
});
