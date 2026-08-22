"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  if (!content) return null;

  return (
    <div className={`prose prose-invert max-w-none prose-table:border-collapse prose-th:border prose-th:border-slate-700 prose-th:bg-slate-900/80 prose-th:p-2.5 prose-th:text-slate-200 prose-td:border prose-td:border-slate-800 prose-td:p-2.5 prose-td:text-slate-300 prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-950/20 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        components={{
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4 rounded-xl border border-slate-800 bg-slate-950/40">
              <table className="w-full text-xs text-left border-collapse" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th className="px-3 py-2 bg-slate-900/90 text-emerald-400 font-bold border-b border-slate-800 tracking-wider text-xs uppercase" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-3 py-2.5 border-b border-slate-800/80 text-slate-300 text-xs leading-relaxed" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="my-3 border-l-4 border-emerald-500 bg-emerald-950/30 py-2.5 px-4 rounded-r-lg text-xs text-emerald-200 font-medium not-italic" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="text-white font-bold" {...props} />
          ),
          code: ({ node, ...props }) => (
            <code className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 text-xs font-mono" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside space-y-1 my-2 text-xs text-slate-300" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside space-y-1 my-2 text-xs text-slate-300" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="my-2 text-xs sm:text-sm text-slate-300 leading-relaxed" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
