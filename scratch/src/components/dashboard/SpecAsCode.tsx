"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileCode2, Code2, Component, GitBranch, Download, Copy, CheckCheck, Loader2 } from "lucide-react";
import { type TechSpec } from "@/lib/transmutation";
import { cn } from "@/lib/utils";
import { createCheckoutSession } from "@/actions/stripe";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/Toast";

interface SpecAsCodeProps {
  spec: TechSpec;
}

type View = "spec" | "debug" | "components" | "css";

const UNIT_COLORS = {
  Engineer: "text-cyan-400",
  "UX Lead": "text-purple-400",
  Psychologist: "text-amber-400",
  "ToM Specialist": "text-emerald-400",
};

const UNIT_BG = {
  Engineer: "bg-cyan-400/10",
  "UX Lead": "bg-purple-400/10",
  Psychologist: "bg-amber-400/10",
  "ToM Specialist": "bg-emerald-400/10",
};

export const SpecAsCode = ({ spec }: SpecAsCodeProps) => {
  const [view, setView] = useState<View>("spec");
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const router = useRouter();

  const handleExport = async (type: "github" | "zip") => {
    setIsExporting(true);
    try {
      const platform = /iphone|ipad|ipod/i.test(navigator.userAgent)
        ? "ios"
        : /android/i.test(navigator.userAgent)
          ? "android"
          : "web";
      const { url } = await createCheckoutSession("archon_export", platform);
      if (url) {
        toast({
          variant: "info",
          title: type === "github" ? "Preparing GitHub generation…" : "Preparing .ZIP generation…",
          description: "Secure Stripe checkout is initializing your production package unlock.",
          duration: 4000,
        });
        if (url.startsWith("/")) {
          router.push(url);
        } else {
          window.location.href = url;
        }
      }
    } catch (error) {
      console.error("Export error:", error);
      toast({
        variant: "error",
        title: "Export Failed",
        description: "Could not initialize checkout. Please try again.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopy = () => {
    const content = JSON.stringify(spec, null, 2);
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast({ variant: "success", title: "Spec copied to clipboard", duration: 2500 });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass rounded-3xl overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-white/3 border-b border-white/5 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <FileCode2 className="w-4 h-4 text-primary" />
          <span className="font-mono text-xs font-bold text-foreground/50">{spec.title}</span>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1 glass rounded-xl p-1">
          {([
            { key: "spec", icon: <FileCode2 className="w-3 h-3" />, label: "Spec" },
            { key: "debug", icon: <Code2 className="w-3 h-3" />, label: "Debug" },
            { key: "components", icon: <Component className="w-3 h-3" />, label: "Atoms" },
            { key: "css", icon: <Code2 className="w-3 h-3" />, label: "CSS" },
          ] as const).map(({ key, icon, label }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                view === key ? "bg-primary text-white" : "text-foreground/30 hover:text-foreground/60"
              )}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-[10px] font-mono font-bold text-foreground/30 hover:text-foreground/60 transition-colors"
        >
          {copied ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy JSON"}
        </button>
      </div>

      {/* Content */}
      <div className="p-6 max-h-[600px] overflow-y-auto">
        <AnimatePresence mode="wait">
          {view === "spec" && (
            <motion.div key="spec" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {spec.sections.map((section, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-sm">{section.heading}</h4>
                    <span className={cn("text-[9px] font-mono font-bold px-2 py-0.5 rounded-md uppercase", UNIT_BG[section.unit], UNIT_COLORS[section.unit])}>
                      {section.unit}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/50 leading-relaxed pl-4 border-l border-white/5">
                    {section.content}
                  </p>
                </div>
              ))}
            </motion.div>
          )}

          {view === "debug" && (
            <motion.div key="debug" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <pre className="font-mono text-[11px] text-foreground/40 leading-relaxed whitespace-pre-wrap break-words">
                {JSON.stringify(spec, null, 2)}
              </pre>
            </motion.div>
          )}

          {view === "components" && (
            <motion.div key="components" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {spec.componentMap.map((comp, i) => (
                <div key={i} className="bg-white/3 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">{comp.atom}</span>
                      <span className="font-bold text-sm">{comp.component}</span>
                    </div>
                    <span className={cn("text-[9px] font-mono px-2 py-0.5 rounded", comp.serverComponent ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-400")}>
                      {comp.serverComponent ? "Server" : "Client"}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/40">{comp.purpose}</p>
                  <p className="text-[10px] text-primary/50 italic font-mono">{comp.psychologicalFunction}</p>
                </div>
              ))}
            </motion.div>
          )}

          {view === "css" && (
            <motion.div key="css" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <pre className="font-mono text-[11px] text-foreground/50 leading-relaxed">
                <span className="text-foreground/20">/* Psychographic CSS — RFT: {spec.rftProfile} */</span>{"\n"}
                <span className="text-purple-400">:root</span>{" {\n"}
                {Object.entries(spec.cssVariables).map(([k, v]) => (
                  `  ${k}: ${v};\n`
                )).join("")}
                {"}"}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Deployment Footer */}
      <div className="flex gap-3 px-5 py-4 border-t border-white/5 bg-white/2">
        <button 
          onClick={() => handleExport("github")}
          disabled={isExporting}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-all text-xs font-bold border border-white/5 disabled:opacity-50"
        >
          {isExporting ? <Loader2 className="w-4 h-4 text-primary animate-spin" /> : <GitBranch className="w-4 h-4 text-primary" />}
          Generate + Push to GitHub
        </button>
        <button 
          onClick={() => handleExport("zip")}
          disabled={isExporting}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary/15 hover:bg-primary/25 text-primary transition-all text-xs font-bold border border-primary/20 disabled:opacity-50"
        >
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Generate + Download .ZIP
        </button>
      </div>
    </div>
  );
};

export default SpecAsCode;
