"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";

import { ContentBlockDto } from "@/lib/api/curriculum";
import ThreeCanvas from "../3d/ThreeCanvas";
import Mermaid from "./Mermaid";
import PhysiologyAnimation from "./PhysiologyAnimation";
import CaseStudyInteractive from "./CaseStudyInteractive";
import QuizComponent from "./QuizComponent";

interface ContentBlockRendererProps {
  block: ContentBlockDto;
  chapterId: string;
}

function sanitizeMarkdownText(content: string): string {
  if (!content) return "";
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^>]*>/gi, "")
    .replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/href\s*=\s*("[^"]*javascript:[^"]*"|'[^']*javascript:[^']*')/gi, 'href="#"');
}

export default function ContentBlockRenderer({ block, chapterId }: ContentBlockRendererProps) {
  const type = block.type?.toUpperCase();

  switch (type) {
    case "EXPLANATION": {
      const text = block.metadata?.text || "";
      const sanitizedText = sanitizeMarkdownText(text);
      return (
        <div className="prose prose-invert max-w-none prose-slate prose-headings:text-white prose-p:text-slate-300 prose-a:text-blue-400 prose-strong:text-white prose-code:text-indigo-200">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex, rehypeRaw]}
          >
            {sanitizedText}
          </ReactMarkdown>
        </div>
      );
    }

    case "THREE_D": {
      const targetChapterId = block.metadata?.chapterId || chapterId;
      const modelTitle = block.metadata?.title || "Interactive 3D Anatomical Model";
      return (
        <div className="my-8">
          <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
            📦 {modelTitle}
          </h4>
          <ThreeCanvas chapterId={targetChapterId} />
        </div>
      );
    }

    case "FLOWCHART": {
      const markup = block.metadata?.markup || "";
      const title = block.metadata?.title || "System Physiology Flowchart";
      return (
        <div className="my-8 p-6 bg-slate-900/40 rounded-xl border border-slate-800 shadow-lg">
          <h4 className="text-sm font-semibold text-blue-400 mb-4 border-l-3 border-blue-600 pl-2">
            📊 {title}
          </h4>
          {markup ? (
            <Mermaid chart={markup} />
          ) : (
            <div className="text-xs text-slate-500 italic">No flowchart markup provided.</div>
          )}
        </div>
      );
    }

    case "ANIMATION": {
      const animationType = block.metadata?.animationType || "homeostasis";
      return (
        <div className="my-8">
          <PhysiologyAnimation chapterId={animationType} />
        </div>
      );
    }

    case "CLINICAL_CASE": {
      const scenarioText = block.metadata?.scenarioText || "";
      return (
        <div className="my-8">
          <CaseStudyInteractive content={scenarioText} />
        </div>
      );
    }

    case "QUIZ": {
      const questionsMarkdown = block.metadata?.quizMarkdown || "";
      return (
        <div className="my-8 pt-6 border-t border-slate-800">
          <QuizComponent markdownContent={questionsMarkdown} chapterId={chapterId} />
        </div>
      );
    }

    default:
      return (
        <div className="p-4 bg-slate-800/20 text-xs text-slate-400 italic rounded-lg border border-slate-800 my-4">
          Unsupported block type: {type}
        </div>
      );
  }
}
