'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../config/AuthContext';
import styles from './page.module.css';

export type NodeType = 'subject' | 'unit' | 'chapter' | 'topic' | 'concept';

export interface TreeNodeItem {
  id: string;
  title: string;
  type: NodeType;
  code?: string;
  description?: string;
  category?: string;
  parentId?: string;
  children?: TreeNodeItem[];
}

const NEXT_CHILD_TYPE: Record<NodeType, NodeType | null> = {
  subject: 'unit',
  unit: 'chapter',
  chapter: 'topic',
  topic: 'concept',
  concept: null,
};

const TYPE_LABELS: Record<NodeType, string> = {
  subject: 'Subject',
  unit: 'Unit',
  chapter: 'Chapter',
  topic: 'Topic',
  concept: 'Concept',
};

const TYPE_STYLE_CLASSES: Record<NodeType, string> = {
  subject: styles.typeSubject,
  unit: styles.typeUnit,
  chapter: styles.typeChapter,
  topic: styles.typeTopic,
  concept: styles.typeConcept,
};

const INITIAL_TREE_DATA: TreeNodeItem[] = [
  {
    id: 'sub-anat-101',
    title: 'Human Anatomy',
    type: 'subject',
    code: 'ANAT-101',
    category: 'Pre-Clinical',
    description: 'Comprehensive study of human gross anatomy, embryology, histology, and neuroanatomy according to CBME guidelines.',
    children: [
      {
        id: 'unit-anat-upper-limb',
        title: 'Upper Limb',
        type: 'unit',
        code: 'ANAT-UL-01',
        description: 'Osteology, arthrology, myology, vascular supply, and innervation of the human upper extremity.',
        parentId: 'sub-anat-101',
        children: [
          {
            id: 'chap-pectoral-axilla',
            title: 'Pectoral Region & Axilla',
            type: 'chapter',
            code: 'ANAT-CH-01',
            description: 'Anatomy of pectoral muscles, mammary gland, axillary cavity, boundaries, and contents.',
            parentId: 'unit-anat-upper-limb',
            children: [
              {
                id: 'top-brachial-plexus',
                title: 'Brachial Plexus & Axillary Vessels',
                type: 'topic',
                code: 'ANAT-TOP-01',
                description: 'Detailed formation, cords, branches, and clinical lesions of the brachial plexus.',
                parentId: 'chap-pectoral-axilla',
                children: [
                  {
                    id: 'con-brachial-roots',
                    title: 'Roots & Trunks of Brachial Plexus',
                    type: 'concept',
                    code: 'ANAT-CON-01',
                    description: 'Supraclavicular branches and Erb-Duchenne palsy mechanisms.',
                    parentId: 'top-brachial-plexus',
                  },
                  {
                    id: 'con-cords-branches',
                    title: 'Cords & Terminal Nerve Branches',
                    type: 'concept',
                    code: 'ANAT-CON-02',
                    description: 'Infraclavicular branches, Klumpke paralysis, and peripheral nerve injuries.',
                    parentId: 'top-brachial-plexus',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'unit-anat-thorax',
        title: 'Thorax & Mediastinum',
        type: 'unit',
        code: 'ANAT-TH-02',
        description: 'Thoracic cage, pleural cavities, lungs, pericardium, and heart structures.',
        parentId: 'sub-anat-101',
        children: [
          {
            id: 'chap-heart-pericardium',
            title: 'Heart & Great Vessels',
            type: 'chapter',
            code: 'ANAT-CH-02',
            description: 'External and internal anatomy of the heart chambers, coronary circulation, and conducting system.',
            parentId: 'unit-anat-thorax',
            children: [
              {
                id: 'top-coronary-circulation',
                title: 'Coronary Arteries & Cardiac Veins',
                type: 'topic',
                code: 'ANAT-TOP-02',
                description: 'Right and left coronary artery anatomy, dominance, and myocardial infarction territories.',
                parentId: 'chap-heart-pericardium',
                children: [
                  {
                    id: 'con-coronary-anatomy',
                    title: 'Coronary Dominance & Anastomoses',
                    type: 'concept',
                    code: 'ANAT-CON-03',
                    description: 'Clinical anatomy of coronary artery occlusion and bypass graft sites.',
                    parentId: 'top-coronary-circulation',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'sub-phys-101',
    title: 'Medical Physiology',
    type: 'subject',
    code: 'PHYS-101',
    category: 'Pre-Clinical',
    description: 'Systemic human physiology, biophysical mechanisms, regulatory pathways, and homeostatic principles.',
    children: [
      {
        id: 'unit-phys-cvs',
        title: 'Cardiovascular Physiology',
        type: 'unit',
        code: 'PHYS-CVS-01',
        description: 'Cardiac electrophysiology, cardiac cycle, hemodynamics, and blood pressure regulation.',
        parentId: 'sub-phys-101',
        children: [
          {
            id: 'chap-cardiac-electrophysiology',
            title: 'Cardiac Action Potentials',
            type: 'chapter',
            code: 'PHYS-CH-01',
            description: 'Ion channels, automaticity, pacemaker potentials, and conduction pathways.',
            parentId: 'unit-phys-cvs',
            children: [
              {
                id: 'top-action-potential-phases',
                title: 'Fast vs Slow Response Action Potentials',
                type: 'topic',
                code: 'PHYS-TOP-01',
                description: 'Phase 0 to Phase 4 ion fluxes in nodal vs ventricular cardiomyocytes.',
                parentId: 'chap-cardiac-electrophysiology',
                children: [
                  {
                    id: 'con-sa-node-pacemaker',
                    title: 'SA Node Automaticity & Funny Currents (If)',
                    type: 'concept',
                    code: 'PHYS-CON-01',
                    description: 'Hyperpolarization-activated cyclic nucleotide-gated channels and autonomic modulation.',
                    parentId: 'top-action-potential-phases',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'sub-biochem-101',
    title: 'Medical Biochemistry',
    type: 'subject',
    code: 'BIOC-101',
    category: 'Pre-Clinical',
    description: 'Molecular biology, intermediary metabolism, clinical enzymology, and genetic mechanisms.',
    children: [
      {
        id: 'unit-biochem-metabolism',
        title: 'Carbohydrate Metabolism',
        type: 'unit',
        code: 'BIOC-MET-01',
        description: 'Glycolysis, TCA cycle, glycogen metabolism, and gluconeogenesis regulation.',
        parentId: 'sub-biochem-101',
        children: [
          {
            id: 'chap-glycolysis-tca',
            title: 'Glycolysis & Regulation',
            type: 'chapter',
            code: 'BIOC-CH-01',
            description: 'Key enzymes, ATP yield, anaerobic vs aerobic pathways, and clinical inborn errors.',
            parentId: 'unit-biochem-metabolism',
            children: [
              {
                id: 'top-glycolysis-enzymes',
                title: 'Rate Limiting Steps of Glycolysis',
                type: 'topic',
                code: 'BIOC-TOP-01',
                description: 'Hexokinase, PFK-1, and pyruvate kinase allosteric regulation.',
                parentId: 'chap-glycolysis-tca',
                children: [
                  {
                    id: 'con-pfk1-regulation',
                    title: 'Phosphofructokinase-1 & F-2,6-BP Regulation',
                    type: 'concept',
                    code: 'BIOC-CON-01',
                    description: 'Reciprocal hormonal control of glycolysis and gluconeogenesis by insulin and glucagon.',
                    parentId: 'top-glycolysis-enzymes',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function CMSTreePage() {
  const { token, user } = useAuth();

  const [treeData, setTreeData] = useState<TreeNodeItem[]>(INITIAL_TREE_DATA);
  const [selectedNode, setSelectedNode] = useState<TreeNodeItem | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'sub-anat-101': true,
    'unit-anat-upper-limb': true,
    'chap-pectoral-axilla': true,
    'top-brachial-plexus': true,
    'sub-phys-101': true,
    'unit-phys-cvs': true,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Modal State for adding/editing child or node
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTargetParent, setModalTargetParent] = useState<TreeNodeItem | null>(null);
  const [modalTargetType, setModalTargetType] = useState<NodeType>('subject');
  const [modalTitle, setModalTitle] = useState('');
  const [modalCode, setModalCode] = useState('');
  const [modalDescription, setModalDescription] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadCatalog() {
      setLoading(true);
      setErrorMsg('');
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
        const res = await fetch('/api/v1/curriculum/catalog', { headers });
        if (!res.ok) {
          throw new Error(`Catalog API responded with status ${res.status}`);
        }
        const data = await res.json();
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          const parsed = normalizeCatalogData(data);
          if (parsed.length > 0) {
            setTreeData(parsed);
            setSelectedNode(parsed[0]);
          }
        }
      } catch (err: unknown) {
        // Fallback to sample hierarchical tree when API is unavailable or returns 404 in dev
        if (!cancelled) {
          setTreeData(INITIAL_TREE_DATA);
          setSelectedNode(INITIAL_TREE_DATA[0]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCatalog();

    return () => {
      cancelled = true;
    };
  }, [token]);

  function normalizeCatalogData(rawData: any[]): TreeNodeItem[] {
    return rawData.map((subj: any, sIdx: number) => {
      const subjectId = subj.id || `sub-${sIdx}`;
      const units: TreeNodeItem[] = (subj.units || []).map((u: any, uIdx: number) => {
        const unitId = u.id || `unit-${sIdx}-${uIdx}`;
        const chapters: TreeNodeItem[] = (u.chapters || []).map((c: any, cIdx: number) => {
          const chapId = c.id || `chap-${sIdx}-${uIdx}-${cIdx}`;
          const topics: TreeNodeItem[] = (c.topics || []).map((t: any, tIdx: number) => {
            const topId = t.id || `top-${sIdx}-${uIdx}-${cIdx}-${tIdx}`;
            const concepts: TreeNodeItem[] = (t.concepts || []).map((con: any, conIdx: number) => ({
              id: con.id || `con-${sIdx}-${uIdx}-${cIdx}-${tIdx}-${conIdx}`,
              title: con.title || con.name || `Concept ${conIdx + 1}`,
              type: 'concept' as NodeType,
              code: con.code || `CON-${conIdx + 1}`,
              description: con.description || '',
              parentId: topId,
            }));

            return {
              id: topId,
              title: t.title || t.name || `Topic ${tIdx + 1}`,
              type: 'topic' as NodeType,
              code: t.code || `TOP-${tIdx + 1}`,
              description: t.description || '',
              parentId: chapId,
              children: concepts,
            };
          });

          return {
            id: chapId,
            title: c.title || c.name || `Chapter ${cIdx + 1}`,
            type: 'chapter' as NodeType,
            code: c.code || `CH-${cIdx + 1}`,
            description: c.description || '',
            parentId: unitId,
            children: topics,
          };
        });

        return {
          id: unitId,
          title: u.title || u.name || `Unit ${uIdx + 1}`,
          type: 'unit' as NodeType,
          code: u.code || `UNIT-${uIdx + 1}`,
          description: u.description || '',
          parentId: subjectId,
          children: chapters,
        };
      });

      // If raw data has flat chapters instead of nested units:
      let resolvedChildren = units;
      if (units.length === 0 && Array.isArray(subj.chapters) && subj.chapters.length > 0) {
        const defaultUnitId = `unit-${subjectId}-core`;
        const mappedChapters: TreeNodeItem[] = subj.chapters.map((ch: any, chIdx: number) => ({
          id: ch.id || `chap-${subjectId}-${chIdx}`,
          title: ch.title || `Chapter ${chIdx + 1}`,
          type: 'chapter' as NodeType,
          code: `CH-${chIdx + 1}`,
          description: ch.section || '',
          parentId: defaultUnitId,
          children: [],
        }));
        resolvedChildren = [
          {
            id: defaultUnitId,
            title: 'Core Curriculum Units',
            type: 'unit' as NodeType,
            code: 'UNIT-01',
            description: 'Core didactic modules',
            parentId: subjectId,
            children: mappedChapters,
          },
        ];
      }

      return {
        id: subjectId,
        title: subj.title || subj.name || `Subject ${sIdx + 1}`,
        type: 'subject' as NodeType,
        code: subj.code || `SUBJ-${sIdx + 1}`,
        category: subj.category || 'Core Medical',
        description: subj.description || 'Medical curriculum subject syllabus.',
        children: resolvedChildren,
      };
    });
  }

  function toggleExpand(nodeId: string, e?: React.MouseEvent) {
    if (e) e.stopPropagation();
    setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  }

  function selectNode(node: TreeNodeItem) {
    setSelectedNode(node);
  }

  function openAddModal(parent: TreeNodeItem | null, targetType: NodeType, e?: React.MouseEvent) {
    if (e) e.stopPropagation();
    setModalTargetParent(parent);
    setModalTargetType(targetType);
    setModalTitle('');
    setModalCode('');
    setModalDescription('');
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setModalTargetParent(null);
    setModalTitle('');
    setModalCode('');
    setModalDescription('');
  }

  function handleSaveNewNode(e: React.FormEvent) {
    e.preventDefault();
    if (!modalTitle.trim()) return;

    const newNode: TreeNodeItem = {
      id: generateId(modalTargetType),
      title: modalTitle.trim(),
      type: modalTargetType,
      code: modalCode.trim() || `${modalTargetType.toUpperCase().slice(0, 3)}-${Math.floor(100 + Math.random() * 900)}`,
      description: modalDescription.trim() || `Newly added ${modalTargetType} in the curriculum hierarchy.`,
      parentId: modalTargetParent ? modalTargetParent.id : undefined,
      children: modalTargetType === 'concept' ? undefined : [],
    };

    if (!modalTargetParent) {
      // Adding top-level subject
      setTreeData(prev => [...prev, newNode]);
    } else {
      // Recursively add child node
      const addChildRecursive = (nodes: TreeNodeItem[]): TreeNodeItem[] => {
        return nodes.map(n => {
          if (n.id === modalTargetParent?.id) {
            return {
              ...n,
              children: [...(n.children || []), newNode],
            };
          }
          if (n.children && n.children.length > 0) {
            return { ...n, children: addChildRecursive(n.children) };
          }
          return n;
        });
      };

      setTreeData(prev => addChildRecursive(prev));
      // Auto-expand parent node
      setExpandedNodes(prev => ({ ...prev, [modalTargetParent.id]: true }));
    }

    setSelectedNode(newNode);
    setSuccessMsg(`Added ${TYPE_LABELS[modalTargetType]} "${newNode.title}" successfully.`);
    setTimeout(() => setSuccessMsg(''), 4000);
    closeModal();
  }

  function getBreadcrumbs(node: TreeNodeItem): { id: string; title: string; type: NodeType }[] {
    const crumbs: { id: string; title: string; type: NodeType }[] = [];

    function findPath(currentNodes: TreeNodeItem[], targetId: string, path: TreeNodeItem[]): boolean {
      for (const n of currentNodes) {
        const currentPath = [...path, n];
        if (n.id === targetId) {
          crumbs.push(...currentPath.map(p => ({ id: p.id, title: p.title, type: p.type })));
          return true;
        }
        if (n.children && n.children.length > 0) {
          if (findPath(n.children, targetId, currentPath)) {
            return true;
          }
        }
      }
      return false;
    }

    findPath(treeData, node.id, []);
    return crumbs;
  }

  function countDescendants(node: TreeNodeItem): number {
    if (!node.children || node.children.length === 0) return 0;
    return node.children.reduce((acc, child) => acc + 1 + countDescendants(child), 0);
  }

  function renderTreeNodes(nodes: TreeNodeItem[], level: number = 0) {
    return nodes.map(node => {
      const isExpanded = !!expandedNodes[node.id];
      const isSelected = selectedNode?.id === node.id;
      const nextType = NEXT_CHILD_TYPE[node.type];
      const hasChildren = node.children && node.children.length > 0;

      return (
        <div key={node.id} className={styles.treeNode}>
          <div
            className={`${styles.treeNodeRow} ${isSelected ? styles.treeNodeRowActive : ''}`}
            onClick={() => selectNode(node)}
          >
            <div className={styles.treeNodeLeft}>
              {node.type !== 'concept' ? (
                <button
                  type="button"
                  className={styles.expandBtn}
                  onClick={(e) => toggleExpand(node.id, e)}
                  aria-label={isExpanded ? 'Collapse' : 'Expand'}
                >
                  {isExpanded ? '▼' : '▶'}
                </button>
              ) : (
                <span className={styles.expandPlaceholder} />
              )}
              <span className={`${styles.treeNodeType} ${TYPE_STYLE_CLASSES[node.type]}`}>
                {TYPE_LABELS[node.type]}
              </span>
              <span className={styles.treeNodeTitle} title={node.title}>
                {node.title}
              </span>
            </div>

            <div className={styles.treeNodeActions}>
              {nextType && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={(e) => openAddModal(node, nextType, e)}
                  title={`Add ${TYPE_LABELS[nextType]}`}
                >
                  + {TYPE_LABELS[nextType]}
                </button>
              )}
            </div>
          </div>

          {isExpanded && hasChildren && (
            <div className={styles.nodeChildren}>
              {renderTreeNodes(node.children!, level + 1)}
            </div>
          )}
        </div>
      );
    });
  }

  if (!user) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Access Denied</h1>
            <p className={styles.subtitle}>You must be logged in to access the Curriculum Tree Editor.</p>
          </div>
        </div>
      </div>
    );
  }

  const activeBreadcrumbs = selectedNode ? getBreadcrumbs(selectedNode) : [];
  const nextChildType = selectedNode ? NEXT_CHILD_TYPE[selectedNode.type] : null;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>🌳 Curriculum Tree Editor</h1>
          <p className={styles.subtitle}>
            Manage and structure curriculum hierarchy: Subjects &gt; Units &gt; Chapters &gt; Topics &gt; Concepts.
          </p>
        </div>
        <div className={styles.navLinks}>
          <Link href="/cms" className={styles.navLink}>
            Review Queue
          </Link>
          <Link href="/cms/editor" className={styles.navLink}>
            Lesson Editor
          </Link>
        </div>
      </div>

      {successMsg && <div className={styles.success}>✅ {successMsg}</div>}
      {errorMsg && <div className={styles.error}>❌ {errorMsg}</div>}

      <div className={styles.treeContainer}>
        {/* Left Sidebar Tree Navigation */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTop}>
            <h2 className={styles.sidebarTitle}>Curriculum Hierarchy</h2>
            <button
              type="button"
              className={styles.addRootBtn}
              onClick={() => openAddModal(null, 'subject')}
            >
              + Add Subject
            </button>
          </div>

          {loading ? (
            <div className={styles.loading}>Loading curriculum tree...</div>
          ) : treeData.length === 0 ? (
            <div className={styles.empty}>No subjects found in curriculum catalog.</div>
          ) : (
            <div>{renderTreeNodes(treeData)}</div>
          )}
        </aside>

        {/* Right Main Content Area */}
        <main className={styles.mainContent}>
          {selectedNode ? (
            <div className={styles.detailsCard}>
              <div className={styles.detailsHeader}>
                <div>
                  <div className={styles.breadcrumb}>
                    {activeBreadcrumbs.map((crumb, idx) => (
                      <React.Fragment key={crumb.id}>
                        {idx > 0 && <span className={styles.breadcrumbSeparator}>/</span>}
                        <span className={styles.breadcrumbItem}>
                          {crumb.title}
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                  <h2 className={styles.detailsTitle}>{selectedNode.title}</h2>
                </div>
                <span className={`${styles.treeNodeType} ${TYPE_STYLE_CLASSES[selectedNode.type]}`}>
                  {TYPE_LABELS[selectedNode.type]}
                </span>
              </div>

              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Code Identifier</span>
                  <span className={styles.detailValue}>{selectedNode.code || 'N/A'}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Type Level</span>
                  <span className={styles.detailValue}>{TYPE_LABELS[selectedNode.type]}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Direct Children</span>
                  <span className={styles.detailValue}>{selectedNode.children ? selectedNode.children.length : 0}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Total Sub-elements</span>
                  <span className={styles.detailValue}>{countDescendants(selectedNode)}</span>
                </div>
              </div>

              <div className={styles.detailsSection}>
                <h3 className={styles.sectionTitle}>Description & Objectives</h3>
                <p className={styles.descriptionText}>
                  {selectedNode.description || 'No description provided for this curriculum node.'}
                </p>
              </div>

              {selectedNode.children && selectedNode.children.length > 0 && (
                <div className={styles.detailsSection}>
                  <h3 className={styles.sectionTitle}>
                    Sub-elements ({selectedNode.children.length} {nextChildType ? TYPE_LABELS[nextChildType] + 's' : ''})
                  </h3>
                  <div className={styles.childrenList}>
                    {selectedNode.children.map(child => (
                      <div
                        key={child.id}
                        className={styles.childCard}
                        onClick={() => selectNode(child)}
                      >
                        <div className={styles.childCardTitle}>
                          {child.title}
                        </div>
                        <span className={`${styles.treeNodeType} ${TYPE_STYLE_CLASSES[child.type]}`}>
                          {TYPE_LABELS[child.type]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.actionBar}>
                {nextChildType && (
                  <button
                    type="button"
                    className={styles.primaryActionBtn}
                    onClick={() => openAddModal(selectedNode, nextChildType)}
                  >
                    + Add {TYPE_LABELS[nextChildType]}
                  </button>
                )}

                <Link
                  href={`/cms/editor?title=${encodeURIComponent(selectedNode.title)}&subjectCode=${encodeURIComponent(selectedNode.code || '')}`}
                  className={styles.primaryActionBtn}
                >
                  📝 Author Lesson for this Node
                </Link>

                <button
                  type="button"
                  className={styles.secondaryActionBtn}
                  onClick={() => {
                    setModalTargetParent(null);
                    setModalTargetType(selectedNode.type);
                    setModalTitle(selectedNode.title);
                    setModalCode(selectedNode.code || '');
                    setModalDescription(selectedNode.description || '');
                    setIsModalOpen(true);
                  }}
                >
                  ✏️ Edit Metadata
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.empty}>
              Select any node from the curriculum hierarchy on the left to view details and author lessons.
            </div>
          )}
        </main>
      </div>

      {/* Modal for adding / editing a node */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {modalTargetParent
                  ? `Add New ${TYPE_LABELS[modalTargetType]} to "${modalTargetParent.title}"`
                  : `Add New ${TYPE_LABELS[modalTargetType]}`}
              </h3>
              <button
                type="button"
                className={styles.closeModalBtn}
                onClick={closeModal}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <form className={styles.modalForm} onSubmit={handleSaveNewNode}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="modal-title">
                  {TYPE_LABELS[modalTargetType]} Title *
                </label>
                <input
                  id="modal-title"
                  className={styles.input}
                  value={modalTitle}
                  onChange={e => setModalTitle(e.target.value)}
                  placeholder={`e.g., ${modalTargetType === 'subject' ? 'Human Pathology' : modalTargetType === 'unit' ? 'Cardiovascular Pathology' : modalTargetType === 'chapter' ? 'Ischemic Heart Disease' : modalTargetType === 'topic' ? 'Myocardial Infarction Pathology' : 'Coagulative Necrosis Mechanisms'}`}
                  required
                  autoFocus
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="modal-code">
                  Code / Identifier
                </label>
                <input
                  id="modal-code"
                  className={styles.input}
                  value={modalCode}
                  onChange={e => setModalCode(e.target.value)}
                  placeholder={`e.g., ${modalTargetType.toUpperCase().slice(0, 4)}-101`}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="modal-desc">
                  Description / Syllabus Objectives
                </label>
                <textarea
                  id="modal-desc"
                  className={styles.textarea}
                  value={modalDescription}
                  onChange={e => setModalDescription(e.target.value)}
                  placeholder="Outline the competencies, topics, and clinical objectives..."
                />
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className={styles.saveBtn}>
                  Save {TYPE_LABELS[modalTargetType]}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
