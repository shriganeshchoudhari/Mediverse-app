'use client';

import React, { useState, useMemo } from 'react';
import styles from './HealthEconomicsSimulator.module.css';

interface Strategy {
  name: string;
  costInr: number;
  survivalYears: number;
  utility: number; // 0.0 - 1.0 (HRQoL)
}

export default function HealthEconomicsSimulator() {
  const [stratAName, setStratAName] = useState<string>('Standard Chemotherapy');
  const [stratACost, setStratACost] = useState<number>(150000);
  const [stratASurvival, setStratASurvival] = useState<number>(2.0);
  const [stratAUtility, setStratAUtility] = useState<number>(0.60);

  const [stratBName, setStratBName] = useState<string>('Targeted Immunotherapy');
  const [stratBCost, setStratBCost] = useState<number>(450000);
  const [stratBSurvival, setStratBSurvival] = useState<number>(4.5);
  const [stratBUtility, setStratBUtility] = useState<number>(0.85);

  const gdpPerCapitaInr = 200000; // India ~₹2 Lakhs GDP/capita

  const results = useMemo(() => {
    // QALY = Survival Years * Utility
    const qalyA = Number((stratASurvival * stratAUtility).toFixed(2));
    const qalyB = Number((stratBSurvival * stratBUtility).toFixed(2));

    const deltaCost = stratBCost - stratACost;
    const deltaQALY = Number((qalyB - qalyA).toFixed(2));

    // ICER = Delta Cost / Delta QALY
    let icer = 0;
    if (deltaQALY > 0) {
      icer = Math.round(deltaCost / deltaQALY);
    }

    // WHO Cost-Effectiveness Thresholds
    let category = 'Cost-Effective';
    let categoryColor = 'green';
    if (deltaCost <= 0 && deltaQALY >= 0) {
      category = 'Dominant (Lower Cost, Better Health Outcomes)';
      categoryColor = 'green';
    } else if (deltaCost > 0 && deltaQALY <= 0) {
      category = 'Dominated (Higher Cost, Worse Health Outcomes)';
      categoryColor = 'red';
    } else if (icer <= gdpPerCapitaInr) {
      category = 'Highly Cost-Effective (ICER < 1x GDP per capita)';
      categoryColor = 'green';
    } else if (icer <= 3 * gdpPerCapitaInr) {
      category = 'Cost-Effective (ICER between 1x and 3x GDP per capita)';
      categoryColor = 'amber';
    } else {
      category = 'Not Cost-Effective (ICER > 3x GDP per capita)';
      categoryColor = 'red';
    }

    return { qalyA, qalyB, deltaCost, deltaQALY, icer, category, categoryColor };
  }, [stratACost, stratASurvival, stratAUtility, stratBCost, stratBSurvival, stratBUtility, gdpPerCapitaInr]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Health Economics Cost-Effectiveness (CEA) & QALY / DALY Calculator</h2>
        <p className={styles.subtitle}>
          Interactive health technology assessment: evaluate Incremental Cost-Effectiveness Ratio (ICER), Quality-Adjusted Life Years (QALY), and WHO GDP-per-capita decision thresholds.
        </p>
      </header>

      <div className={styles.layout}>
        {/* Left: ICER Results & Decision Plane */}
        <div className={styles.resultsCol}>
          <div className={styles.card}>
            <span className={styles.label}>Incremental Cost-Effectiveness Ratio (ICER)</span>
            
            <div className={styles.icerBox}>
              <span className={styles.icerVal}>₹{results.icer.toLocaleString('en-IN')}</span>
              <span className={styles.icerSub}>Cost per QALY Gained</span>
            </div>

            <div className={`${styles.statusBanner} ${styles[results.categoryColor]}`}>
              {results.category}
            </div>

            {/* QALY Breakdown */}
            <div className={styles.qalyGrid}>
              <div className={styles.qalyBox}>
                <span className={styles.qalyVal}>{results.qalyA}</span>
                <span className={styles.qalySub}>{stratAName} (QALYs)</span>
              </div>
              <div className={styles.qalyBox}>
                <span className={styles.qalyVal}>{results.qalyB}</span>
                <span className={styles.qalySub}>{stratBName} (QALYs)</span>
              </div>
              <div className={styles.qalyBox}>
                <span className={styles.qalyVal}>+{results.deltaQALY}</span>
                <span className={styles.qalySub}>Net QALY Gain (ΔE)</span>
              </div>
            </div>

            <div className={styles.thresholdBanner}>
              📊 <strong>WHO Willingness-to-Pay Benchmark:</strong> 1x GDP/capita = ₹{gdpPerCapitaInr.toLocaleString('en-IN')} | 3x GDP/capita = ₹{(3 * gdpPerCapitaInr).toLocaleString('en-IN')}.
            </div>
          </div>
        </div>

        {/* Right: Strategy Comparators */}
        <div className={styles.controlsCol}>
          {/* Strategy A */}
          <div className={styles.card}>
            <h3 className={styles.cardHeading}>Comparator Strategy A (Standard of Care)</h3>
            
            <div className={styles.sliderGroup}>
              <div className={styles.sliderHeader}>
                <span>Cost per Patient:</span>
                <strong>₹{stratACost.toLocaleString('en-IN')}</strong>
              </div>
              <input
                type="range"
                min="20000"
                max="500000"
                step="10000"
                value={stratACost}
                onChange={e => setStratACost(Number(e.target.value))}
                className={styles.rangeSlider}
              />
            </div>

            <div className={styles.sliderGroup}>
              <div className={styles.sliderHeader}>
                <span>Mean Survival Duration:</span>
                <strong>{stratASurvival} years</strong>
              </div>
              <input
                type="range"
                min="0.5"
                max="10.0"
                step="0.5"
                value={stratASurvival}
                onChange={e => setStratASurvival(Number(e.target.value))}
                className={styles.rangeSlider}
              />
            </div>

            <div className={styles.sliderGroup}>
              <div className={styles.sliderHeader}>
                <span>Quality of Life Utility (0.0 - 1.0):</span>
                <strong>{stratAUtility.toFixed(2)}</strong>
              </div>
              <input
                type="range"
                min="0.10"
                max="1.00"
                step="0.05"
                value={stratAUtility}
                onChange={e => setStratAUtility(Number(e.target.value))}
                className={styles.rangeSlider}
              />
            </div>
          </div>

          {/* Strategy B */}
          <div className={styles.card}>
            <h3 className={styles.cardHeading}>Novel Strategy B (New Intervention)</h3>
            
            <div className={styles.sliderGroup}>
              <div className={styles.sliderHeader}>
                <span>Cost per Patient:</span>
                <strong>₹{stratBCost.toLocaleString('en-IN')}</strong>
              </div>
              <input
                type="range"
                min="50000"
                max="1500000"
                step="25000"
                value={stratBCost}
                onChange={e => setStratBCost(Number(e.target.value))}
                className={styles.rangeSlider}
              />
            </div>

            <div className={styles.sliderGroup}>
              <div className={styles.sliderHeader}>
                <span>Mean Survival Duration:</span>
                <strong>{stratBSurvival} years</strong>
              </div>
              <input
                type="range"
                min="0.5"
                max="15.0"
                step="0.5"
                value={stratBSurvival}
                onChange={e => setStratBSurvival(Number(e.target.value))}
                className={styles.rangeSlider}
              />
            </div>

            <div className={styles.sliderGroup}>
              <div className={styles.sliderHeader}>
                <span>Quality of Life Utility (0.0 - 1.0):</span>
                <strong>{stratBUtility.toFixed(2)}</strong>
              </div>
              <input
                type="range"
                min="0.10"
                max="1.00"
                step="0.05"
                value={stratBUtility}
                onChange={e => setStratBUtility(Number(e.target.value))}
                className={styles.rangeSlider}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
