"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import styles from './VerticalIntegrationMap.module.css';

export interface Integration {
  type: 'vertical' | 'horizontal';
  targetSubject: string;
  targetCode: string;
  competencyRef: string;
  description: string;
}

interface VerticalIntegrationMapProps {
  subjectCode: string;
  subjectTitle: string;
  integrations: Integration[];
}

export default function VerticalIntegrationMap({
  subjectCode,
  subjectTitle,
  integrations
}: VerticalIntegrationMapProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIntegrations = integrations.filter(
    (int) =>
      int.targetSubject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      int.competencyRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      int.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const vertical = filteredIntegrations.filter((i) => i.type === 'vertical');
  const horizontal = filteredIntegrations.filter((i) => i.type === 'horizontal');

  const renderSection = (title: string, items: Integration[]) => (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      {items.length === 0 ? (
        <p className={styles.emptyText}>No integrations found.</p>
      ) : (
        <div className={styles.grid}>
          {items.map((item, idx) => (
            <Link href={`/subjects?code=${item.targetCode}`} key={idx} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.targetSubject}>{item.targetSubject}</span>
                <span className={styles.competencyRef}>{item.competencyRef}</span>
              </div>
              <p className={styles.description}>{item.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          Integration Map: {subjectTitle} ({subjectCode})
        </h2>
        <input
          type="text"
          placeholder="Search topics, competencies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </header>

      <div className={styles.content}>
        {renderSection('Vertical Integration (Cross-Phase)', vertical)}
        {renderSection('Horizontal Integration (Same Phase)', horizontal)}
      </div>
    </div>
  );
}
