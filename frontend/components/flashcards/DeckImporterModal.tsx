'use client';

import React, { useState } from 'react';
import { X, Upload, Plus, FileText, CheckCircle } from 'lucide-react';

export interface ImportedCard {
  deck: string;
  front: string;
  back: string;
  type?: 'standard' | 'cloze' | 'image';
  imageUrl?: string;
}

interface DeckImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (cards: ImportedCard[]) => void;
  availableDecks: string[];
}

export default function DeckImporterModal({
  isOpen,
  onClose,
  onImport,
  availableDecks,
}: DeckImporterModalProps) {
  const [activeTab, setActiveTab] = useState<'single' | 'batch'>('single');
  const [selectedDeck, setSelectedDeck] = useState<string>(availableDecks[0] || 'Cardiovascular');
  const [newDeckName, setNewDeckName] = useState('');
  
  // Single card form
  const [cardType, setCardType] = useState<'standard' | 'cloze' | 'image'>('standard');
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Batch paste area
  const [batchText, setBatchText] = useState(
    `What is the primary pacemaker of the heart?\tSinoatrial (SA) node (intrinsic rate 60-100 bpm)
The {{c1::Loop of Henle}} creates a hyperosmotic renal medullary gradient.\tCountercurrent multiplier mechanism.
Which heart valve is bicuspid?\tMitral valve (left atrioventricular valve).`
  );
  const [batchDelimiter, setBatchDelimiter] = useState<'tab' | 'semicolon' | 'comma'>('tab');

  if (!isOpen) return null;

  const targetDeck = newDeckName.trim() ? newDeckName.trim() : selectedDeck;

  const handleAddSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!frontText.trim()) return;

    const newCard: ImportedCard = {
      deck: targetDeck,
      front: frontText.trim(),
      back: backText.trim() || 'Review front card context.',
      type: cardType,
      imageUrl: imageUrl.trim() || undefined,
    };

    onImport([newCard]);
    setFrontText('');
    setBackText('');
    setImageUrl('');
    onClose();
  };

  const handleBatchImport = () => {
    if (!batchText.trim()) return;

    const delimChar = batchDelimiter === 'tab' ? '\t' : batchDelimiter === 'semicolon' ? ';' : ',';
    const lines = batchText.split('\n');
    const parsed: ImportedCard[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const parts = trimmed.split(delimChar);
      if (parts.length >= 2) {
        const front = parts[0].trim();
        const back = parts.slice(1).join(' ').trim();
        const isCloze = front.includes('{{c') || front.includes('[...]');

        parsed.push({
          deck: targetDeck,
          front,
          back,
          type: isCloze ? 'cloze' : 'standard',
        });
      } else if (parts.length === 1 && parts[0].includes('{{c')) {
        parsed.push({
          deck: targetDeck,
          front: parts[0].trim(),
          back: 'Cloze recall complete.',
          type: 'cloze',
        });
      }
    }

    if (parsed.length > 0) {
      onImport(parsed);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create & Import Flashcards</h3>
              <p className="text-xs text-slate-400">Add custom clinical cards or paste Anki / Quizlet decks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Deck Selection Row */}
        <div className="py-4 border-b border-slate-800/80 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex-1 w-full">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Select Deck
            </label>
            <select
              value={selectedDeck}
              onChange={(e) => {
                setSelectedDeck(e.target.value);
                setNewDeckName('');
              }}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              {availableDecks.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Or Create New Deck
            </label>
            <input
              type="text"
              placeholder="e.g. Pharmacology Boards..."
              value={newDeckName}
              onChange={(e) => setNewDeckName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 pt-4">
          <button
            onClick={() => setActiveTab('single')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'single'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/30'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> Single Card
          </button>
          <button
            onClick={() => setActiveTab('batch')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'batch'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/30'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Batch Paste (Anki / TSV)
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto py-4">
          {activeTab === 'single' ? (
            <form onSubmit={handleAddSingle} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Card Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['standard', 'cloze', 'image'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setCardType(t)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition ${
                        cardType === t
                          ? 'bg-sky-500/15 border-sky-500 text-sky-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {t === 'cloze' ? 'Cloze Deletion' : t === 'image' ? 'Image / Diagram' : 'Standard Q&A'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  {cardType === 'cloze'
                    ? 'Card Text with Cloze: e.g. {{c1::Answer}}'
                    : 'Front (Question / Prompt)'}
                </label>
                <textarea
                  rows={cardType === 'cloze' ? 4 : 3}
                  required
                  placeholder={
                    cardType === 'cloze'
                      ? 'The {{c1::SA node}} is located in the right atrium and initiates normal cardiac rhythm.'
                      : 'Which transporter is inhibited by Furosemide in the thick ascending limb?'
                  }
                  value={frontText}
                  onChange={(e) => setFrontText(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-sky-500 leading-relaxed font-mono"
                />
              </div>

              {cardType !== 'cloze' && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Back (Answer / Clinical Rationale)
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="NKCC2 cotransporter (Na-K-2Cl symporter)."
                    value={backText}
                    onChange={(e) => setBackText(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-sky-500 leading-relaxed"
                  />
                </div>
              )}

              {cardType === 'image' && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Image / Diagram URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-... or /assets/anatomy/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-900/30 transition flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" /> Save Card
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Delimiter between Front and Back:
                </span>
                <div className="flex gap-1.5">
                  {(['tab', 'semicolon', 'comma'] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setBatchDelimiter(d)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase ${
                        batchDelimiter === d
                          ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                          : 'bg-slate-950 text-slate-500 border border-slate-800'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={9}
                value={batchText}
                onChange={(e) => setBatchText(e.target.value)}
                placeholder="Paste Tab-separated lines here: Front[Tab]Back"
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-sky-500 font-mono leading-relaxed"
              />

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-[11px] text-slate-400">
                <strong className="text-sky-400">Cloze format supported:</strong> Type{' '}
                <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded">
                  {'The {{c1::target word}} is masked.'}
                </code>{' '}
                to automatically generate cloze cards.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleBatchImport}
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-900/30 transition flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" /> Import All Cards
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
