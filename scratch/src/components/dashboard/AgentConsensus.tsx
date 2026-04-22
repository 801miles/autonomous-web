"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, AlertTriangle, CheckCircle, MessageSquare } from "lucide-react";
import { type AgentLogEntry, type TechSpec } from "@/lib/transmutation";
import { cn } from "@/lib/utils";

interface AgentConsensusProps {
  spec: TechSpec;
}

const AGENT_COLORS: Record<AgentLogEntry["agent"], string> = {
  Engineer: "#06b6d4",
  "UX Lead": "#a855f7",
  Psychologist: "#f59e0b",
  ToM: "#22c55e",
};

const TYPE_ICONS: Record<AgentLogEntry["type"], React.ReactNode> = {
  info: <div className="w-1.5 h-1.5 rounded-full bg-foreground/30" />,
  debate: <MessageSquare className="w-3 h-3 text-amber-400" />,
  consensus: <CheckCircle className="w-3 h-3 text-emerald-400" />,
  warning: <AlertTriangle className="w-3 h-3 text-red-400" />,
};

export const AgentConsensus = ({ spec }: AgentConsensusProps) => {
  const [visibleEntries, setVisibleEntries] = useState<AgentLogEntry[]>([]);
  const [isReplaying, setIsReplaying] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const startReplay = () => {
    setVisibleEntries([]);
    setIsReplaying(true);
  };

  useEffect(() => {
    let i = 0;
    if (!isReplaying) {
      // show all immediately on first render
      setVisibleEntries(spec.agentLog);
      return;
    }
    const interval = setInterval(() => {
      if (i < spec.agentLog.length) {
        setVisibleEntries((prev) => [...prev, spec.agentLog[i]]);
        i++;
      } else {
        clearInterval(interval);
        setIsReplaying(false);
      }
    }, 600);
    return () => clearInterval(interval);
  }, [spec.agentLog, isReplaying]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleEntries]);

  return (
    <div className="glass rounded-3xl overflow-hidden">
      {/* Terminal header */}
      <div className="flex items-center justify-between px-5 py-3 bg-white/3 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-foreground/30">
            <Terminal className="w-3 h-3" />
            agent_consensus_thread
          </div>
        </div>
        <button
          onClick={startReplay}
          disabled={isReplaying}
          className="text-[9px] font-mono font-bold uppercase tracking-widest text-foreground/20 hover:text-primary disabled:opacity-30 transition-colors"
        >
          {isReplaying ? "Replaying..." : "↺ Replay"}
        </button>
      </div>

      {/* Log output */}
      <div ref={scrollRef} className="p-5 h-80 overflow-y-auto space-y-2 font-mono text-xs">
        {/* Agent legend */}
        <div className="flex gap-4 mb-4 pb-2 border-b border-white/5">
          {Object.entries(AGENT_COLORS).map(([agent, color]) => (
            <div key={agent} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[9px] text-foreground/30">{agent}</span>
            </div>
          ))}
        </div>

        <AnimatePresence initial={false}>
          {visibleEntries.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-3 group"
            >
              <span className="text-foreground/20 shrink-0 w-8">{entry.time}</span>
              <div className="flex items-start gap-1.5">
                <span className="mt-0.5">{TYPE_ICONS[entry.type]}</span>
                <span
                  className="font-bold shrink-0"
                  style={{ color: AGENT_COLORS[entry.agent] }}
                >
                  [{entry.agent}]
                </span>
              </div>
              <span className={cn(
                "leading-relaxed",
                entry.type === "consensus" ? "text-emerald-400/80" :
                entry.type === "warning" ? "text-red-400/80" :
                entry.type === "debate" ? "text-amber-400/80" :
                "text-foreground/50"
              )}>
                {entry.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Cursor */}
        {!isReplaying && visibleEntries.length === spec.agentLog.length && (
          <div className="flex items-center gap-2 text-primary/60 mt-2">
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="inline-block w-2 h-3 bg-primary"
            />
            <span className="text-[9px]">SPECIFICATION_LOCKED // Awaiting deployment signal</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentConsensus;
