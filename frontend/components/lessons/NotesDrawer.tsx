"use client";

import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

interface NotesDrawerProps {
  chapterId: string;
}

export default function NotesDrawer({ chapterId }: NotesDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write your notes here... (e.g. key takeaways, doubts, formulas)',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm sm:prose-base focus:outline-none max-w-none min-h-[300px]',
      },
    },
    onUpdate: () => {
      // Clear save message on new edit
      setSaveMessage('');
    }
  });

  useEffect(() => {
    // Load notes when opened
    if (isOpen && editor) {
      const token = localStorage.getItem("token");
      if (token) {
        fetch(`/api/v1/notes/${chapterId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('No notes found');
        })
        .then(data => {
          if (data && data.content) {
            editor.commands.setContent(data.content);
          }
        })
        .catch(() => {
          // No notes yet or error, just leave empty
        });
      }
    }
  }, [isOpen, chapterId, editor]);

  const saveNotes = async () => {
    if (!editor) return;
    
    setIsSaving(true);
    setSaveMessage('');
    
    const token = localStorage.getItem("token");
    if (!token) {
      setSaveMessage('Please log in to save notes.');
      setIsSaving(false);
      return;
    }

    try {
      const htmlContent = editor.getHTML();
      const plainText = editor.getText();
      
      const res = await fetch(`/api/v1/notes`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          lessonId: chapterId,
          content: htmlContent,
          // Extract title from first line of plain text or fallback
          title: plainText.split('\\n')[0].substring(0, 50) || `Notes for ${chapterId}`
        })
      });

      if (res.ok) {
        setSaveMessage('Saved successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        throw new Error('Failed to save');
      }
    } catch (err) {
      setSaveMessage('Error saving notes.');
    } finally {
      setIsSaving(false);
    }
  };

  // Menu bar for the editor
  const MenuBar = () => {
    if (!editor) return null;

    return (
      <div className="flex flex-wrap gap-2 p-2 bg-slate-900 border-b border-slate-700 rounded-t-lg">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-1.5 rounded text-sm font-bold ${editor.isActive('bold') ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded text-sm italic ${editor.isActive('italic') ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
        >
          I
        </button>
        <div className="w-px h-6 bg-slate-700 mx-1 self-center" />
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded text-sm font-bold ${editor.isActive('heading', { level: 2 }) ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded text-sm font-bold ${editor.isActive('heading', { level: 3 }) ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
        >
          H3
        </button>
        <div className="w-px h-6 bg-slate-700 mx-1 self-center" />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded text-sm ${editor.isActive('bulletList') ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded text-sm ${editor.isActive('blockquote') ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
        >
          " Quote
        </button>
      </div>
    );
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-48 bg-slate-800 hover:bg-slate-700 text-white shadow-lg border border-slate-700 rounded-full h-14 px-6 flex items-center justify-center font-bold tracking-wide transition-all z-40 group"
      >
        <span className="mr-2 text-xl">📝</span> My Notes
      </button>
    );
  }

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-slate-950 border-l border-slate-800 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="flex justify-between items-center p-4 bg-slate-900 border-b border-slate-800">
        <h3 className="font-bold text-white flex items-center gap-2">
          <span>📝</span> Personal Notes
        </h3>
        <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition">
          ✕
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg flex-1 flex flex-col">
          <MenuBar />
          <div className="p-4 flex-1 overflow-y-auto bg-slate-950 rounded-b-lg">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-between items-center">
        <div className="text-sm font-medium">
          {saveMessage && (
            <span className={saveMessage.includes('Error') ? 'text-red-400' : 'text-emerald-400'}>
              {saveMessage}
            </span>
          )}
        </div>
        <button
          onClick={saveNotes}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2"
        >
          {isSaving ? 'Saving...' : 'Save Notes'}
        </button>
      </div>
    </div>
  );
}
