import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function FutureStateFlow() {
const steps = [
{
title: "1. Intake",
desc: "Agency profile created, sector identified (Transit, Municipality, K-12, etc.)."
},
{
title: "2. Guided CRR Assessment",
desc: "TurboTax-style Q&A with AI assistance, sector overlays, and plain-English explanations."
},
{
title: "3. Automated Gap Analysis",
desc: "Responses scored across 10 CRR domains. AI flags 'No' answers for risk register."
},
{
title: "4. Auto-Generated Artifacts",
desc: "Draft policies, plans, and project templates created instantly for missing controls."
},
{
title: "5. Actionable Roadmap",
desc: "90/180/365-day prioritized roadmap with sector-specific recommendations."
},
{
title: "6. Agentic AI Support",
desc: "AI concierge sends reminders, pre-fills common answers, and benchmarks peers."
},
{
title: "7. Ongoing Monitoring",
desc: "Optional integrations with EDR/MFA tools, dashboards for board reporting, grant alignment."
}
];

return (
<div className="grid gap-6">
<h2 className="text-2xl font-bold text-center mb-4">Cybrbase XRM Future State Flow</h2>
<div className="flex flex-col md:flex-row md:flex-wrap justify-center items-center gap-6">
{steps.map((step, i) => (
<motion.div
key={i}
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: i * 0.2 }}
className="flex items-center"
>
<Card className="w-72 shadow-lg rounded-2xl p-4 bg-gradient-to-br from-blue-50 to-white">
<CardContent>
<h3 className="font-semibold text-lg mb-2">{step.title}</h3>
<p className="text-sm text-gray-600">{step.desc}</p>
</CardContent>
</Card>
{i < steps.length - 1 && (
<ArrowRight className="hidden md:block mx-4 text-blue-500" size={28} />
)}
</motion.div>
))}
</div>
</div>
);
}