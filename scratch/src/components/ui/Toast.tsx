"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

/* ─── Types ────────────────────────────────────────────── */
export type ToastVariant = "success" | "error" | "info";

interface ToastItem {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  add: (toast: Omit<ToastItem, "id">) => void;
}

/* ─── Context ─────────────────────────────────────────── */
const ToastContext = createContext<ToastContextValue | null>(null);

/* ─── Singleton ref for imperative use outside React ─── */
let _add: ToastContextValue["add"] | null = null;

export function toast(t: Omit<ToastItem, "id">) {
  _add?.(t);
}

/* ─── Visual Constants ───────────────────────────────── */
const ICONS: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
  error: <XCircle className="w-5 h-5 text-red-400 shrink-0" />,
  info: <Info className="w-5 h-5 text-primary shrink-0" />,
};

const ACCENT: Record<ToastVariant, string> = {
  success: "border-emerald-400/20",
  error: "border-red-400/20",
  info: "border-primary/20",
};

const BAR_COLOR: Record<ToastVariant, string> = {
  success: "bg-emerald-400",
  error: "bg-red-400",
  info: "bg-primary",
};

/* ─── Single Toast ───────────────────────────────────── */
function ToastCard({ id, variant, title, description, duration = 5000, onDismiss }: ToastItem & { onDismiss: (id: string) => void }) {
  const dismiss = useCallback(() => onDismiss(id), [id, onDismiss]);

  useEffect(() => {
    const t = setTimeout(dismiss, duration);
    return () => clearTimeout(t);
  }, [dismiss, duration]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.92, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className={`relative overflow-hidden glass-strong rounded-2xl p-4 pr-10 min-w-[300px] max-w-sm shadow-2xl border ${ACCENT[variant]}`}
    >
      {/* Countdown bar */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: duration / 1000, ease: "linear" }}
        style={{ transformOrigin: "left" }}
        className={`absolute bottom-0 left-0 h-[2px] w-full ${BAR_COLOR[variant]}`}
      />

      <div className="flex items-start gap-3">
        {ICONS[variant]}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold leading-tight">{title}</p>
          {description && (
            <p className="text-xs text-foreground/40 mt-1 leading-relaxed">{description}</p>
          )}
        </div>
      </div>

      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute top-3 right-3 p-1 rounded-lg hover:bg-white/10 transition-colors"
      >
        <X className="w-3.5 h-3.5 text-foreground/40" />
      </button>
    </motion.div>
  );
}

/* ─── Provider + Container ───────────────────────────── */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const add = useCallback((t: Omit<ToastItem, "id">) => {
    setToasts((s) => [...s, { ...t, id: crypto.randomUUID() }]);
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((s) => s.filter((t) => t.id !== id));
  }, []);

  // Expose imperatively
  useEffect(() => {
    _add = add;
    return () => { _add = null; };
  }, [add]);

  return (
    <ToastContext.Provider value={{ add }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <div key={t.id} className="pointer-events-auto">
              <ToastCard {...t} onDismiss={remove} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

/* ─── Hook ───────────────────────────────────────────── */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
