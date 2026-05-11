"use client";

import { PageShell } from "@/components/layout/PageShell";
import { CHANGELOG_DATA } from "@/lib/static";
import type { ChangelogCategory, ChangelogEntry } from "@/lib/static/changelog";
import { Plus, RefreshCw, Bug, Trash2, Sparkles, Tag, Rocket } from "lucide-react";

const CATEGORY_CONFIG: Record<ChangelogCategory, { label: string; icon: typeof Plus; color: string; bg: string; border: string; dot: string; pillBg: string }> = {
  added:   { label: "Ditambahkan", icon: Plus,      color: "text-emerald-700", bg: "bg-emerald-50",  border: "border-emerald-200", dot: "bg-emerald-500", pillBg: "bg-emerald-500" },
  changed: { label: "Diubah",      icon: RefreshCw, color: "text-amber-700",   bg: "bg-amber-50",    border: "border-amber-200",   dot: "bg-amber-500",   pillBg: "bg-amber-500" },
  fixed:   { label: "Diperbaiki",  icon: Bug,       color: "text-blue-700",    bg: "bg-blue-50",     border: "border-blue-200",    dot: "bg-blue-500",    pillBg: "bg-blue-500" },
  removed: { label: "Dihapus",     icon: Trash2,    color: "text-red-700",     bg: "bg-red-50",      border: "border-red-200",     dot: "bg-red-500",     pillBg: "bg-red-500" },
};

function getEntry(item: string | ChangelogEntry): ChangelogEntry {
  if (typeof item === "string") return { category: "added", text: item };
  return item;
}

function groupByCategory(items: (string | ChangelogEntry)[]) {
  const groups: Partial<Record<ChangelogCategory, string[]>> = {};
  for (const item of items) {
    const entry = getEntry(item);
    if (!groups[entry.category]) groups[entry.category] = [];
    groups[entry.category]!.push(entry.text);
  }
  return groups;
}

/**
 * Render inline markdown-like syntax:
 * - `code` → <code>
 * - **bold** → <strong>
 * - /path → styled path
 */
function RichText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  // Match `code`, **bold**, or plain text
  const regex = /(`[^`]+`)|(\*\*[^*]+\*\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Push text before match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      // Inline code
      const code = match[1].slice(1, -1);
      parts.push(
        <code key={match.index} className="px-1.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-mono font-semibold text-violet-700 whitespace-nowrap">
          {code}
        </code>
      );
    } else if (match[2]) {
      // Bold
      const bold = match[2].slice(2, -2);
      parts.push(
        <strong key={match.index} className="font-bold text-slate-800">{bold}</strong>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Push remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
}

export default function ChangelogContent() {
  const entries = CHANGELOG_DATA.filter((c) => c.isPublished);

  return (
    <>
      <div className="space-y-6 w-full">
        <PageShell
          title="Changelog"
          breadcrumbItems={[{ label: "Changelog" }]}
          subtitle="Riwayat perubahan dan pembaruan SITARA."
        >
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <Tag className="h-3 w-3" />
            <span className="font-semibold text-slate-600">{entries[0]?.version}</span>
            <span>· {entries[0]?.date}</span>
          </div>
        </PageShell>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-teal-300 via-slate-200 to-transparent hidden sm:block" />

          <div className="space-y-10">
            {entries.map((entry, entryIdx) => {
              const groups = groupByCategory(entry.items);
              const categoryOrder: ChangelogCategory[] = ["added", "changed", "fixed", "removed"];
              const isLatest = entryIdx === 0;

              return (
                <div key={entry.id} className="relative">
                  {/* Timeline dot */}
                  <div className="hidden sm:flex absolute left-0 top-0 items-center justify-center z-20">
                    <div className={`w-[47px] h-[47px] rounded-2xl flex items-center justify-center shadow-sm ${isLatest ? "bg-gradient-to-br from-teal-500 to-emerald-600 shadow-teal-500/20" : "bg-white border-2 border-slate-200"}`}>
                      {isLatest ? <Rocket className="h-5 w-5 text-white" /> : <Sparkles className={`h-5 w-5 text-slate-400`} />}
                    </div>
                  </div>

                  {/* Sticky Header — outside card for proper sticky behavior */}
                  <div className={`sm:ml-16 sticky top-0 z-10 px-5 py-4 border border-b-0 rounded-t-2xl backdrop-blur-md ${isLatest ? "bg-teal-50/98 border-teal-200/80" : "bg-white/98 border-slate-200/60"}`}>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-black tracking-tight ${isLatest ? "bg-teal-600 text-white shadow-sm shadow-teal-600/20" : "bg-slate-800 text-white"}`}>
                        {entry.version}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{entry.date}</span>
                      {isLatest && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-700 border border-teal-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                          Terbaru
                        </span>
                      )}
                      {/* Category pills */}
                      <div className="flex items-center gap-1.5 ml-auto">
                        {categoryOrder.map((cat) => {
                          const items = groups[cat];
                          if (!items || items.length === 0) return null;
                          const config = CATEGORY_CONFIG[cat];
                          return (
                            <span key={cat} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${config.bg} ${config.color} border ${config.border}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                              {items.length}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    {entry.summary && (
                      <p className="text-sm text-slate-500 mt-2.5 leading-relaxed">
                        <RichText text={entry.summary} />
                      </p>
                    )}
                  </div>

                  {/* Content card body */}
                  <div className={`sm:ml-16 bg-white border border-t-0 rounded-b-2xl shadow-sm ${isLatest ? "border-teal-200/80 shadow-teal-500/5" : "border-slate-200/60"}`}>

                    {/* Categories */}
                    <div className="p-5 space-y-6">
                      {categoryOrder.map((cat) => {
                        const items = groups[cat];
                        if (!items || items.length === 0) return null;
                        const config = CATEGORY_CONFIG[cat];
                        const Icon = config.icon;

                        return (
                          <div key={cat}>
                            {/* Category header */}
                            <div className="flex items-center gap-2.5 mb-3">
                              <div className={`w-8 h-8 rounded-xl ${config.bg} border ${config.border} flex items-center justify-center`}>
                                <Icon className={`h-4 w-4 ${config.color}`} />
                              </div>
                              <h3 className={`text-xs font-bold uppercase tracking-wider ${config.color}`}>
                                {config.label}
                              </h3>
                              <div className="flex-1 h-px bg-slate-100" />
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${config.pillBg}`}>
                                {items.length}
                              </span>
                            </div>

                            {/* Items */}
                            <div className="space-y-2.5 pl-10">
                              {items.map((text, i) => (
                                <div key={i} className="flex items-start gap-3 group">
                                  <span className={`w-1.5 h-1.5 rounded-full ${config.dot} mt-[7px] flex-shrink-0 opacity-50 group-hover:opacity-100 group-hover:scale-150 transition-all`} />
                                  <p className="text-[13px] text-slate-600 leading-relaxed">
                                    <RichText text={text} />
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/40 rounded-b-2xl flex items-center gap-3 flex-wrap">
                      <span className="text-[10px] text-slate-400 font-mono">{entry.id.slice(0, 8)}</span>
                      <div className="flex-1" />
                      <span className="text-[10px] text-slate-300">
                        {entry.items.length} perubahan
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* End of timeline */}
          <div className="hidden sm:flex items-center justify-center mt-8">
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-slate-200" />
              <span className="text-xs text-slate-300 font-medium">Awal mula SITARA</span>
              <div className="h-px w-12 bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
