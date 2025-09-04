"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, AlertTriangle, CheckCircle2, EyeOff, BookOpen, CircleSlash, ClipboardList } from "lucide-react";

/**
 * Prototype Policy Schema (normally this would be fetched from Cybrbase XRM)
 */
const policy = {
  version: "1.0",
  org: "Cybrbase Demo",
  approvedDestinations: ["ChatGPT Enterprise", "Azure OpenAI", "Claude for Gov"],
  blockedDestinations: ["RandomAI", "FreePromptz", "SketchyGPT"],
  detectors: [
    // VERY SIMPLE DEMO REGEXES — not production grade; just to show the flow
    { id: "email", label: "Email Address", pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i, action: "redact" },
    { id: "ssn", label: "SSN", pattern: /\b\d{3}-\d{2}-\d{4}\b/, action: "block" },
    { id: "dob", label: "Date of Birth", pattern: /\b(19|20)\d{2}[-\/.](0[1-9]|1[0-2])[-\/.](0[1-9]|[12]\d|3[01])\b/, action: "warn" },
    // add more (MRN, phone, etc.) as needed
  ],
  messages: {
    block: "This text violates policy and was blocked.",
    warn: "Heads up: this may contain sensitive data. You can edit or let me auto-redact.",
    redact: "Sensitive data was auto-redacted per policy.",
    destinationBlocked: "Destination is not approved for AI use. Please switch to an approved tool.",
    learnMore: "This protects you and your agency (CRR PR.AC, PR.DS + HIPAA safeguards).",
  },
};

type EventRecord = {
  ts: string;
  type: "block" | "warn" | "redact" | "destination";
  rule?: string;
  details: string;
};

function maskSensitive(text: string, re: RegExp, mask = "█") {
  return text.replace(new RegExp(re, re.flags.includes("g") ? re.flags : re.flags + "g"), (m) => mask.repeat(Math.max(m.length, 4)));
}

