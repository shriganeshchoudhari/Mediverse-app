'use client';

import React from 'react';
import { BUMS_CURRICULUM, BUMS_METADATA } from '@/lib/curriculum/bumsCurriculumScaffold';
import styles from '../ayush.module.css';

export default function BUMSPage() {
  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <h1>{BUMS_METADATA.programName} ({BUMS_METADATA.programCode})</h1>
        <p>{BUMS_METADATA.description}</p>
        <div className={styles.metadata}>
          <span className={styles.badge}>{BUMS_METADATA.regulatoryBody}</span>
          <span className={styles.badge}>{BUMS_METADATA.duration}</span>
        </div>
      </header>

      <div className={styles.subjectsGrid}>
        {BUMS_CURRICULUM.map((subject) => (
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
