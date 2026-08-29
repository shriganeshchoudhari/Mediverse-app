'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSocraticChatStream } from '../../hooks/useSocraticChatStream';
import styles from './SocraticChat.module.css';

interface SocraticChatProps {
  currentChapterId?: string;
  topicTitle?: string;
  prefillText?: string;
}

export default function SocraticChat({ currentChapterId = 'general', topicTitle = 'Physiology Tutor', prefillText }: SocraticChatProps) {
  const [inputVal, setInputVal] = useState('');
  const [mode, setMode] = useState<'socratic' | 'direct'>('socratic');
  const { messages, setMessages, isGenerating, sendMessage, stopGeneration, clearChat } = useSocraticChatStream();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefillText) {
      setInputVal(`Explain this to me: "${prefillText}"`);
    }
  }, [prefillText]);

  // Save messages
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(`socratic-chat-${currentChapterId}`, JSON.stringify(messages.slice(-30)));
      } catch {}
    }
  }, [messages, currentChapterId]);

  // Load messages on chapter change
  useEffect(() => {
    if (typeof setMessages !== 'function') return;
    try {
      const saved = localStorage.getItem(`socratic-chat-${currentChapterId}`);
      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        setMessages([]);
      }
    } catch {
      setMessages([]);
    }
  }, [currentChapterId, setMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getSystemPrompt = () => {
    if (mode === 'direct') {
      return "You are a medical education assistant. Answer the student's question directly, clearly, and concisely with clinical accuracy.";
    }
    return undefined; // keep the existing Socratic prompt
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isGenerating) return;
    sendMessage(inputVal, getSystemPrompt());
    setInputVal('');
  };

  const generateClinicalCase = () => {
    if (isGenerating) return;
    sendMessage(`Generate a clinical case scenario for: ${topicTitle}. Include: chief complaint, history, examination findings, key investigations, and the diagnosis.`, getSystemPrompt());
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <div className={styles.headerTitle}>
          <span className={styles.statusDot}></span>
          <span>AI Socratic Tutor: {topicTitle}</span>
        </div>
        <button
          onClick={clearChat}
          className="text-xs text-slate-400 hover:text-slate-200 transition"
        >
          Clear
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem 0.75rem', borderBottom: '1px solid rgba(51,65,85,0.4)', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.65rem', color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Mode</span>
        <div style={{ display: 'flex', background: 'rgba(15,23,42,0.8)', borderRadius: '0.5rem', border: '1px solid rgba(51,65,85,0.5)', overflow: 'hidden' }}>
          {(['socratic', 'direct'] as const).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              style={{
                padding: '0.25rem 0.75rem',
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'capitalize',
                background: mode === m ? 'rgba(59,130,246,0.2)' : 'transparent',
                color: mode === m ? '#60a5fa' : '#475569',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >{m}</button>
          ))}
        </div>
      </div>

      <div className={styles.messageArea} ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 p-6">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3">
              💡
            </div>
            <p className="text-sm font-medium text-slate-300">Welcome to your Socratic Companion!</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Ask anything about physiological mechanisms, equations, or clinical correlations. I will guide your reasoning step-by-step.
            </p>
            <button
              type="button"
              onClick={generateClinicalCase}
              className="mt-4 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-medium transition"
            >
              Generate Clinical Case
            </button>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.messageBubble} ${
                msg.sender === 'user' ? styles.userMessage : styles.assistantMessage
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.isStreaming && (
                <span className="inline-block w-1.5 h-3 bg-blue-400 ml-1 animate-pulse" />
              )}
              {msg.citations && msg.citations.length > 0 && (
                <div className={styles.citationCard}>
                  <strong>References:</strong>
                  {msg.citations.map((c, i) => (
                    <div key={i} className="mt-0.5">
                      📖 {c.title} — {c.chapter} (p. {c.page})
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <form className={styles.inputArea} onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={`Ask a question about ${topicTitle}...`}
          className={styles.chatInput}
          disabled={isGenerating}
        />
        {isGenerating ? (
          <button
            type="button"
            onClick={stopGeneration}
            className="px-3 py-1.5 bg-red-600/80 hover:bg-red-500 text-white rounded-lg text-xs font-medium transition"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className={styles.sendButton}
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
}
