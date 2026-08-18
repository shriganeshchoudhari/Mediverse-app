'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSocraticChatStream } from '../../hooks/useSocraticChatStream';
import styles from './SocraticChat.module.css';

interface SocraticChatProps {
  currentChapterId?: string;
  topicTitle?: string;
}

export default function SocraticChat({ currentChapterId = 'general', topicTitle = 'Physiology Tutor' }: SocraticChatProps) {
  const [inputVal, setInputVal] = useState('');
  const { messages, isGenerating, sendMessage, stopGeneration, clearChat } = useSocraticChatStream();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isGenerating) return;
    sendMessage(inputVal);
    setInputVal('');
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
