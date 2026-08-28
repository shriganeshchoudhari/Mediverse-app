'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import SocraticChat from './SocraticChat';
import TextSelectionAskAI from './TextSelectionAskAI';
import styles from './GlobalSocraticAssistant.module.css';

interface TopicContext {
  title: string;
  chapterId: string;
}

function resolveTopicContext(pathname: string): TopicContext {
  if (!pathname) {
    return { title: 'General Medical Physiology', chapterId: 'general' };
  }

  // Exact & prefix matching for simulations
  if (pathname.includes('/simulators/cardiac-cycle')) {
    return { title: 'Cardiac Cycle & Wiggers Diagram', chapterId: 'cardiac-cycle' };
  }
  if (pathname.includes('/simulators/respiratory-vq')) {
    return { title: 'Respiratory Mechanics & V/Q Matching', chapterId: 'respiratory-vq' };
  }
  if (pathname.includes('/simulators/spirometry')) {
    return { title: 'Spirometry & Pulmonary Volumes', chapterId: 'spirometry' };
  }
  if (pathname.includes('/simulators/renal-filtration')) {
    return { title: 'Renal Filtration & Glomerular Dynamics', chapterId: 'renal-filtration' };
  }
  if (pathname.includes('/simulators/nerve-muscle')) {
    return { title: 'Nerve-Muscle & Action Potentials', chapterId: 'nerve-muscle' };
  }
  if (pathname.includes('/simulators/patient-emergency')) {
    return { title: 'Patient Emergency & Clinical Triage', chapterId: 'patient-emergency' };
  }
  if (pathname.includes('/simulators')) {
    return { title: 'Interactive Physiology Simulators', chapterId: 'simulators' };
  }

  // Lessons route matching
  if (pathname.includes('/lessons/acid-base')) {
    return { title: 'Acid-Base Balance & Compensation', chapterId: 'acid-base' };
  }
  if (pathname.startsWith('/lessons/')) {
    const slug = pathname.replace('/lessons/', '').split('/')[0];
    if (slug) {
      const formatted = slug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      return { title: formatted, chapterId: slug };
    }
    return { title: 'Physiology Curriculum', chapterId: 'lessons' };
  }

  // Other section routes
  if (pathname.includes('/exam')) {
    return { title: 'Clinical Examination & OSCE Prep', chapterId: 'exam' };
  }
  if (pathname.includes('/formulas')) {
    return { title: 'Physiological Formulas & Calculations', chapterId: 'formulas' };
  }
  if (pathname.includes('/glossary')) {
    return { title: 'Medical Physiology Glossary', chapterId: 'glossary' };
  }
  if (pathname.includes('/analytics')) {
    return { title: 'Learning Analytics & Mastery', chapterId: 'analytics' };
  }
  if (pathname.includes('/study-groups')) {
    return { title: 'Collaborative Study Groups', chapterId: 'study-groups' };
  }
  if (pathname.includes('/dashboard')) {
    return { title: 'Core Medical Physiology', chapterId: 'dashboard' };
  }

  return { title: 'General Medical Physiology', chapterId: 'general' };
}

export default function GlobalSocraticAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [prefillText, setPrefillText] = useState<string>('');
  const pathname = usePathname();

  const currentTopic = useMemo(() => resolveTopicContext(pathname || ''), [pathname]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: Event) => {
      const text = (e as CustomEvent).detail?.text;
      if (text) {
        setPrefillText(text);
        setIsOpen(true);
        setTimeout(() => setPrefillText(''), 500);
      }
    };
    window.addEventListener('mediverse:ask-ai', handler);
    return () => window.removeEventListener('mediverse:ask-ai', handler);
  }, []);

  // Prevent background scrolling when open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleTextSelectionAsk = (text: string) => {
    setPrefillText(text);
    setIsOpen(true);
    setTimeout(() => setPrefillText(''), 500);
  };

  return (
    <>
      <TextSelectionAskAI onAskAI={handleTextSelectionAsk} />
      
      {/* Floating Action Button */}
      <aside aria-label="Socratic AI Assistant Quick Access" className={styles.fabContainer}>
        {!isOpen && (
          <span className={styles.fabTooltip}>
            Ask Socratic AI • {currentTopic.title}
          </span>
        )}
        <button
          id="global-socratic-assistant-fab"
          aria-label={`Open AI Socratic Tutor for ${currentTopic.title}`}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          className={styles.fabButton}
          type="button"
        >
          <span className={styles.pulseRing} />
          <span className={styles.pulseRingSecondary} />
          <div className={styles.neuralIcon}>
            {/* Neural Brain / AI Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" />
              <path d="M9 21h6" />
              <path d="M10 17h4" />
              <line x1="12" y1="6" x2="12" y2="10" />
              <line x1="9.5" y1="8" x2="14.5" y2="8" />
            </svg>
          </div>
        </button>
      </aside>

      {/* Backdrop Blur Overlay */}
      <div
        className={`${styles.backdropOverlay} ${isOpen ? styles.backdropOverlayVisible : ''}`}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      />

      {/* Slide-over Drawer */}
      <aside
        id="global-socratic-assistant-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`AI Socratic Tutor Drawer: ${currentTopic.title}`}
        className={`${styles.drawerContainer} ${isOpen ? styles.drawerContainerOpen : ''}`}
      >
        {/* Drawer Header */}
        <div className={styles.drawerHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIconBadge}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" />
                <path d="M9 21h6" />
              </svg>
            </div>
            <div className={styles.headerTitleGroup}>
              <div className={styles.headerTitle}>
                <span>Socratic AI Companion</span>
                <span className={styles.liveIndicator} title="Engine Active" />
              </div>
              <span className={styles.headerSubtitle}>Guided Step-by-Step Physiological Reasoning</span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close AI Socratic Tutor"
            className={styles.closeButton}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Current Route Context Bar */}
        <div className={styles.contextBar}>
          <div className={styles.contextLabel}>
            <span>🎯 Context:</span>
          </div>
          <span className={styles.contextPill} title={currentTopic.title}>
            {currentTopic.title}
          </span>
        </div>

        {/* Drawer Body with Embedded SocraticChat */}
        <div className={styles.drawerBody}>
          <SocraticChat
            key={currentTopic.chapterId}
            currentChapterId={currentTopic.chapterId}
            topicTitle={currentTopic.title}
            prefillText={prefillText}
          />
        </div>

        {/* Footer Disclaimer */}
        <div className={styles.drawerFooter}>
          <p className={styles.disclaimerText}>
            Educational physiological reasoning companion • Grounded in standard medical curriculum
          </p>
        </div>
      </aside>
    </>
  );
}
