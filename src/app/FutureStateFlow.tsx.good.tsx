// src/app/FutureStateFlow.tsx
"use client";

import { ArrowRight, ShieldCheck, Gauge, Bot, ClipboardList, FileCheck, Route, Radar } from "lucide-react";
import { motion } from "framer-motion";

type Step = { title: string; desc: string; icon: React.ElementType };

const steps: Step[] = [
  { title: "1. Intake", desc: "Agency profile captured; sector selected (Transit, Municipality, K-12, Higher-Ed).", icon: ShieldCheck },
  { title: "2. Guided CRR Assessment", desc: "TurboTax-style flow with plain-English help and sector overlays.", icon: ClipboardList },
  { title: "3. Automated Gap Analysis", desc: "Scoring across 10 CRR domains; ‘No’ answers → structured gaps.", icon: Gauge },
  { title: "4. Auto-Generated Artifacts", desc: "Starter policies, plans & project templates for missing controls.", icon: FileCheck },
  { title: "5. Actionable Roadmap", desc: "90/180/365-day sequencing and owners; board-ready views.", icon: Route },
  { title: "6. Agentic AI Support", desc: "Concierge handles reminders, pre-fills, benchmarking & Q&A.", icon: Bot },
  { title: "7. Ongoing Monitoring", desc: "Optional hooks to MFA/EDR/email security; dashboards & grants.", icon: Radar },
];

export default function FutureStateFlow() {
  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300">
          Future State: CRR → Gaps → Artifacts → Roadmap → Automation
        </h2>
        <p className="mt-3 text-sm md:text-base text-cyan-100/80">
          Standardized like TurboTax. Powerful like an AI assistant.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:flex-wrap justify-center items-stretch gap-6">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center"
            >
              {/* Glassy Card */}
              <div className="w-80 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-5 shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.45)] transition">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 grid place-items-center text-white shadow-md">
                    <Icon size={20} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-cyan-50">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-cyan-100/80">{step.desc}</p>
                  </div>
                </div>
              </div>

              {i < steps.length - 1 && (
                <ArrowRight className="hidden md:block mx-4 text-cyan-200/70" size={28} />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Subtle legend / value props */}
      <div className="mx-auto max-w-4xl text-center text-cyan-100/80 text-sm">
        <span className="inline-block rounded-full border border-white/15 bg-white/5 px-3 py-1 mr-2 mb-2">CRR-aligned</span>
        <span className="inline-block rounded-full border border-white/15 bg-white/5 px-3 py-1 mr-2 mb-2">Templates on Gap</span>
        <span className="inline-block rounded-full border border-white/15 bg-white/5 px-3 py-1 mr-2 mb-2">Board-ready</span>
        <span className="inline-block rounded-full border border-white/15 bg-white/5 px-3 py-1 mr-2 mb-2">Agentic AI</span>
        <span className="inline-block rounded-full border border-white/15 bg-white/5 px-3 py-1 mr-2 mb-2">Grants & Compliance</span>
      </div>
    </div>
  );
}
