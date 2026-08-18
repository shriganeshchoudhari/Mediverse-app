import { useState, useCallback, useRef } from 'react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: { title: string; chapter: string; page: number }[];
  isStreaming?: boolean;
}

export function useSocraticChatStream(endpointUrl: string = '/api/v1/ai-tutor/chat/stream') {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (userPrompt: string) => {
    if (!userPrompt.trim() || isGenerating) return;

    const userMsgId = `user-${Date.now()}`;
    const assistantMsgId = `asst-${Date.now()}`;

    const newUserMessage: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      content: userPrompt,
      timestamp: new Date().toISOString(),
    };

    const newAssistantMessage: ChatMessage = {
      id: assistantMsgId,
      sender: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, newUserMessage, newAssistantMessage]);
    setIsGenerating(true);
    setError(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userPrompt }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`AI Tutor HTTP Error: ${response.status} ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('Readable stream not supported by browser.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedContent += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? { ...msg, content: accumulatedContent }
              : msg
          )
        );
      }

      // Mark streaming as complete
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId ? { ...msg, isStreaming: false } : msg
        )
      );
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('Chat generation aborted by user.');
      } else {
        const errorMsg = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(errorMsg);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? {
                  ...msg,
                  content:
                    msg.content ||
                    '⚠️ Unable to reach the AI Socratic Tutor service. Please verify network connection.',
                  isStreaming: false,
                }
              : msg
          )
        );
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  }, [endpointUrl, isGenerating]);

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isGenerating,
    error,
    sendMessage,
    stopGeneration,
    clearChat,
  };
}
