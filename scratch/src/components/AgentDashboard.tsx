"use client";

import React from "react";
import { motion } from "framer-motion";
import { Code2, Palette, Globe, CheckCircle2, Loader2, Activity } from "lucide-react";

const agents = [
  {
    name: "Architect Dev",
    role: "Full-Stack Logic",
    status: "executing",
    progress: 78,
    icon: <Code2 className="w-5 h-5 text-blue-400" />,
    color: "blue",
  },
  {
    name: "Aura Designer",
    role: "Visual UI/UX",
    status: "success",
    progress: 100,
    icon: <Palette className="w-5 h-5 text-purple-400" />,
    color: "purple",
  },
  {
    name: "Nexus DevOps",
    role: "Cloud/Deployment",
    status: "idle",
    progress: 0,
    icon: <Globe className="w-5 h-5 text-emerald-400" />,
    color: "emerald",
  },
];

const AgentDashboard = () => {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <Activity className="w-8 h-8 text-primary" />
            Agent Orchestration
          </h2>
          <p className="text-foreground/60 max-w-md">
            Real-time monitoring of autonomous sub-entities synthesizing your architecture.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="glass px-4 py-2 rounded-xl text-sm font-medium">
            Active Agents: <span className="text-primary font-bold">2</span>
          </div>
          <div className="glass px-4 py-2 rounded-xl text-sm font-medium">
            System Health: <span className="text-emerald-400 font-bold">Optimal</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative"
          >
            <div className="absolute -inset-px bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl -z-10" />
            
            <div className="glass p-6 rounded-3xl h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 bg-${agent.color}-400/10 rounded-2xl`}>
                    {agent.icon}
                  </div>
                  <div className="flex gap-1">
                    {agent.status === "executing" ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider rounded-full ring-1 ring-primary/30">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Executing
                      </span>
                    ) : agent.status === "success" ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-400/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-full ring-1 ring-emerald-400/30">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 text-foreground/40 text-[10px] font-bold uppercase tracking-wider rounded-full ring-1 ring-white/10">
                        Standby
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-1">{agent.name}</h3>
                <p className="text-sm text-foreground/40 mb-6 font-medium tracking-wide">
                  {agent.role}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-foreground/40">
                  <span>Task Progress</span>
                  <span className={agent.status === "executing" ? "text-primary" : ""}>
                    {agent.progress}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${agent.progress}%` }}
                    transition={{ duration: 1.5, delay: 0.5 + index * 0.1, ease: "circOut" }}
                    className={`h-full bg-gradient-to-r from-primary to-accent`}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AgentDashboard;
