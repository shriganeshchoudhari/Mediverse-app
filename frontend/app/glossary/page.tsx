"use client";

import React, { useState } from "react";
import { Search, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

const GLOSSARY = [
  {
    term: "Atherosclerosis",
    definition: "A disease of the arteries characterized by the deposition of plaques of fatty material on their inner walls.",
    chapterId: "cardiac-cycle",
    chapterName: "Cardiac Cycle & Hemodynamics",
    category: "Cardiovascular"
  },
  {
    term: "Arrhythmia",
    definition: "An irregular heartbeat, which can be too fast (tachycardia) or too slow (bradycardia), indicating issues with the heart's electrical system.",
    chapterId: "cardiac-cycle",
    chapterName: "Cardiac Cycle & Hemodynamics",
    category: "Cardiovascular"
  },
  {
    term: "Diabetes Insipidus",
    definition: "A rare disorder that occurs when a person's kidneys pass an abnormally large volume of urine that is insipid—dilute and odorless. Due to ADH deficiency or resistance.",
    chapterId: "renal-filtration",
    chapterName: "Renal Filtration",
    category: "Renal"
  },
  {
    term: "Nephrotic Syndrome",
    definition: "A kidney disorder that causes your body to pass too much protein in your urine. Often caused by damage to the clusters of small blood vessels in your kidneys.",
    chapterId: "renal-filtration",
    chapterName: "Renal Filtration",
    category: "Renal"
  },
  {
    term: "Myasthenia Gravis",
    definition: "A chronic autoimmune, neuromuscular disease that causes weakness in the skeletal muscles, caused by antibodies against acetylcholine receptors.",
    chapterId: "synaptic-transmission",
    chapterName: "Synaptic Transmission",
    category: "Nervous System"
  },
  {
    term: "Multiple Sclerosis",
    definition: "A disease in which the immune system eats away at the protective covering of nerves (myelin sheath), disrupting communication between the brain and the body.",
    chapterId: "synaptic-transmission",
    chapterName: "Synaptic Transmission",
    category: "Nervous System"
  },
  {
    term: "Hypoxia",
    definition: "A condition in which the body or a region of the body is deprived of adequate oxygen supply at the tissue level.",
    chapterId: "respiratory-mechanics",
    chapterName: "Respiratory Mechanics",
    category: "Respiratory"
  },
  {
    term: "Asthma",
    definition: "A condition in which a person's airways become inflamed, narrow and swell, and produce extra mucus, which makes it difficult to breathe.",
    chapterId: "respiratory-mechanics",
    chapterName: "Respiratory Mechanics",
    category: "Respiratory"
  },
  {
    term: "Addison's Disease",
    definition: "A long-term endocrine disorder in which the adrenal glands do not produce enough steroid hormones (cortisol and aldosterone).",
    chapterId: "endocrine-hormones",
    chapterName: "Endocrine Hormones",
    category: "Endocrine"
  },
  {
    term: "Cushing's Syndrome",
    definition: "A condition that occurs from exposure to high cortisol levels for a long time. Characterized by a fatty hump between the shoulders, a rounded face, and pink or purple stretch marks on the skin.",
    chapterId: "endocrine-hormones",
    chapterName: "Endocrine Hormones",
    category: "Endocrine"
  },
  {
    term: "Glaucoma",
    definition: "A group of eye conditions that damage the optic nerve, the health of which is vital for good vision. Often caused by an abnormally high pressure in your eye.",
    chapterId: "vision",
    chapterName: "Vision & Optics",
    category: "Special Senses"
  },
  {
    term: "Cataracts",
    definition: "Clouding of the normally clear lens of the eye, leading to a decrease in vision.",
    chapterId: "vision",
    chapterName: "Vision & Optics",
    category: "Special Senses"
  }
];

export default function GlossaryPage() {
  const [search, setSearch] = useState("");

  const filteredGlossary = GLOSSARY.filter(item => 
    item.term.toLowerCase().includes(search.toLowerCase()) || 
    item.definition.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => a.term.localeCompare(b.term));

  // Group by starting letter
  const grouped = filteredGlossary.reduce((acc, item) => {
    const letter = item.term.charAt(0).toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(item);
    return acc;
  }, {} as Record<string, typeof GLOSSARY>);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Clinical Correlations Glossary</h1>
          <p className="text-slate-400 max-w-2xl">
            A searchable dictionary of clinical conditions, diseases, and their underlying physiological mechanisms.
          </p>
        </div>

        <div className="relative mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search for a disease, symptom, or mechanism..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-12 pr-4 py-4 text-white text-lg focus:border-blue-500 focus:outline-none transition shadow-lg"
          />
        </div>

        <div className="space-y-12">
          {Object.keys(grouped).sort().map(letter => (
            <div key={letter} className="relative">
              <div className="sticky top-16 bg-slate-950/90 backdrop-blur py-2 z-10 mb-4 border-b border-slate-800">
                <h2 className="text-2xl font-black text-blue-500">{letter}</h2>
              </div>
              <div className="space-y-4 pl-4 md:pl-8 border-l border-slate-800">
                {grouped[letter].map(item => (
                  <div key={item.term} className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative group hover:border-slate-700 transition">
                    <span className="absolute -left-10 top-8 w-6 h-px bg-slate-800 group-hover:bg-blue-500 transition"></span>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{item.term}</h3>
                        <span className="inline-block px-2 py-1 bg-slate-800 text-xs font-medium text-slate-300 rounded">
                          {item.category}
                        </span>
                      </div>
                      <Link 
                        href={`/lessons/${item.chapterId}`}
                        className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition whitespace-nowrap bg-blue-900/20 px-3 py-1.5 rounded-lg border border-blue-500/20"
                      >
                        <LinkIcon className="w-4 h-4" />
                        Learn in Chapter
                      </Link>
                    </div>
                    <p className="text-slate-400 leading-relaxed">
                      {item.definition}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {Object.keys(grouped).length === 0 && (
            <div className="py-12 text-center text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
              No clinical terms found matching "{search}".
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
