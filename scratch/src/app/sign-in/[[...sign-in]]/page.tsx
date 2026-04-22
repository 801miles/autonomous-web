import { SignIn } from "@clerk/nextjs";
import { Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Archon account to access the orchestration dashboard and export your specifications.",
};

export default function SignInPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center px-6 py-32">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff06_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/12 blur-[160px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-cyan-500/8 blur-[120px] rounded-full" />
      </div>

      <div className="flex flex-col items-center gap-8 w-full max-w-md">
        {/* Brand header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="p-3 bg-primary/15 border border-primary/20 rounded-2xl">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-foreground/40 mt-1">Sign in to your Archon account</p>
          </div>
        </div>

        {/* Clerk widget */}
        <div className="w-full">
          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none p-0 gap-6",
                header: "hidden",
                socialButtonsBlockButton:
                  "w-full glass border border-white/10 text-foreground hover:bg-white/8 hover:border-white/20 rounded-xl font-medium text-sm transition-all",
                socialButtonsBlockButtonText: "text-foreground/80",
                dividerLine: "bg-white/8",
                dividerText: "text-foreground/25 text-xs",
                formFieldLabel: "text-foreground/50 text-xs font-medium uppercase tracking-wider",
                formFieldInput:
                  "bg-white/4 border border-white/10 text-foreground rounded-xl focus:border-primary/50 focus:ring-1 focus:ring-primary/30 placeholder:text-foreground/20 transition-all",
                formButtonPrimary:
                  "bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] transition-all active:scale-95",
                footerActionLink: "text-primary hover:text-primary/80 font-semibold",
                footerActionText: "text-foreground/30 text-xs",
                identityPreviewText: "text-foreground/70",
                identityPreviewEditButton: "text-primary",
                formResendCodeLink: "text-primary",
                otpCodeFieldInput:
                  "bg-white/4 border border-white/10 text-foreground rounded-xl focus:border-primary/50 transition-all",
                alertText: "text-red-400 text-sm",
                formFieldErrorText: "text-red-400 text-xs",
              },
              layout: {
                socialButtonsPlacement: "top",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
