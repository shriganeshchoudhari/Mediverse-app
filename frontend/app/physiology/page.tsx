import Link from 'next/link';
import styles from './page.module.css';

const simulators = [
  {
    title: 'Cardiac Cycle',
    emoji: '🫀',
    description: 'Interactive visualization of the Wiggers diagram, hemodynamics, and cardiac mechanics.',
    href: '/simulators/cardiac-cycle'
  },
  {
    title: 'Respiratory V/Q',
    emoji: '🫁',
    description: 'Explore ventilation-perfusion relationships, gas exchange, and pulmonary blood flow.',
    href: '/simulators/respiratory-vq'
  },
  {
    title: 'Renal Filtration',
    emoji: '💧',
    description: 'Understand GFR, tubular reabsorption, and secretion mechanisms in the nephron.',
    href: '/simulators/renal-filtration'
  },
  {
    title: 'Acid-Base Balance',
    emoji: '⚖️',
    description: 'Davenport diagrams, compensatory mechanisms, and blood gas analysis scenarios.',
    href: '/simulators/acid-base'
  },
  {
    title: 'Neurophysiology',
    emoji: '🧠',
    description: 'Action potentials, synaptic transmission, and neuromuscular junction mechanics.',
    href: '/simulators/nerve-muscle'
  },
  {
    title: 'Spirometry',
    emoji: '🌬️',
    description: 'Interactive flow-volume loops and lung volume assessments for obstructive/restrictive patterns.',
    href: '/simulators/spirometry'
  }
];

export default function PhysiologyHubPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Physiology</h1>
        <p className={styles.subtitle}>Integrated Systems Physiology for MBBS</p>
      </header>

      <section className={styles.simulatorGrid}>
        {simulators.map((sim, i) => (
          <Link href={sim.href} key={i} className={styles.card}>
            <div className={styles.cardIcon}>{sim.emoji}</div>
            <h2 className={styles.cardTitle}>{sim.title}</h2>
            <p className={styles.cardDesc}>{sim.description}</p>
          </Link>
        ))}
      </section>

      <div className={styles.footer}>
        <Link href="/subjects?domain=allopathic" className={styles.viewAllLink}>
          View All Physiology Subjects →
        </Link>
      </div>
    </div>
  );
}
