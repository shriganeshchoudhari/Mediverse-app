'use client';

import React, { useState } from 'react';
import styles from './ClinicalDecisionTree.module.css';

export interface DecisionNodeOption {
  label: string;
  nextNodeId: string;
}

export interface DecisionNode {
  id: string;
  prompt: string;
  options?: DecisionNodeOption[];
  conclusion?: string;
}

export interface DecisionTreeData {
  title?: string;
  initialNodeId: string;
  nodes: DecisionNode[];
}

interface ClinicalDecisionTreeProps {
  data: DecisionTreeData;
}

export default function ClinicalDecisionTree({ data }: ClinicalDecisionTreeProps) {
  const [currentNodeId, setCurrentNodeId] = useState<string>(data.initialNodeId || data.nodes[0]?.id);
  const [history, setHistory] = useState<string[]>([]);

  const nodeMap = React.useMemo(() => {
    const map = new Map<string, DecisionNode>();
    data.nodes.forEach(n => map.set(n.id, n));
    return map;
  }, [data.nodes]);

  const currentNode = nodeMap.get(currentNodeId) || data.nodes[0];

  const handleSelectOption = (nextNodeId: string) => {
    setHistory(prev => [...prev, currentNodeId]);
    setCurrentNodeId(nextNodeId);
  };

  const handleReset = () => {
    setCurrentNodeId(data.initialNodeId || data.nodes[0]?.id);
    setHistory([]);
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const previousNodeId = history[history.length - 1];
    setHistory(prev => prev.slice(0, prev.length - 1));
    setCurrentNodeId(previousNodeId);
  };

  return (
    <div className={styles.treeContainer}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <span className={styles.icon}>🔀</span>
          <h4 className={styles.title}>{data.title || 'Interactive Clinical Decision Pathway'}</h4>
          <span className={styles.badge}>Algorithmic Triage</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {history.length > 0 && (
            <button type="button" className={styles.resetBtn} onClick={handleBack}>
              ← Back
            </button>
          )}
          <button type="button" className={styles.resetBtn} onClick={handleReset}>
            ↺ Restart
          </button>
        </div>
      </div>

      <div className={styles.stepTrail}>
        <span>Pathway: </span>
        <span className={styles.stepPill}>Step 1</span>
        {history.map((_, idx) => (
          <React.Fragment key={idx}>
            <span> › </span>
            <span className={styles.stepPill}>Step {idx + 2}</span>
          </React.Fragment>
        ))}
      </div>

      {currentNode && (
        <div className={styles.currentNodeCard} key={currentNode.id}>
          <div className={styles.nodePrompt}>{currentNode.prompt}</div>

          {currentNode.options && currentNode.options.length > 0 && (
            <div className={styles.optionsGrid}>
              {currentNode.options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  className={styles.optionBtn}
                  onClick={() => handleSelectOption(opt.nextNodeId)}
                >
                  <span>{opt.label}</span>
                  <span className={styles.arrowIcon}>→</span>
                </button>
              ))}
            </div>
          )}

          {currentNode.conclusion && (
            <div className={styles.conclusionCard}>
              <div className={styles.conclusionHeader}>
                <span>✅</span>
                <span>Clinical Decision & Management Plan</span>
              </div>
              <div className={styles.conclusionBody}>{currentNode.conclusion}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
