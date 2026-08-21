'use client';

import React from 'react';
import { BNYS_CURRICULUM, BNYS_METADATA } from '@/lib/curriculum/bnysCurriculumScaffold';
import styles from '../ayush.module.css';

export default function BNYSPage() {
  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <h1>{BNYS_METADATA.programName} ({BNYS_METADATA.programCode})</h1>
        <p>{BNYS_METADATA.description}</p>
        <div className={styles.metadata}>
          <span className={styles.badge}>{BNYS_METADATA.regulatoryBody}</span>
          <span className={styles.badge}>{BNYS_METADATA.duration}</span>
        </div>
      </header>

      <div className={styles.subjectsGrid}>
        {BNYS_CURRICULUM.map((subject) => (
          <div key={subject.id} className={styles.subjectCard}>
            <h2>{subject.title}</h2>
            <h3>{subject.code} - Year {subject.year}, Sem {subject.semester}</h3>
            <ul className={styles.lessonList}>
              {subject.lessons.map((lesson) => (
                <li key={lesson.id} className={styles.lessonItem}>
                  <span className={styles.lessonTitle}>{lesson.title}</span>
                  <span className={styles.lessonDuration}>{lesson.duration}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
