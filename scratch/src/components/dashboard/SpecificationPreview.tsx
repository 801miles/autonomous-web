"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Cpu, Layout, Image as ImageIcon, CheckCircle } from "lucide-react";

const SpecificationPreview = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-8 rounded-3xl"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight">Technical Directive</h2>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-400/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest rounded-full ring-1 ring-emerald-400/30">
          <CheckCircle className="w-3 h-3" />
          Abstraction Complete
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <SpecSection 
            icon={<Cpu className="w-4 h-4" />} 
            title="Unit Orchestration" 
            content="Engineer [Next.js 15], UX Lead [Psychography Mapping], Social Psychologist [Trust-Marks Injection]."
          />
          <SpecSection 
            icon={<Layout className="w-4 h-4" />} 
            title="Atomic Design Architecture" 
            content="Organisms: Hero_Conversion_v1, Social_Proof_Grid_v2, Infinite_Portfolio_v1. Tokens: Inter/Outfit palette."
          />
        </div>
        <div className="space-y-6">
          <SpecSection 
            icon={<ImageIcon className="w-4 h-4" />} 
            title="Asset Synthesis" 
            content="Queries: 'Abstract future-proof obsidian tech gravity'. SVG-Wireframes: Multi-modal responsive grids."
          />
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <FileText className="w-20 h-20" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/40 mb-4">Meta-Abstract (Excerpt)</h3>
            <p className="font-mono text-xs leading-relaxed text-foreground/60 italic">
              "...The Theory of Mind unit has flagged 'User Skepticism' as the primary friction. 
              Implementing high-density trust-marks across the the primary conversion loop to 
              ensure immediate alignment with the Identity Anchor of 'Radical Transparency'..."
            </p>
            <button className="mt-6 text-xs font-bold text-primary hover:underline uppercase tracking-widest">
              View Full 2,000 Word Directive
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SpecSection = ({ icon, title, content }: { icon: React.ReactNode; title: string; content: string }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 text-primary">
      {icon}
      <h3 className="text-xs font-bold uppercase tracking-[0.2em]">{title}</h3>
    </div>
    <p className="text-sm text-foreground/60 font-medium leading-relaxed">
      {content}
    </p>
  </div>
);

export default SpecificationPreview;
