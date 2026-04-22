"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal as TerminalIcon, Copy, X, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

const logs = [
  { type: "info", content: "Initializing Antigravity Meta-Architect v1.0..." },
  { type: "success", content: "Authenticated user: Antigravity-Admin" },
  { type: "process", content: "Deconstructing Intent: 'Build the AAA Platform'..." },
  { type: "info", content: "Schema established. Inferred necessity: Next.js + Tailwind." },
  { type: "process", content: "Orchestrating Dev Agent: Architecture synthesis..." },
  { type: "process", content: "Orchestrating Design Agent: Component mapping..." },
  { type: "info", content: "Generating structured source code (src/app/page.tsx)..." },
  { type: "success", content: "Style tokens injected into globals.css" },
  { type: "info", content: "Compiling assets for production deployment..." },
  { type: "process", content: "Verifying checksums: [####################] 100%" },
  { type: "success", content: "Deployment successful: https://aaa-v1.antigravity.dev" },
];

const Terminal = () => {
  const [visibleLogs, setVisibleLogs] = useState<typeof logs>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < logs.length) {
        setVisibleLogs((prev) => [...prev, logs[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleLogs]);

  return (
    <section className="py-20 px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full bg-[#0d0d12] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-[#1a1a24] px-4 py-3 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <div className="h-4 w-[1px] bg-white/10 mx-2" />
            <div className="flex items-center gap-2 text-foreground/40 font-mono text-xs font-bold uppercase tracking-widest">
              <TerminalIcon className="w-3 h-3" />
              ama_v1_main_thread
            </div>
          </div>
          <div className="flex items-center gap-4 text-foreground/40">
            <Copy className="w-4 h-4 cursor-pointer hover:text-foreground transition-colors" />
            <X className="w-4 h-4 cursor-pointer hover:text-foreground transition-colors" />
          </div>
        </div>

        {/* Content */}
        <div 
          ref={scrollRef}
          className="p-6 h-[450px] overflow-y-auto font-mono text-sm leading-relaxed scrollbar-hide"
        >
          <AnimatePresence initial={false}>
            {visibleLogs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-1.5 flex gap-3 group"
              >
                <span className="text-foreground/20 font-bold select-none w-8 shrink-0">
                  {i + 1}
                </span>
                <span className="text-primary hidden md:inline">
                  <Hash className="w-3 h-3 translate-y-[3px]" />
                </span>
                <span className={cn(
                  "font-medium",
                  log.type === "success" && "text-emerald-400",
                  log.type === "process" && "text-blue-400",
                  log.type === "info" && "text-foreground/80"
                )}>
                  {log.content}
                </span>
                {log.type === "process" && (
                  <motion.span
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-2 h-4 bg-primary inline-block translate-y-[3px]"
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="flex items-center gap-2 mt-4 text-primary animate-pulse">
            <span className="w-2 h-4 bg-primary" />
            <span className="font-bold text-xs">LISTENING_FOR_INTENT...</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Terminal;
