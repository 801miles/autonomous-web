import { type Metadata } from "next";
import IntakeForm from "@/components/intake/IntakeForm";
import { Brain } from "lucide-react";

export const metadata: Metadata = {
  title: "Deep Intent Extraction",
  description: "Answer the five Golden Questions. The Archon agents will transmute your signals into a 2,000-word architectural directive.",
};

export default function IntakePage() {
  return (
    <div className="flex flex-col min-h-screen pt-32 pb-20">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20 -z-10">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/20 blur-[160px] rounded-full" />
      </div>

      <div className="container mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <div className="flex items-center justify-center gap-2 text-primary font-mono text-xs font-bold uppercase tracking-[0.2em] animate-pulse">
            <Brain className="w-4 h-4" />
            Theoretical Modeling Active
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Deep Intent <span className="text-gradient">Extraction</span>
          </h1>
          <p className="text-foreground/40 max-w-lg mx-auto font-medium">
            Answer the Golden Questions. The Archon Core will deconstruct your signals 
            into a 2,000-word architectural directive for the sub-agents.
          </p>
        </div>

        <IntakeForm />
      </div>
    </div>
  );
}
