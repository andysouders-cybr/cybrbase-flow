"use client";

import {
  ArrowRight,
  ShieldCheck,
  Gauge,
  Bot,
  ClipboardList,
  FileCheck,
  Route,
  Radar,
} from "lucide-react";
import { motion } from "framer-motion";

type Step = { title: string; desc: string; icon: React.ElementType };

const steps: Step[] = [
  {
    title: "1. Intake",
    desc: "Agency profile captured; sector selected (Transit, Municipality, K-12, Higher-Ed).",
    icon: ShieldCheck,
  },
  {
    title: "2. Guided CRR Assessment",
    desc: "TurboTax-style flow with plain-English help and sector overlays.",
    icon: ClipboardList,
  },
  {
    title: "3. Automated Gap Analysis",
    desc: "Scoring across 10 CRR domains; ‘No’ answers → structured gaps.",
    icon: Gauge,
  },
  {
    title: "4. Auto-Generated Artifacts",
    desc: "Starter policies, plans & project templates for missing controls.",
    icon: FileCheck,
  },
  {
    title: "5. Actionable Roadmap",
    desc: "90/180/365-day sequencing and owners; board-ready views.",
    icon: Route,
  },
  {
    title: "6. Agentic AI Support",
    desc: "Concierge handles reminders, pre-fills, benchmarking & Q&A.",
    icon: Bot,
  },
  {
    title: "7. Ongoing Monitoring",
    desc: "Optional hooks to MFA/EDR/email security; dashboards & grants.",
    icon: Radar,
  },
];

export default function FutureStateFlow() {
  return (
    <div className="relative min-h-screen w-full bg-black text-white py-16 px-6 space-y-10">
      {/* Title */}
      <div className="text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold">
          Cybrbase XRM Future State Flow
        </h2>
        <p className="mt-3 text-sm md:text-base text-gray-400">
          From CRR → Gaps → Templates → Roadmap → Automation
        </p>
      </div>

      {/* Pipeline wrapper */}
      <div className="relative flex flex-col md:flex-row md:flex-wrap justify-center items-stretch gap-6">
        {/* Glowing pipeline line (horizontal on desktop, vertical on mobile) */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 hidden md:block bg-gradient-to-r from-cyan-500/60 via-indigo-500/60 to-cyan-500/60 blur-sm animate-pulse" />
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 md:hidden bg-gradient-to-b from-cyan-500/60 via-indigo-500/60 to-cyan-500/60 blur-sm animate-pulse" />

        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center relative z-10"
            >
              <div className="w-80 rounded-2xl border border-gray-700 bg-gray-900 p-5 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 grid place-items-center text-white shadow-md">
                    <Icon size={20} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>

              {i < steps.length - 1 && (
                <ArrowRight
                  className="hidden md:block mx-4 text-gray-500 relative z-10"
                  size={28}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mx-auto max-w-4xl text-center text-gray-400 text-sm relative z-10">
        <span className="inline-block rounded-full border border-gray-700 bg-gray-800 px-3 py-1 mr-2 mb-2">
          CRR-aligned
        </span>
        <span className="inline-block rounded-full border border-gray-700 bg-gray-800 px-3 py-1 mr-2 mb-2">
          Templates on Gap
        </span>
        <span className="inline-block rounded-full border border-gray-700 bg-gray-800 px-3 py-1 mr-2 mb-2">
          Board-ready
        </span>
        <span className="inline-block rounded-full border border-gray-700 bg-gray-800 px-3 py-1 mr-2 mb-2">
          Agentic AI
        </span>
        <span className="inline-block rounded-full border border-gray-700 bg-gray-800 px-3 py-1 mr-2 mb-2">
          Grants & Compliance
        </span>
      </div>
    </div>
  );
}
