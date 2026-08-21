'use client';

import React from 'react';
import { BSMS_CURRICULUM, BSMS_METADATA } from '@/lib/curriculum/bsmsCurriculumScaffold';
import styles from '../ayush.module.css';

export default function BSMSPage() {
  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <h1>{BSMS_METADATA.programName} ({BSMS_METADATA.programCode})</h1>
        <p>{BSMS_METADATA.description}</p>
        <div className={styles.metadata}>
          <span className={styles.badge}>{BSMS_METADATA.regulatoryBody}</span>
          <span className={styles.badge}>{BSMS_METADATA.duration}</span>
        </div>
      </header>

      <div className={styles.subjectsGrid}>
        {BSMS_CURRICULUM.map((subject) => (
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
