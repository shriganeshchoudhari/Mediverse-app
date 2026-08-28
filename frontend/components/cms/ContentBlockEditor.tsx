'use client';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const BLOCK_TYPES = [
  { value: 'TEXT', label: '📝 Text / Markdown', desc: 'Prose, lists, tables' },
  { value: 'QUIZ', label: '❓ MCQ Quiz', desc: 'Multiple-choice questions' },
  { value: 'FLASHCARD', label: '🃏 Flashcard Set', desc: 'Spaced repetition cards' },
  { value: 'DIAGRAM', label: '📊 Mermaid Diagram', desc: 'Flowchart or sequence diagram' },
  { value: 'FORMULA', label: '🧮 Formula Block', desc: 'LaTeX mathematical formula' },
  { value: 'CALLOUT', label: '💎 Callout Block', desc: 'Clinical pearl, exam trap, etc.' },
];

interface ContentBlock {
  id?: string;
  blockType: string;
  contentPayload: string;
  sortOrder: number;
}

interface ContentBlockEditorProps {
  block?: Partial<ContentBlock>;
  lessonId: string;
  onSave: (block: ContentBlock) => void;
  onCancel: () => void;
}

export default function ContentBlockEditor({ block, lessonId, onSave, onCancel }: ContentBlockEditorProps) {
  const [blockType, setBlockType] = useState(block?.blockType ?? 'TEXT');
  const [content, setContent] = useState(block?.contentPayload ?? '');
  const [sortOrder, setSortOrder] = useState(block?.sortOrder ?? 1);
  const [tab, setTab] = useState<'edit' | 'preview'>('edit');
  const [saving, setSaving] = useState(false);

  const placeholders: Record<string, string> = {
    TEXT: '## Step 5. Physiology\n\nExplain the mechanism here...\n\n:::pearl\nClinical pearl text\n:::',
    QUIZ: '**Q1.** Which of the following is correct?\n\n- A) Option A\n- B) Option B ✓\n- C) Option C\n- D) Option D\n\n**Explanation:** Because...',
    FLASHCARD: '- **Front**: What is the normal GFR?\n  **Back**: 90-120 mL/min\n\n- **Front**: Define anion gap\n  **Back**: Na - (Cl + HCO3), normal 8-12',
    DIAGRAM: '```mermaid\ngraph TD\n  A[Start] --> B{Condition}\n  B -->|Yes| C[Result A]\n  B -->|No| D[Result B]\n```',
    FORMULA: '$$ GFR = K_f \\times [(P_{GC} - P_{BS}) - (\\pi_{GC} - \\pi_{BS})] $$',
    CALLOUT: ':::trap\nCommon exam trap: Students confuse X with Y because...\n:::',
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      onSave({ id: block?.id, blockType, contentPayload: content, sortOrder });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '1rem', padding: '1.5rem', marginTop: '1rem' }}>
      <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', marginBottom: '1rem' }}>
        {block?.id ? '✏️ Edit Content Block' : '➕ New Content Block'}
      </div>

      {/* Block type selector */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>Block Type</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
          {BLOCK_TYPES.map(t => (
            <button
              key={t.value}
              type="button"
              title={t.desc}
              onClick={() => { setBlockType(t.value); if (!content) setContent(placeholders[t.value] ?? ''); }}
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.7rem', fontWeight: 700,
                borderRadius: '0.5rem',
                border: blockType === t.value ? '1px solid rgba(59,130,246,0.6)' : '1px solid rgba(51,65,85,0.5)',
                background: blockType === t.value ? 'rgba(59,130,246,0.15)' : 'rgba(30,41,59,0.6)',
                color: blockType === t.value ? '#93c5fd' : '#64748b',
                cursor: 'pointer',
              }}
            >{t.label}</button>
          ))}
        </div>
      </div>

      {/* Sort order */}
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>Sort Order</label>
        <input
          type="number"
          value={sortOrder}
          min={1}
          onChange={e => setSortOrder(Number(e.target.value))}
          style={{ width: 70, padding: '0.35rem 0.5rem', background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(51,65,85,0.6)', borderRadius: '0.375rem', color: '#e2e8f0', fontSize: '0.8rem' }}
        />
      </div>

      {/* Edit / Preview tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: '0.5rem', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid rgba(51,65,85,0.5)', width: 'fit-content' }}>
        {(['edit', 'preview'] as const).map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            style={{
              padding: '0.35rem 1rem', fontSize: '0.7rem', fontWeight: 700,
              background: tab === t ? 'rgba(59,130,246,0.15)' : 'transparent',
              color: tab === t ? '#60a5fa' : '#64748b',
              border: 'none', cursor: 'pointer', textTransform: 'capitalize',
            }}
          >{t}</button>
        ))}
      </div>

      {tab === 'edit' ? (
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={placeholders[blockType] ?? 'Enter content...'}
          rows={14}
          style={{
            width: '100%', boxSizing: 'border-box',
            background: 'rgba(2,8,23,0.8)',
            border: '1px solid rgba(51,65,85,0.6)',
            borderRadius: '0.625rem',
            color: '#e2e8f0', fontSize: '0.8rem', fontFamily: 'ui-monospace, monospace',
            lineHeight: 1.6, padding: '0.875rem',
            resize: 'vertical',
          }}
        />
      ) : (
        <div style={{
          minHeight: 200,
          background: 'rgba(2,8,23,0.8)',
          border: '1px solid rgba(51,65,85,0.6)',
          borderRadius: '0.625rem',
          padding: '1rem',
          color: '#e2e8f0', fontSize: '0.85rem', lineHeight: 1.7,
        }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || '*No content yet...*'}</ReactMarkdown>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.625rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
        <button type="button" onClick={onCancel}
          style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 700, background: 'transparent', border: '1px solid rgba(51,65,85,0.6)', borderRadius: '0.5rem', color: '#64748b', cursor: 'pointer' }}
        >Cancel</button>
        <button type="button" onClick={handleSave} disabled={saving || !content.trim()}
          style={{ padding: '0.5rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, background: saving ? 'rgba(59,130,246,0.3)' : '#2563eb', border: 'none', borderRadius: '0.5rem', color: '#fff', cursor: 'pointer', opacity: !content.trim() ? 0.5 : 1 }}
        >{saving ? 'Saving...' : 'Save Block'}</button>
      </div>
    </div>
  );
}
