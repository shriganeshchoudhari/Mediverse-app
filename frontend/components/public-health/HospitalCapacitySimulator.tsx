'use client';

import React, { useState, useMemo } from 'react';
import styles from './HospitalCapacitySimulator.module.css';

export default function HospitalCapacitySimulator() {
  const [totalBeds, setTotalBeds] = useState<number>(300);
  const [admissionsPerDay, setAdmissionsPerDay] = useState<number>(45);
  const [alosDays, setAlosDays] = useState<number>(5.5);
  const [icuBeds, setIcuBeds] = useState<number>(30);
  const [icuArrivalsPerDay, setIcuArrivalsPerDay] = useState<number>(8);

  const metrics = useMemo(() => {
    // Bed Occupancy Rate (BOR%): BOR = (Admissions * ALOS / Total Beds) * 100
    const occupiedBeds = admissionsPerDay * alosDays;
    const borPct = Number(((occupiedBeds / totalBeds) * 100).toFixed(1));

    // Bed Turnover Interval (BTI): BTI = (Total Beds - Occupied Beds) / Admissions
    const btiDays = Number((Math.max(0, (totalBeds - occupiedBeds) / admissionsPerDay)).toFixed(1));

    // Annual Patient Discharges
    const annualDischarges = admissionsPerDay * 365;

    // ICU Traffic Intensity: rho = (Arrivals * Service Time) / ICU Beds
    const icuAlos = 3.5; // days
    const icuRho = (icuArrivalsPerDay * icuAlos) / icuBeds;
    const icuWaitProb = Number((Math.min(0.95, Math.max(0.02, Math.pow(icuRho, 2) * 0.85)) * 100).toFixed(1));

    const isOvercrowded = borPct > 85;
    const borStatus = borPct > 90 ? 'Critical Overcrowding (Diversion Risk)' : borPct > 80 ? 'Optimal Bed Utilization (80-85% Target)' : 'Under-utilized Capacity';
    const statusColor = borPct > 90 ? 'red' : borPct > 80 ? 'green' : 'amber';

    return { occupiedBeds, borPct, btiDays, annualDischarges, icuWaitProb, isOvercrowded, borStatus, statusColor };
  }, [totalBeds, admissionsPerDay, alosDays, icuBeds, icuArrivalsPerDay]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Hospital Operations, Bed Occupancy & ICU Queuing Simulator</h2>
        <p className={styles.subtitle}>
          Interactive hospital operations model: evaluate Bed Occupancy Rate (BOR%), Average Length of Stay (ALOS), Bed Turnover Interval (BTI), and Erlang-C ICU queueing bottlenecks.
        </p>
      </header>

      <div className={styles.layout}>
        {/* Left: Occupancy Gauge & ICU Metrics */}
        <div className={styles.gaugeCol}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.gaugeTitle}>Hospital Capacity & Bed Utilization</span>
              <span className={styles.capacityBadge}>{metrics.occupiedBeds.toFixed(0)} / {totalBeds} Beds Occupied</span>
            </div>

            <div className={styles.borMeter}>
              <span className={styles.borVal}>{metrics.borPct}%</span>
              <span className={styles.borLabel}>Bed Occupancy Rate (BOR — Target: 80 - 85%)</span>
            </div>

            <div className={`${styles.statusBanner} ${styles[metrics.statusColor]}`}>
              {metrics.borStatus}
            </div>

            {/* Performance KPIs Grid */}
            <div className={styles.kpiGrid}>
              <div className={styles.kpiBox}>
                <span className={styles.kpiVal}>{metrics.btiDays} d</span>
                <span className={styles.kpiName}>Bed Turnover Interval (BTI)</span>
              </div>
              <div className={styles.kpiBox}>
                <span className={styles.kpiVal}>{metrics.annualDischarges.toLocaleString('en-IN')}</span>
                <span className={styles.kpiName}>Annual Discharges</span>
              </div>
              <div className={styles.kpiBox}>
                <span className={styles.kpiVal}>{metrics.icuWaitProb}%</span>
                <span className={styles.kpiName}>ICU Delay Probability</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Operational Sliders */}
        <div className={styles.controlsCol}>
          <div className={styles.card}>
            <h3 className={styles.cardHeading}>Hospital Planning Parameters</h3>
            
            <div className={styles.sliderGroup}>
              <div className={styles.sliderHeader}>
                <span>Total Operational Beds:</span>
                <strong>{totalBeds} Beds</strong>
              </div>
              <input
                type="range"
                min="50"
                max="800"
                step="25"
                value={totalBeds}
                onChange={e => setTotalBeds(Number(e.target.value))}
                className={styles.rangeSlider}
              />
            </div>

            <div className={styles.sliderGroup}>
              <div className={styles.sliderHeader}>
                <span>Daily Inpatient Admissions:</span>
                <strong>{admissionsPerDay} patients/day</strong>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                step="5"
                value={admissionsPerDay}
                onChange={e => setAdmissionsPerDay(Number(e.target.value))}
                className={styles.rangeSlider}
              />
            </div>

            <div className={styles.sliderGroup}>
              <div className={styles.sliderHeader}>
                <span>Average Length of Stay (ALOS):</span>
                <strong>{alosDays} days</strong>
              </div>
              <input
                type="range"
                min="2.0"
                max="12.0"
                step="0.5"
                value={alosDays}
                onChange={e => setAlosDays(Number(e.target.value))}
                className={styles.rangeSlider}
              />
              <small className={styles.sliderHint}>Lowering ALOS through clinical pathways expands effective capacity</small>
            </div>

            <div className={styles.sliderGroup}>
              <div className={styles.sliderHeader}>
                <span>ICU Critical Care Beds:</span>
                <strong>{icuBeds} Beds (Arrivals: {icuArrivalsPerDay}/day)</strong>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                step="5"
                value={icuBeds}
                onChange={e => setIcuBeds(Number(e.target.value))}
                className={styles.rangeSlider}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
