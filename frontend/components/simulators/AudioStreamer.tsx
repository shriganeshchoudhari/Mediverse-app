'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';

export default function AudioStreamer() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<string>('Press the microphone to start the consultation...');
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Connect WebSocket
  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8085';
    const ws = new WebSocket(`${wsUrl}/ws/telehealth`);
    
    ws.onopen = () => {
      console.log('Telehealth WS Connected');
    };
    
    ws.onmessage = (event) => {
      if (typeof event.data === 'string') {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'transcript') {
             setTranscript(prev => prev + '\nAI: ' + data.message);
          } else if (data.type === 'connection_established') {
             setTranscript('Connected to AI Patient. Ready to begin.');
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        // Handle incoming binary audio chunks from Gemini
        console.log('Received audio chunk from AI');
      }
    };
    
    ws.onerror = (e) => {
      console.error('WS Error', e);
      setError('Connection lost to AI engine.');
    };
    
    wsRef.current = ws;
    
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(event.data);
        }
      };
      
      mediaRecorder.start(250); // Send chunks every 250ms
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setError(null);
      setTranscript(prev => prev + '\nDoctor: [Listening...]');
      
    } catch (err) {
      console.error('Mic error:', err);
      setError('Microphone access denied. Please allow permissions.');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg flex items-center gap-2 text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}
      
      <div className="flex items-center gap-6">
        <button
          onClick={toggleRecording}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse ring-4 ring-red-500/30' 
              : 'bg-blue-600 hover:bg-blue-500'
          }`}
        >
          {isRecording ? <MicOff className="text-white w-6 h-6" /> : <Mic className="text-white w-6 h-6" />}
        </button>
        
        <div className="flex-1 bg-slate-950 rounded-xl p-4 h-32 overflow-y-auto border border-slate-800 font-mono text-sm text-slate-300 whitespace-pre-wrap">
          {transcript}
        </div>
      </div>
    </div>
  );
}
