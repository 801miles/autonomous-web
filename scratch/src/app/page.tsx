import Hero from "@/components/Hero";
import AgentDashboard from "@/components/AgentDashboard";
import Terminal from "@/components/Terminal";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <Hero />
      
      <div className="relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <AgentDashboard />
      </div>

      <div className="relative pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <Terminal />
      </div>
    </div>
  );
}
