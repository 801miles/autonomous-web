"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Archon Error Boundary]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-red-500/8 blur-[140px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-primary/8 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-12 max-w-lg w-full text-center space-y-8"
      >
        <div className="mx-auto w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">System Fault Detected</h1>
          <p className="text-sm text-foreground/40 leading-relaxed">
            An orchestration error has interrupted the process. The Archon agents are standing by for a restart.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-foreground/20 pt-2">
              Digest: {error.digest}
            </p>
          )}
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:neon-glow hover:scale-105 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            Retry Orchestration
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 rounded-xl glass font-bold text-sm hover:bg-white/10 hover:scale-105 transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
