"use client";

import React from "react";
import Link from "next/link";
import styles from "./SimulationCalloutCard.module.css";

interface SimulationCalloutCardProps {
  title: string;
  description: string;
  route: string;
  presetParams?: Record<string, number | string>;
  organSystem?: string;
}

export default function SimulationCalloutCard({
  title,
  description,
  route,
  presetParams,
  organSystem = "Physiology"
}: SimulationCalloutCardProps) {
  // Construct deep link query string if parameters provided
  const queryString = presetParams
    ? "?" + new URLSearchParams(Object.entries(presetParams).map(([k, v]) => [k, String(v)])).toString()
    : "";

  return (
    <div className={styles.calloutContainer}>
      <div className={styles.headerRow}>
        <span className={styles.badge}>⚡ Interactive Numerical Simulation</span>
        {organSystem && <span className={styles.paramTag}>{organSystem}</span>}
      </div>

      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>

      {presetParams && (
        <div className={styles.paramsRow}>
          <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>Preset Controls:</span>
          {Object.entries(presetParams).map(([key, val]) => (
            <span key={key} className={styles.paramTag}>
              {key}: <strong>{String(val)}</strong>
            </span>
          ))}
        </div>
      )}

      <Link href={`${route}${queryString}`} className={styles.launchButton}>
        <span>⚡ Launch Interactive Lab</span>
        <span>→</span>
      </Link>
    </div>
  );
}