export default function PolicyConnectorDemo() {
  const [destination, setDestination] = useState<string>("ChatGPT Enterprise");
  const [raw, setRaw] = useState<string>("");
  const [display, setDisplay] = useState<string>("");
  const [coach, setCoach] = useState<{ type: "block" | "warn" | "redact" | "destination"; text: string } | null>(null);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const coachTimer = useRef<number | null>(null);

  const isDestinationBlocked = useMemo(
    () => policy.blockedDestinations.includes(destination),
    [destination]
  );

  // clear coach after a few seconds
  const showCoach = (type: EventRecord["type"], text: string) => {
    setCoach({ type, text });
    if (coachTimer.current) window.clearTimeout(coachTimer.current);
    coachTimer.current = window.setTimeout(() => setCoach(null), 4200);
  };

  const logEvent = (e: EventRecord) =>
    setEvents((prev) => [{ ...e, ts: new Date().toLocaleTimeString() }, ...prev].slice(0, 50));

  const enforceDestination = () => {
    if (isDestinationBlocked) {
      showCoach("destination", policy.messages.destinationBlocked);
      logEvent({ type: "destination", details: `Attempted to use ${destination}`, ts: "", rule: "Destination Control" });
      return false;
    }
    return true;
  };

  const enforceContent = (input: string) => {
    let current = input;
    let highestAction: "block" | "warn" | "redact" | null = null;
    let firedRule: string | undefined;

    for (const d of policy.detectors) {
      if (d.pattern.test(current)) {
        firedRule = d.label;
        if (d.action === "block") {
          highestAction = "block";
          break;
        }
        if (d.action === "redact") {
          current = maskSensitive(current, d.pattern);
          highestAction = highestAction ?? "redact";
        }
        if (d.action === "warn") {
          highestAction = highestAction ?? "warn";
        }
      }
    }

    if (highestAction === "block") {
      showCoach("block", `${policy.messages.block} ${policy.messages.learnMore}`);
      logEvent({ type: "block", details: "Matched rule: SSN", ts: "", rule: firedRule });
      return { allowed: false, text: "" };
    }

    if (highestAction === "redact") {
      showCoach("redact", `${policy.messages.redact} ${policy.messages.learnMore}`);
      logEvent({ type: "redact", details: "Auto-redacted sensitive content", ts: "", rule: firedRule });
      return { allowed: true, text: current };
    }

    if (highestAction === "warn") {
      showCoach("warn", `${policy.messages.warn} ${policy.messages.learnMore}`);
      logEvent({ type: "warn", details: "Detected potentially sensitive content", ts: "", rule: firedRule });
      return { allowed: true, text: current };
    }

    return { allowed: true, text: current };
  };

  // on change typing
  const onChange = (v: string) => {
    setRaw(v);
    const result = enforceContent(v);
    setDisplay(result.text);
  };

  // on paste handler (enforce immediately)
  const onPaste: React.ClipboardEventHandler<HTMLTextAreaElement> = (e) => {
    const pasted = e.clipboardData.getData("text");
    const result = enforceContent(pasted);
    if (!result.allowed) {
      e.preventDefault();
      setDisplay("");
      return;
    }
    // allow paste but use redacted/warned version
    e.preventDefault();
    const next = display + result.text;
    setRaw(next);
    setDisplay(next);
  };

  // simulate “Send to AI” button
  const onSend = () => {
    if (!enforceDestination()) return;
    const result = enforceContent(display);
    if (!result.allowed) return;
    // In a real connector, this is where we'd forward to the tool API or new tab.
    alert("Sent to AI tool (simulated).");
  };

  useEffect(() => {
    return () => {
      if (coachTimer.current) window.clearTimeout(coachTimer.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6">
      {/* Header */}
      <div className="mx-auto max-w-5xl mb-8">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Shield size={20} className="text-cyan-400" />
          Cybrbase Policy Connector — Prototype
        </h1>
        <p className="text-gray-400 text-sm">
          Live demo: reads a policy, detects sensitive data, blocks/redacts/warns, and logs events.
        </p>
      </div>

      <div className="mx-auto max-w-5xl grid md:grid-cols-3 gap-6">
        {/* Left: Policy / Destination */}
        <div className="md:col-span-1 space-y-4">
          <div className="rounded-xl border border-gray-700 bg-gray-900 p-4">
            <div className="flex items-center gap-2 mb-3">
              <ClipboardList size={18} className="text-indigo-400" />
              <h2 className="font-medium">Destination (AI Tool)</h2>
            </div>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded-lg p-2 text-sm"
            >
              {[...policy.approvedDestinations, ...policy.blockedDestinations].map((d) => (
                <option key={d} value={d}>
                  {d} {policy.approvedDestinations.includes(d) ? "(approved)" : "(blocked)"}
                </option>
              ))}
            </select>

            <div className="mt-3 text-xs text-gray-400">
              <p><strong>Approved:</strong> {policy.approvedDestinations.join(", ")}</p>
              <p><strong>Blocked:</strong> {policy.blockedDestinations.join(", ")}</p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-700 bg-gray-900 p-4">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={18} className="text-cyan-400" />
              <h2 className="font-medium">Policy (preview)</h2>
            </div>
            <pre className="text-xs text-gray-300 whitespace-pre-wrap break-words max-h-64 overflow-auto">
{JSON.stringify(policy, null, 2)}
            </pre>
          </div>
        </div>

        {/* Middle: Prompt box */}
        <div className="md:col-span-2 space-y-4">
          <div className="rounded-xl border border-gray-700 bg-gray-900 p-4 relative overflow-hidden">
            {/* subtle pipeline glow */}
            <div className="pointer-events-none absolute -inset-x-6 top-8 h-px bg-gradient-to-r from-cyan-500/50 via-indigo-500/40 to-cyan-500/50 blur-[1px]" />

            <div className="flex items-center justify-between mb-3">
              <h2 className="font-medium">AI Prompt (policy-enforced)</h2>
              <span className={`text-xs px-2 py-1 rounded-full border ${isDestinationBlocked ? "border-red-500/50 text-red-300 bg-red-900/20" : "border-green-500/50 text-green-300 bg-green-900/20"}`}>
                {isDestinationBlocked ? "Destination blocked" : "Destination approved"}
              </span>
            </div>

            <textarea
              value={display}
              onChange={(e) => onChange(e.target.value)}
              onPaste={onPaste}
              placeholder="Try pasting an email address, SSN (123-45-6789), or a DOB (YYYY-MM-DD)..."
              className="w-full h-48 bg-black border border-gray-700 rounded-lg p-3 text-sm outline-none"
            />

            <div className="mt-3 flex gap-3">
              <button
                onClick={onSend}
                className="rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95"
              >
                Send to AI (simulate)
              </button>
              <button
                onClick={() => {
                  setRaw("");
                  setDisplay("");
                }}
                className="rounded-lg border border-gray-700 px-4 py-2 text-sm"
              >
                Clear
              </button>
            </div>

            {/* Coach bubble */}
            <AnimatePresence>
              {coach && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-4 bottom-4 rounded-xl border border-gray-700 bg-black/90 p-3 text-xs max-w-sm shadow-lg"
                >
                  <div className="flex items-start gap-2">
                    {coach.type === "block" && <CircleSlash size={16} className="text-red-400" />}
                    {coach.type === "warn" && <AlertTriangle size={16} className="text-yellow-400" />}
                    {coach.type === "redact" && <EyeOff size={16} className="text-cyan-400" />}
                    {coach.type === "destination" && <AlertTriangle size={16} className="text-red-400" />}
                    <p className="text-gray-300 leading-relaxed">{coach.text}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Events / risk register */}
          <div className="rounded-xl border border-gray-700 bg-gray-900 p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={18} className="text-emerald-400" />
              <h2 className="font-medium">Enforcement Events (mini risk register)</h2>
            </div>
            {events.length === 0 ? (
              <p className="text-sm text-gray-400">No events yet. Try pasting an SSN or DOB, or choose a blocked destination.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {events.map((e, idx) => (
                  <li key={idx} className="flex items-start justify-between gap-3 border-b border-gray-800 pb-2">
                    <span className="text-gray-300">
                      <strong className="uppercase text-xs tracking-wide mr-2 text-gray-400">{e.type}</strong>
                      {e.details} {e.rule ? <em className="text-gray-400">(rule: {e.rule})</em> : null}
                    </span>
                    <span className="text-xs text-gray-500">{e.ts}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
