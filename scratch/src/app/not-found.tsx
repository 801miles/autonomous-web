import Link from "next/link";
import { Shield, Home, Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 blur-[160px] rounded-full" />
      </div>

      <div className="glass rounded-3xl p-12 max-w-lg w-full text-center space-y-8">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Shield className="w-8 h-8 text-primary" />
        </div>

        <div className="space-y-3">
          <div className="font-mono text-6xl font-bold text-gradient">404</div>
          <h1 className="text-xl font-bold">Route Not Found</h1>
          <p className="text-sm text-foreground/40 leading-relaxed">
            The Archon navigator could not resolve this path. The requested orchestration endpoint does not exist in the current deployment.
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:neon-glow hover:scale-105 transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
          <Link
            href="/intake"
            className="flex items-center gap-2 px-6 py-3 rounded-xl glass font-bold text-sm hover:bg-white/10 hover:scale-105 transition-all active:scale-95"
          >
            <Zap className="w-4 h-4" />
            Begin Intake
          </Link>
        </div>
      </div>
    </div>
  );
}
