"use client";

import { useState, useEffect, useRef } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { DOCS_DATA } from "@/lib/static";
import type { DocsIcon } from "@/lib/static/docs";
import {
  Info, Layers, BookOpen, Database, Globe, Shield, MessageSquare,
  HelpCircle, Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const ICON_MAP: Record<DocsIcon, typeof Info> = {
  info: Info,
  features: Layers,
  guide: BookOpen,
  database: Database,
  api: Globe,
  security: Shield,
  notif: MessageSquare,
  faq: HelpCircle,
};

const ICON_COLORS: Record<DocsIcon, { bg: string; color: string; border: string; dot: string }> = {
  info:     { bg: "bg-teal-50",    color: "text-teal-600",    border: "border-teal-200",   dot: "bg-teal-500" },
  features: { bg: "bg-violet-50",  color: "text-violet-600",  border: "border-violet-200", dot: "bg-violet-500" },
  guide:    { bg: "bg-amber-50",   color: "text-amber-600",   border: "border-amber-200",  dot: "bg-amber-500" },
  database: { bg: "bg-indigo-50",  color: "text-indigo-600",  border: "border-indigo-200", dot: "bg-indigo-500" },
  api:      { bg: "bg-emerald-50", color: "text-emerald-600", border: "border-emerald-200",dot: "bg-emerald-500" },
  security: { bg: "bg-red-50",     color: "text-red-600",     border: "border-red-200",    dot: "bg-red-500" },
  notif:    { bg: "bg-green-50",   color: "text-green-600",   border: "border-green-200",  dot: "bg-green-500" },
  faq:      { bg: "bg-blue-50",    color: "text-blue-600",    border: "border-blue-200",   dot: "bg-blue-500" },
};

function RichText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const regex = /(`[^`]+`)|(\*\*[^*]+\*\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1]) {
      const code = match[1].slice(1, -1);
      parts.push(
        <code key={match.index} className="px-1.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-mono font-semibold text-violet-700 whitespace-nowrap">
          {code}
        </code>
      );
    } else if (match[2]) {
      const bold = match[2].slice(2, -2);
      parts.push(
        <strong key={match.index} className="font-bold text-slate-800">{bold}</strong>
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return <>{parts}</>;
}

export default function DocsContent() {
  const sections = DOCS_DATA.filter((d) => d.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  // IntersectionObserver to track which section is in view
  useEffect(() => {
    const sectionEls = sections.map((s) => document.getElementById(`docs-${s.id}`)).filter(Boolean) as HTMLElement[];
    if (sectionEls.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          const id = visible[0].target.id.replace("docs-", "");
          setActiveSection(id);
        }
      },
      {
        rootMargin: "-10% 0px -60% 0px",
        threshold: 0,
      }
    );

    sectionEls.forEach((el) => observerRef.current!.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredSections = sections.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.sectionTitle.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.items.some((item) => item.toLowerCase().includes(q))
    );
  });

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(`docs-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="space-y-6 w-full">
        <PageShell
          title="Dokumentasi SITARA"
          breadcrumbItems={[{ label: "Docs" }]}
          subtitle="Panduan lengkap penggunaan sistem untuk petugas dan administrator."
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start lg:min-h-[calc(100vh-200px)]">
          {/* Sidebar navigation */}
          <div className="lg:col-span-1 hidden lg:block self-start sticky top-6">
            <div className="bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-sm overflow-hidden">
              {/* Search */}
              <div className="p-4 border-b border-slate-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari dokumentasi..."
                    className="pl-9 h-8 text-xs rounded-lg border-slate-200 focus-visible:ring-teal-500/30"
                  />
                </div>
              </div>

              {/* Nav items */}
              <nav className="p-2 space-y-0.5 max-h-[calc(100vh-220px)] overflow-y-auto">
                {sections.map((section) => {
                  const IconComp = ICON_MAP[section.icon];
                  const colors = ICON_COLORS[section.icon];
                  const isActive = activeSection === section.id;

                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all text-xs outline-none focus:outline-none focus-visible:outline-none group ${
                        isActive
                          ? `${colors.bg} font-semibold ${colors.color}`
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        isActive ? `${colors.bg} ${colors.border} border` : "bg-slate-100 group-hover:bg-slate-200"
                      }`}>
                        <IconComp className={`h-3 w-3 ${isActive ? colors.color : "text-slate-400 group-hover:text-slate-600"}`} />
                      </div>
                      <span className="flex-1 truncate">{section.sectionTitle}</span>
                      {isActive && <span className={`w-2 h-2 rounded-full ${colors.dot} flex-shrink-0`} />}
                    </button>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  <span className="font-semibold text-slate-500">{sections.length}</span> bagian ·{" "}
                  <span className="font-semibold text-slate-500">{sections.reduce((acc, s) => acc + s.items.length, 0)}</span> item
                </p>
                <p className="text-[10px] text-slate-300 mt-1">SITARA v2.1.0</p>
              </div>
            </div>
          </div>

          {/* Mobile search (shown on sm/md) */}
          <div className="lg:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari dokumentasi..."
                className="pl-9 h-9 text-sm rounded-xl border-slate-200 focus-visible:ring-teal-500/30"
              />
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3 space-y-6">
            {filteredSections.length === 0 && (
              <div className="bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-sm p-12 text-center">
                <Search className="h-8 w-8 text-slate-200 mx-auto mb-3" />
                <p className="text-sm text-slate-400">Tidak ada dokumentasi yang cocok dengan &quot;{search}&quot;</p>
              </div>
            )}

            {filteredSections.map((section) => {
              const IconComp = ICON_MAP[section.icon];
              const colors = ICON_COLORS[section.icon];

              return (
                <div
                  key={section.id}
                  id={`docs-${section.id}`}
                  className="bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-sm scroll-mt-4"
                >
                  {/* Section header */}
                  <div className="px-6 py-5 border-b border-slate-100 flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center flex-shrink-0`}>
                      <IconComp className={`h-5 w-5 ${colors.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-bold text-slate-900">{section.sectionTitle}</h2>
                      <p className="text-xs text-slate-400 mt-0.5">{section.description}</p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full flex-shrink-0">
                      {section.items.length} item
                    </span>
                  </div>

                  {/* Section items */}
                  <div className="p-6">
                    <div className="space-y-3">
                      {section.items.map((item, i) => (
                        <div key={i} className="flex items-start gap-3 group">
                          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} mt-[7px] flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity`} />
                          <p className="text-[13px] text-slate-600 leading-relaxed flex-1">
                            <RichText text={item} />
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
