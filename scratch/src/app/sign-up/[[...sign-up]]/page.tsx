import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-black">
      <SignUp appearance={{
        elements: {
          rootBox: "mx-auto",
          card: "bg-zinc-900 border border-white/10 shadow-2xl rounded-2xl",
          headerTitle: "text-white font-bold",
          headerSubtitle: "text-zinc-400",
          socialButtonsBlockButton: "text-white border border-white/10 hover:bg-white/5",
          dividerLine: "bg-white/10",
          dividerText: "text-zinc-500",
          formFieldLabel: "text-zinc-300",
          formFieldInput: "bg-black border border-white/10 text-white focus:border-cyan-400/50 focus:ring-cyan-500/50",
          footerActionLink: "text-cyan-400 hover:text-cyan-300",
          formButtonPrimary: "bg-white text-black hover:bg-zinc-200 font-semibold",
        }
      }} />
    </div>
  );
}
