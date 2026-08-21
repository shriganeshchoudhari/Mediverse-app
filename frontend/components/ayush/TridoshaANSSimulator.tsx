'use client';

import React, { useState, useEffect } from 'react';
import styles from './TridoshaANSSimulator.module.css';

export default function TridoshaANSSimulator() {
  const [vata, setVata] = useState(33);
  const [pitta, setPitta] = useState(33);
  const [kapha, setKapha] = useState(34);

  const [sympathovagalBalance, setSympathovagalBalance] = useState(1);
  const [sympatheticTone, setSympatheticTone] = useState(50);
  const [parasympatheticTone, setParasympatheticTone] = useState(50);
  const [metabolicRate, setMetabolicRate] = useState(100);
  const [cortisolIndex, setCortisolIndex] = useState(50);

  const [selectedTime, setSelectedTime] = useState<number | null>(null);

  useEffect(() => {
    // Normalizing doshas to 100% total just for visual display if needed
    // However, sliders can work independently or interactively.
    
    // ANS and endocrine models based on doshas
    // Vata -> Sympathetic overactivity, high cortisol
    // Pitta -> High metabolic rate, moderate sympathetic
    // Kapha -> Parasympathetic dominance, low metabolic rate, low cortisol

    const symp = vata * 1.5 + pitta * 0.8;
    const parasymp = kapha * 1.8 + vata * 0.2;
    const totalAns = symp + parasymp;

    const sympPercent = (symp / totalAns) * 100;
    const parasympPercent = (parasymp / totalAns) * 100;
    
    setSympatheticTone(sympPercent);
    setParasympatheticTone(parasympPercent);
    setSympathovagalBalance(symp / (parasymp || 1));
    
    setMetabolicRate(pitta * 1.5 + vata * 0.5 - kapha * 0.5 + 50);
    setCortisolIndex(vata * 1.2 + pitta * 0.6 - kapha * 0.4 + 20);

  }, [vata, pitta, kapha]);

  const handleTimeClick = (hour: number) => {
    setSelectedTime(hour);
  };

  const getDominantDoshaTime = (hour: number) => {
    if ((hour >= 2 && hour < 6) || (hour >= 14 && hour < 18)) return 'Vata';
    if ((hour >= 10 && hour < 14) || (hour >= 22 || hour < 2)) return 'Pitta';
    if ((hour >= 6 && hour < 10) || (hour >= 18 && hour < 22)) return 'Kapha';
    return 'Balanced';
  };

  // Center of mass calculation for triangle
  // Equilateral triangle coords: Vata(top)= (50, 10), Pitta(right)= (90, 90), Kapha(left)= (10, 90)
  const totalWeight = vata + pitta + kapha || 1;
  const markerX = (vata * 50 + pitta * 90 + kapha * 10) / totalWeight;
  const markerY = (vata * 10 + pitta * 90 + kapha * 90) / totalWeight;

  const dominantDosha = vata > pitta && vata > kapha ? 'Vata' : pitta > vata && pitta > kapha ? 'Pitta' : 'Kapha';

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Tridosha ANS Simulator</h2>
      <div className={styles.grid}>
        
        {/* Sliders */}
        <div className={styles.panel}>
          <h3>Dosha Levels</h3>
          <div className={styles.sliderGroup}>
            <label>Vata ({vata}%)</label>
            <input type="range" min="0" max="100" value={vata} onChange={(e) => setVata(Number(e.target.value))} className={`${styles.slider} ${styles.vataSlider}`} />
          </div>
          <div className={styles.sliderGroup}>
            <label>Pitta ({pitta}%)</label>
            <input type="range" min="0" max="100" value={pitta} onChange={(e) => setPitta(Number(e.target.value))} className={`${styles.slider} ${styles.pittaSlider}`} />
          </div>
          <div className={styles.sliderGroup}>
            <label>Kapha ({kapha}%)</label>
            <input type="range" min="0" max="100" value={kapha} onChange={(e) => setKapha(Number(e.target.value))} className={`${styles.slider} ${styles.kaphaSlider}`} />
          </div>
        </div>

        {/* Triangle & Balances */}
        <div className={styles.panel}>
          <h3>Equilibrium State</h3>
          <svg viewBox="0 0 100 100" className={styles.triangleSvg}>
            <polygon points="50,10 90,90 10,90" className={styles.triangle} />
            <text x="50" y="8" className={styles.svgText} fill="#38bdf8">Vata</text>
            <text x="92" y="95" className={styles.svgText} fill="#f59e0b">Pitta</text>
            <text x="8" y="95" className={styles.svgText} fill="#10b981">Kapha</text>
            <circle cx={markerX} cy={markerY} r="4" className={styles.marker} />
          </svg>
        </div>

        {/* ANS Metrics */}
        <div className={styles.panel}>
          <h3>Physiological Output</h3>
          <div className={styles.metricRow}>
            <span>Sympathetic Tone:</span>
            <span>{sympatheticTone.toFixed(1)}%</span>
          </div>
          <div className={styles.barContainer}>
            <div className={styles.sympBar} style={{ width: `${sympatheticTone}%` }}></div>
          </div>

          <div className={styles.metricRow}>
            <span>Parasympathetic Tone:</span>
            <span>{parasympatheticTone.toFixed(1)}%</span>
          </div>
          <div className={styles.barContainer}>
            <div className={styles.paraBar} style={{ width: `${parasympatheticTone}%` }}></div>
          </div>

          <div className={styles.metricRow}>
            <span>LF/HF Ratio:</span>
            <span>{sympathovagalBalance.toFixed(2)}</span>
          </div>
          <div className={styles.metricRow}>
            <span>Metabolic Rate:</span>
            <span>{metabolicRate.toFixed(1)}%</span>
          </div>
          <div className={styles.metricRow}>
            <span>Cortisol Index:</span>
            <span>{cortisolIndex.toFixed(1)}</span>
          </div>
        </div>

        {/* Circadian Clock */}
        <div className={styles.panel}>
          <h3>Circadian Clock</h3>
          <div className={styles.clockGrid}>
            {[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22].map((hour) => (
              <button
                key={hour}
                className={`${styles.timeBtn} ${selectedTime === hour ? styles.activeTimeBtn : ''}`}
                onClick={() => handleTimeClick(hour)}
              >
                {hour}:00
              </button>
            ))}
          </div>
          {selectedTime !== null && (
            <div className={styles.timeInfo}>
              <p>Time: {selectedTime}:00</p>
              <p>Dominant Dosha: <strong>{getDominantDoshaTime(selectedTime)}</strong></p>
            </div>
          )}
        </div>
      </div>
      
      {/* Diagnostic Summary */}
      <div className={styles.diagnosticCard}>
        <h3>Diagnostic Summary</h3>
        <div className={styles.badgeGroup}>
          <span className={`${styles.badge} ${styles[dominantDosha.toLowerCase()]}`}>{dominantDosha} Dominance</span>
        </div>
        <p>Neurological State: {sympatheticTone > parasympatheticTone ? 'Sympathetic Overdrive (Fight or Flight)' : 'Parasympathetic Dominance (Rest and Digest)'}</p>
        <p>Therapy: {dominantDosha === 'Vata' ? 'Basti & Oil massage' : dominantDosha === 'Pitta' ? 'Virechana & Cooling herbs' : 'Vamana & Exercise'}</p>
      </div>
    </div>
  );
}
