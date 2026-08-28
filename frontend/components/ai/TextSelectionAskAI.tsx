'use client';
import React, { useEffect, useState, useCallback } from 'react';

interface TextSelectionAskAIProps {
  onAskAI: (selectedText: string) => void;
  containerRef?: React.RefObject<HTMLElement>;
}

export default function TextSelectionAskAI({ onAskAI }: TextSelectionAskAIProps) {
  const [popup, setPopup] = useState<{ x: number; y: number; text: string } | null>(null);

  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setPopup(null);
      return;
    }
    const text = selection.toString().trim();
    if (text.length < 10 || text.length > 500) {
      setPopup(null);
      return;
    }
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    setPopup({
      x: rect.left + rect.width / 2,
      y: rect.top + window.scrollY - 48,
      text,
    });
  }, []);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-ask-ai-popup]')) return;
    setPopup(null);
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [handleMouseUp, handleMouseDown]);

  if (!popup) return null;

  return (
    <div
      data-ask-ai-popup
      style={{
        position: 'absolute',
        left: popup.x,
        top: popup.y,
        transform: 'translateX(-50%)',
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        gap: '0.375rem',
        background: '#1e3a5f',
        border: '1px solid rgba(59,130,246,0.5)',
        borderRadius: '0.625rem',
        padding: '0.375rem 0.75rem',
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        cursor: 'pointer',
        fontSize: '0.75rem',
        fontWeight: 700,
        color: '#93c5fd',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        animation: 'fadeIn 0.15s ease-out',
      }}
      onClick={() => {
        onAskAI(popup.text);
        setPopup(null);
        window.getSelection()?.removeAllRanges();
      }}
    >
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateX(-50%) translateY(4px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }`}</style>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" />
      </svg>
      Ask AI
    </div>
  );
}
