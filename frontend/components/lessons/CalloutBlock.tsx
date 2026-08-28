'use client';
import React from 'react';
import styles from './CalloutBlock.module.css';

export type CalloutType = 'pearl' | 'trap' | 'highyield' | 'remember';

interface CalloutBlockProps {
  type: CalloutType;
  children: React.ReactNode;
}

const CONFIG = {
  pearl:     { icon: '💎', label: 'Clinical Pearl',    colorClass: 'pearl' },
  trap:      { icon: '⚠️', label: 'Exam Trap',         colorClass: 'trap' },
  highyield: { icon: '🎯', label: 'High-Yield Fact',   colorClass: 'highyield' },
  remember:  { icon: '🧠', label: 'Remember',          colorClass: 'remember' },
};

export default function CalloutBlock({ type, children }: CalloutBlockProps) {
  const cfg = CONFIG[type];
  return (
    <div className={`${styles.callout} ${styles[cfg.colorClass]}`}>
      <div className={styles.header}>
        <span className={styles.icon}>{cfg.icon}</span>
        <span className={styles.label}>{cfg.label}</span>
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
