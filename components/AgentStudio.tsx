'use client';

import { useMemo, useState } from "react";
import {
  AgentInput,
  AgentPlan,
  CampaignGoal,
  Platform,
  PostingSlot,
  VideoConcept
} from "@/lib/types";
import { defaultAgentInput, generateAgentPlan } from "@/lib/agent";

type TextAreaKeys = "locations" | "influencerPartners" | "keyDates";

const toneLabels: Record<string, string> = {
  playful: "Playful · Punchy · Modern",
  inspirational: "Inspirational · Visionary",
  authoritative: "Authoritative · Sophisticated",
  cozy: "Cozy · Intimate · Warm"
};

const goalLabels: Record<CampaignGoal, string> = {
  awareness: "Awareness",
  engagement: "Engagement",
  conversion: "Conversion",
  community: "Community"
};

const platformLabels: Record<Platform, string> = {
  instagram: "Instagram Reels",
  tiktok: "TikTok"
};

function parseMultiline(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function formatMultiline(items: string[]): string {
  return items.join("\n");
}

function ConceptCard({ concept }: { concept: VideoConcept }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-brand-200/80">
            {concept.primaryPlatform.toUpperCase()} · Drop
          </p>
          <h3 className="text-xl font-semibold text-white">{concept.title}</h3>
        </div>
        <span className="rounded-full bg-brand-400/20 px-3 py-1 text-xs text-brand-100">
          {concept.postingWindow.day} · {concept.postingWindow.localTime}
        </span>
      </div>
      <p className="mt-4 text-sm text-slate-200">{concept.hook}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
            Narrative Beats
          </p>
          <ul className="mt-2 space-y-2 text-sm text-slate-200">
            {concept.narrativeBeats.map((beat, index) => (
              <li key={index} className="flex gap-3">
                <span className="mt-1 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-400/20 text-xs font-semibold text-brand-100">
                  {index + 1}
                </span>
                <span>{beat}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
            Shot Blueprint
          </p>
          <ul className="mt-2 space-y-2 text-sm text-slate-200">
            {concept.shots.map((shot, index) => (
              <li key={index} className="rounded-lg border border-white/10 bg-black/20 p-3">
                <div className="flex items-center justify-between text-xs text-brand-100">
                  <span>{shot.camera}</span>
                  <span>{shot.duration}</span>
                </div>
                <p className="mt-2 text-slate-200">{shot.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-100">
            Editing Notes
          </p>
          <ul className="mt-2 space-y-2 text-sm text-slate-200">
            {concept.editingNotes.map((note, index) => (
              <li key={index} className="flex gap-2">
                <span className="text-brand-200">▹</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-100">
            Publishing Kit
          </p>
          <div className="mt-2 space-y-2 text-sm text-slate-200">
            <p>
              <span className="text-brand-200 font-semibold">Soundtrack:</span>{" "}
              {concept.soundtrack}
            </p>
            <p>
              <span className="text-brand-200 font-semibold">CTA:</span>{" "}
              {concept.callToAction}
            </p>
            <p>
              <span className="text-brand-200 font-semibold">Caption:</span>{" "}
              {concept.caption}
            </p>
            <p className="text-xs text-slate-400">
              Hashtags: {concept.hashtags.join(" ")}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 text-xs">
        {concept.automationStack.map((automation) => (
          <span
            key={automation}
            className="rounded-full border border-brand-400/30 bg-brand-500/10 px-3 py-1 text-brand-100"
          >
            {automation}
          </span>
        ))}
      </div>
      <div className="mt-3 text-xs text-slate-400">
        Guardrails: {concept.performanceGuardrails.join(" · ")}
      </div>
    </div>
  );
}

function ScheduleCard({ slot }: { slot: PostingSlot }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-4">
      <p className="text-sm font-semibold text-white">
        {slot.day} · {slot.localTime}
      </p>
      <p className="mt-2 text-xs uppercase tracking-wide text-brand-100">
        Focus Metric
      </p>
      <p className="text-sm text-slate-200">{slot.focusMetric}</p>
      <p className="mt-3 text-xs uppercase tracking-wide text-brand-100">
        Automation & Optimization
      </p>
      <p className="text-sm text-slate-200">{slot.optimizationNote}</p>
      <p className="mt-2 text-xs text-slate-400">{slot.repostStrategy}</p>
    </div>
  );
}

function StageCard({
  stage: { stage, agentPersona, focus, automations, deliverables }
}: {
  stage: AgentPlan["operationalStages"][number];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-brand-500/20 via-slate-900 to-slate-950 p-6">
      <p className="text-xs uppercase tracking-widest text-brand-200/80">
        {agentPersona}
      </p>
      <h3 className="mt-2 text-lg font-semibold text-white">{stage}</h3>
      <p className="mt-3 text-sm text-slate-200">{focus}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-100">
            Automations
          </p>
          <ul className="mt-2 space-y-2 text-sm text-slate-200">
            {automations.map((automation, index) => (
              <li key={index} className="flex gap-2">
                <span className="text-brand-200">⚙️</span>
                <span>{automation}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-100">
            Deliverables
          </p>
          <ul className="mt-2 space-y-2 text-sm text-slate-200">
            {deliverables.map((deliverable, index) => (
              <li key={index} className="flex gap-2">
                <span className="text-brand-200">📦</span>
                <span>{deliverable}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function AgentStudio() {
  const [input, setInput] = useState<AgentInput>(defaultAgentInput);
  const [plan, setPlan] = useState<AgentPlan>(() =>
    generateAgentPlan(defaultAgentInput())
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGeneratedAt, setLastGeneratedAt] = useState<Date>(new Date());

  const toneHelpText = useMemo(() => toneLabels[input.tone] ?? "", [input.tone]);

  function updateInput<K extends keyof AgentInput>(key: K, value: AgentInput[K]) {
    setInput((prev) => ({
      ...prev,
      [key]: value
    }));
  }

  function handleTextAreaChange(key: TextAreaKeys, value: string) {
    updateInput(key, parseMultiline(value) as AgentInput[TextAreaKeys]);
  }

  function togglePlatform(platform: Platform) {
    setInput((prev) => {
      const exists = prev.platforms.includes(platform);
      const nextPlatforms = exists
        ? prev.platforms.filter((item) => item !== platform)
        : [...prev.platforms, platform];
      return {
        ...prev,
        platforms: nextPlatforms.length ? nextPlatforms : [platform]
      };
    });
  }

  function toggleGoal(goal: CampaignGoal) {
    setInput((prev) => {
      const exists = prev.goals.includes(goal);
      const nextGoals = exists
        ? prev.goals.filter((item) => item !== goal)
        : [...prev.goals, goal];
      return {
        ...prev,
        goals: nextGoals.length ? nextGoals : [goal]
      };
    });
  }

  function handleGenerate() {
    setIsGenerating(true);
    const nextPlan = generateAgentPlan(input);
    setPlan(nextPlan);
    setLastGeneratedAt(new Date());
    setIsGenerating(false);
  }

  function handleDownload() {
    const blob = new Blob([JSON.stringify({ input, plan }, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${input.brandName.replace(/\s+/g, "-").toLowerCase()}-agent-plan.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleCopyToClipboard() {
    await navigator.clipboard.writeText(
      JSON.stringify(
        {
          overview: plan.overview,
          heroPromise: plan.heroPromise,
          videoConcepts: plan.videoConcepts
        },
        null,
        2
      )
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8">
      <header className="rounded-3xl border border-white/10 bg-gradient-to-br from-brand-500/20 via-slate-900 to-slate-950 p-10 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-brand-100">
              Agentic Social Studio
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Autonomous Reels & TikTok Producer
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-slate-200">
              Design an AI agent that continuously scripts, edits, and deploys
              platform-native vertical videos with built-in optimization loops and
              automated publishing to Instagram and TikTok.
            </p>
          </div>
          <div className="rounded-2xl border border-brand-400/30 bg-black/30 px-6 py-5 text-sm text-brand-100">
            <p className="text-xs uppercase tracking-widest text-brand-200/80">
              Last Generated
            </p>
            <p>{lastGeneratedAt.toLocaleString()}</p>
            <p className="mt-2 text-xs text-slate-400">
              Modify the brief and deploy a refreshed drop kit instantly.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-8 lg:grid-cols-[1.1fr,1fr]">
        <div className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-brand-100">
              Brand Blueprint
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Feed the agent your creative brief
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              These inputs fine-tune messaging, pacing, and automation choices across the content pipeline.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                Brand Name
              </span>
              <input
                value={input.brandName}
                onChange={(event) => updateInput("brandName", event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-brand-400/60"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                Hero Offer / Product
              </span>
              <input
                value={input.product}
                onChange={(event) => updateInput("product", event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-brand-400/60"
              />
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
              Target Audience
            </span>
            <input
              value={input.targetAudience}
              onChange={(event) => updateInput("targetAudience", event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-brand-400/60"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
              Differentiator
            </span>
            <textarea
              value={input.differentiation}
              onChange={(event) => updateInput("differentiation", event.target.value)}
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-brand-400/60"
            />
          </label>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                Agent Tone
              </span>
              <select
                value={input.tone}
                onChange={(event) => updateInput("tone", event.target.value as AgentInput["tone"])}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-brand-400/60"
              >
                {Object.entries(toneLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-400">{toneHelpText}</p>
            </label>

            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                Hook Angle
              </span>
              <input
                value={input.hookAngle}
                onChange={(event) => updateInput("hookAngle", event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-brand-400/60"
              />
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                Platforms
              </span>
              <div className="space-y-2">
                {Object.entries(platformLabels).map(([value, label]) => (
                  <label
                    key={value}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white"
                  >
                    <span>{label}</span>
                    <input
                      type="checkbox"
                      checked={input.platforms.includes(value as Platform)}
                      onChange={() => togglePlatform(value as Platform)}
                      className="h-4 w-4 accent-brand-400"
                    />
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                Campaign Goals
              </span>
              <div className="grid gap-2 sm:grid-cols-2">
                {Object.entries(goalLabels).map(([value, label]) => (
                  <label
                    key={value}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white"
                  >
                    <span>{label}</span>
                    <input
                      type="checkbox"
                      checked={input.goals.includes(value as CampaignGoal)}
                      onChange={() => toggleGoal(value as CampaignGoal)}
                      className="h-4 w-4 accent-brand-400"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <label className="space-y-2 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                Key Locations / Sets
              </span>
              <textarea
                value={formatMultiline(input.locations)}
                onChange={(event) => handleTextAreaChange("locations", event.target.value)}
                rows={3}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-brand-400/60"
              />
            </label>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                Cadence per Week
              </span>
              <div className="mt-3 flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={7}
                  value={input.cadencePerWeek}
                  onChange={(event) =>
                    updateInput("cadencePerWeek", Number.parseInt(event.target.value, 10))
                  }
                  className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-brand-500/20"
                />
                <span className="text-sm font-semibold text-brand-100">
                  {input.cadencePerWeek}x
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                Budget Level
              </span>
              <select
                value={input.budgetLevel}
                onChange={(event) =>
                  updateInput("budgetLevel", event.target.value as AgentInput["budgetLevel"])
                }
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-brand-400/60"
              >
                <option value="lean">Lean · Run-and-gun</option>
                <option value="balanced">Balanced · Hybrid toolkit</option>
                <option value="premium">Premium · Studio polish</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                Creator / Partner Roster
              </span>
              <textarea
                value={formatMultiline(input.influencerPartners)}
                onChange={(event) =>
                  handleTextAreaChange("influencerPartners", event.target.value)
                }
                rows={3}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-brand-400/60"
              />
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
              Launch Moments / Key Dates
            </span>
            <textarea
              value={formatMultiline(input.keyDates)}
              onChange={(event) => handleTextAreaChange("keyDates", event.target.value)}
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-brand-400/60"
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 rounded-2xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-400 disabled:cursor-progress disabled:opacity-70"
            >
              {isGenerating ? "Synthesizing…" : "Generate Agent Playbook"}
            </button>
            <button
              onClick={handleCopyToClipboard}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200 transition hover:border-brand-400/40 hover:text-white"
            >
              Copy Highlights
            </button>
            <button
              onClick={handleDownload}
              className="rounded-2xl border border-brand-400/30 bg-brand-500/10 px-5 py-3 text-sm text-brand-100 transition hover:border-brand-400/60"
            >
              Export JSON
            </button>
          </div>
        </div>

        <aside className="flex flex-col gap-6 rounded-3xl border border-brand-400/20 bg-black/30 p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-brand-100">
              Agent Synopsis
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              {plan.overview}
            </h2>
            <p className="mt-3 text-sm text-brand-100">{plan.heroPromise}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-100">
              Positioning
            </p>
            <p className="mt-2 text-sm text-slate-200">{plan.positioning}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-100">
              Tone DNA
            </p>
            <ul className="mt-2 space-y-2 text-sm text-slate-200">
              {plan.toneGuide.map((item, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-brand-200">✴︎</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-100">
              Automation Stack Highlights
            </p>
            <ul className="mt-2 space-y-2 text-sm text-slate-200">
              {plan.integrationNotes.map((note, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-brand-200">⚡</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-brand-100">
              Video Concepts
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Weekly drop kit ready to deploy
            </h2>
          </div>
          <span className="rounded-full border border-brand-400/30 bg-black/40 px-4 py-2 text-xs text-brand-100">
            {plan.videoConcepts.length} ready-to-produce scripts
          </span>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {plan.videoConcepts.map((concept) => (
            <ConceptCard key={concept.id} concept={concept} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-brand-100">
              Publishing Rhythm
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Channel-specific posting schedule
            </h2>
          </div>
          <span className="rounded-full border border-brand-400/30 bg-black/40 px-4 py-2 text-xs text-brand-100">
            {input.cadencePerWeek} drops/week
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plan.postingSchedule.map((slot, index) => (
            <ScheduleCard key={`${slot.day}-${index}`} slot={slot} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-brand-100">
            Ops Workflow
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Agentic production pipeline
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Each stage is staffed by a specialized AI persona connected through automation triggers, ready to execute in your existing tool stack.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {plan.operationalStages.map((stage, index) => (
            <StageCard key={index} stage={stage} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-brand-100">
            Optimization Loops
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Continuous improvement rituals
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {plan.optimizationLoops.map((loop, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-black/30 p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-100">
                Metric
              </p>
              <p className="mt-1 text-sm font-semibold text-white">{loop.metric}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-brand-100">
                Tooling
              </p>
              <p className="text-sm text-slate-200">{loop.tooling}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-brand-100">
                Reaction Plan
              </p>
              <p className="text-sm text-slate-200">{loop.reactionPlan}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-xs uppercase tracking-[0.35em] text-brand-100">
            Production Checklist
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Assets to prep before the sprint
          </h2>
          <ul className="mt-6 space-y-3 text-sm text-slate-200">
            {plan.assetChecklist.map((asset, index) => (
              <li key={index} className="flex gap-3">
                <span className="text-brand-200">▹</span>
                <span>{asset}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-xs uppercase tracking-[0.35em] text-brand-100">
            Launch Synchronization
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Keep the agent plugged in
          </h2>
          <ul className="mt-6 space-y-3 text-sm text-slate-200">
            {input.keyDates.map((date, index) => (
              <li key={index} className="flex gap-3">
                <span className="text-brand-200">🗓</span>
                <span>{date}</span>
              </li>
            ))}
            {plan.integrationNotes.map((note, index) => (
              <li key={`integration-${index}`} className="flex gap-3 text-slate-300">
                <span className="text-brand-200">🔗</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="rounded-3xl border border-brand-400/20 bg-black/40 p-8 text-sm text-slate-300">
        <p>
          Agent mission: orchestrate Instagram and TikTok drops end-to-end — from
          trend mining to storytelling, editing, scheduling, and optimization —
          while letting humans stay focused on vision and relationship-building.
        </p>
      </footer>
    </div>
  );
}
