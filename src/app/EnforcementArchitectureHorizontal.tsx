"use client";

import { motion } from "framer-motion";
import { Shield, FileText, Laptop, Server, Lightbulb, BarChart3 } from "lucide-react";

type Step = { title: string; desc: string; icon: React.ComponentType<{ size?: number; className?: string }> };

const layers: Step[] = [
  { title: "Assessment & Templates", desc: "CRR Q&A identifies gaps. Auto-generate policies, plans, and project templates.", icon: Shield },
  { title: "Policy Compiler", desc: "Translate plans into machine-readable enforcement rules aligned to CRR/NIST.", icon: FileText },
  { title: "Endpoint AI Agent", desc: "Agent watches user actions (browser, apps) → warns, blocks, or coaches in real time.", icon: Laptop },
  { title: "Security Stack Integrations", desc: "Hook into EDR, DLP, MFA, identity, and cloud controls for technical enforcement.", icon: Server },
  { title: "Educate & Nudge", desc: "AI explains why a block happened, links to policies, and triggers micro-training.", icon: Lightbulb },
  { title: "Risk Register & Reporting", desc: "Every enforcement → logged back into Cybrbase XRM risk register. Board & grant ready.", icon: BarChart3 },
];

export default function EnforcementArchitectureHorizontal() {
  return (
    <div className="space-y-12">
      <h2 className="text-3xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300">
        Future Enforcement Architecture (Horizontal)
      </h2>

      <div className="flex flex-col md:flex-row items-stretch gap-8 relative justify-center">
        {layers.map((layer, i) => {
          const Icon = layer.icon;
          return (
            <motion.div
              key={layer.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              className="flex flex-col items-center text-center w-72 relative z-10"
            >
              <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 grid place-items-center text-white shadow-lg mb-3">
                <Icon size={24} />
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-md p-4 shadow-md h-full flex flex-col">
                <h3 className="font-semibold text-cyan-50 mb-2">{layer.title}</h3>
                <p className="text-sm text-cyan-100/80 leading-relaxed">{layer.desc}</p>
              </div>
            </motion.div>
          );
        })}

        {/* horizontal connector line */}
        <div className="absolute top-[42px] left-[88px] right-[88px] h-0.5 bg-gradient-to-r from-cyan-400/70 via-indigo-400/60 to-cyan-400/70 z-0 hidden md:block" />
      </div>
    </div>
  );
}
