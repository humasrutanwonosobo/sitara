"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import {
  KeyRound, ArrowRight, ShieldCheck, Zap, FileCheck2,
  MessageSquare, CheckCircle2, ChevronRight, Clock,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

type LayananItem = { id: string; code: string; label: string; desc: string; color: string; glow: string; dot: string };
type TahapanItem = { id: string; num: string; title: string; sub: string; desc: string };
type FeatureItem = { id: string; section: string; data: Record<string, string> };

const ICON_MAP: Record<string, React.ElementType> = {
  FileCheck2, Zap, MessageSquare, ShieldCheck,
};

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);

  const { data: layanan } = useQuery<LayananItem[]>({
    queryKey: ["pengaturan-layanan"],
    queryFn: () => fetch("/api/pengaturan/layanan").then((r) => { if (!r.ok) throw new Error(); return r.json(); }),
  });

  const { data: tahapan } = useQuery<TahapanItem[]>({
    queryKey: ["pengaturan-tahapan"],
    queryFn: () => fetch("/api/pengaturan/tahapan").then((r) => { if (!r.ok) throw new Error(); return r.json(); }),
  });

  const { data: keunggulan } = useQuery<FeatureItem[]>({
    queryKey: ["pengaturan-features", "keunggulan"],
    queryFn: () => fetch("/api/pengaturan/features?section=keunggulan").then((r) => { if (!r.ok) throw new Error(); return r.json(); }),
  });

  const { data: howTo } = useQuery<FeatureItem[]>({
    queryKey: ["pengaturan-features", "how_to"],
    queryFn: () => fetch("/api/pengaturan/features?section=how_to").then((r) => { if (!r.ok) throw new Error(); return r.json(); }),
  });

  const { data: siteConfig } = useQuery<Record<string, unknown>>({
    queryKey: ["pengaturan-site-config"],
    queryFn: () => fetch("/api/pengaturan/site-config").then((r) => { if (!r.ok) throw new Error(); return r.json(); }),
  });

  const featurePills: { icon: string; label: string }[] = (siteConfig?.feature_pills as { icon: string; label: string }[]) || [];
  const heroSubtitle = (siteConfig?.hero_subtitle as string) || "Cek proses Pembebasan Bersyarat, Cuti Bersyarat, dan Cuti Menjelang Bebas secara langsung — tanpa perlu ke kantor.";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/tracking?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[calc(100dvh-56px)] flex items-center justify-center overflow-hidden bg-[#080c14] px-5 py-16 sm:py-20 lg:py-24">
        {/* Grid background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Glow orbs */}
        <div className="pointer-events-none absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-80 md:h-[500px] rounded-full bg-teal-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 right-[-5%] w-[400px] h-[400px] rounded-full bg-emerald-600/8 blur-[100px]" />
        <div className="pointer-events-none absolute top-[20%] left-[-8%] w-[300px] h-64 md:h-[300px] rounded-full bg-blue-600/8 blur-[80px]" />

        {/* Main content */}
        <div className="relative w-full max-w-2xl lg:max-w-4xl mx-auto text-center">
          {/* Pill badge */}
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-700 fill-mode-both delay-100 inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold px-4 py-1.5 rounded-full mb-6 sm:mb-8 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            Layanan Publik Online · 24/7 Gratis
            <ChevronRight className="h-3 w-3 opacity-60" />
          </div>

          {/* Heading */}
          <h1 className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both delay-200 text-[clamp(2.25rem,5.5vw,4.25rem)] font-black text-white leading-[1.08] tracking-tighter text-balance mb-5 sm:mb-6">
            Pantau Status{" "}
            <span
              className="relative inline-block"
              style={{
                background: "linear-gradient(135deg, #2dd4bf 0%, #34d399 50%, #6ee7b7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
              Reintegrasi
            </span>
            <br />
            <span className="text-white/60">Keluarga Anda</span>
          </h1>

          <p className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both delay-300 text-sm sm:text-base md:text-lg text-white/40 max-w-md sm:max-w-lg lg:max-w-xl mx-auto leading-relaxed mb-8 sm:mb-10">
            {heroSubtitle}
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="animate-in fade-in slide-in-from-bottom-5 zoom-in-95 duration-700 fill-mode-both delay-500 max-w-md sm:max-w-lg lg:max-w-xl mx-auto mb-4 sm:mb-5">
            <div
              className={`flex items-center gap-2 bg-white/[0.05] border rounded-2xl p-1.5 transition-all duration-300 ${
                focused
                  ? "border-teal-500/50 shadow-[0_0_0_4px_rgba(20,184,166,0.12)]"
                  : "border-white/10 shadow-lg"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0 ml-1">
                <KeyRound className="h-4 w-4 text-white/40" />
              </div>
              <Input
                type="text"
                placeholder="SITARA-PB-XXXXXXXX"
                className="border-0 focus-visible:ring-0 shadow-none bg-transparent text-white placeholder:text-white/25 text-sm h-10 px-0 font-mono tracking-wider"
                value={search}
                onChange={(e) => setSearch(e.target.value.toUpperCase())}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
              />
              <button
                type="submit"
                className="h-10 px-5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white text-sm font-bold flex-shrink-0 flex items-center gap-2 transition-all shadow-sm shadow-teal-500/30 active:scale-95"
              >
                Cari <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>

          <p className="animate-in fade-in duration-700 fill-mode-both delay-700 text-xs text-white/25">
            Contoh: <span className="text-white/40 font-mono">SITARA-PB-A3K9X2M7</span> · Kode dikirim via WhatsApp saat Warga Binaan didaftarkan
          </p>

          {/* Stats inline */}
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-700 fill-mode-both delay-700 flex items-center justify-center gap-4 mt-8">
            {[{ val: String(tahapan?.length ?? 8), label: "Tahapan Proses" }, { val: String(layanan?.length ?? 4), label: "Jenis Layanan" }].map(({ val, label }) => (
              <div key={label} className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-xl px-3.5 py-2">
                <span className="text-lg font-black text-white tabular-nums">{val}</span>
                <span className="text-xs text-white/40">{label}</span>
              </div>
            ))}
          </div>

          {/* Feature pills */}
          <div className="animate-in fade-in duration-700 fill-mode-both delay-1000 flex items-center justify-center gap-2.5 mt-8 sm:mt-10 flex-wrap">
            {featurePills.map(({ icon, label }) => {
              const Icon = ICON_MAP[icon] ?? ShieldCheck;
              return (
                <div key={label} className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.07] px-3 py-1.5 rounded-full">
                  <Icon className="h-3 w-3 text-teal-400" />
                  <span className="text-xs text-white/50 font-medium">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="animate-in fade-in duration-1000 fill-mode-both delay-1000 absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-30">
          <span className="text-[10px] sm:text-xs text-white tracking-widest uppercase font-semibold">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      {/* ── LAYANAN ── */}
      <section className="bg-[#0c1120] border-t border-white/[0.05] py-12 sm:py-16 lg:py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll animation="animate-in fade-in slide-in-from-bottom-4 duration-700" className="mb-8 sm:mb-14">
            <p className="text-xs font-bold text-teal-500 uppercase tracking-widest mb-3">Program Reintegrasi</p>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight max-w-md">
                Empat Jenis<br />
                <span className="text-white/40">Layanan Reintegrasi</span>
              </h2>
              <p className="text-sm text-white/40 max-w-xs leading-relaxed">
                Setiap layanan memiliki syarat dan tahapan yang berbeda. Pilih sesuai kondisi Warga Binaan.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {layanan?.map(({ code, label, desc }, i) => {
              const colors = [
                { text: "text-blue-400", dot: "bg-blue-400" },
                { text: "text-violet-400", dot: "bg-violet-400" },
                { text: "text-teal-400", dot: "bg-teal-400" },
                { text: "text-amber-400", dot: "bg-amber-400" },
              ];
              const c = colors[i % colors.length];
              return (
              <AnimateOnScroll key={code} animation="animate-in fade-in slide-in-from-bottom-5 zoom-in-95 duration-500" delay={i * 100}>
                <div className="group relative bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/[0.04] hover:-translate-y-1 cursor-default overflow-hidden h-full">
                  {/* Big number */}
                  <span className="absolute -top-3 -right-1 text-[80px] font-black text-white/[0.03] leading-none select-none pointer-events-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="mb-5">
                    <div className="inline-flex items-center gap-2 mb-3">
                      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                      <span className={`text-xs font-black uppercase tracking-widest ${c.text}`}>{code}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{label}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
                  </div>

                  <Link
                    href="/tracking"
                    className="flex items-center gap-1.5 text-xs font-bold text-white/30 group-hover:text-teal-400 transition-colors"
                  >
                    Cek status <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </AnimateOnScroll>
            );})}
          </div>
        </div>
      </section>

      {/* ── KEUNGGULAN ── */}
      <section className="bg-[#080c14] border-t border-white/[0.05] py-12 sm:py-16 lg:py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <AnimateOnScroll animation="animate-in fade-in slide-in-from-left-6 duration-700">
              <p className="text-xs font-bold text-teal-500 uppercase tracking-widest mb-3">Kenapa SITARA?</p>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mb-6">
                Dirancang untuk<br />
                <span className="text-white/40">Keluarga Warga Binaan</span>
              </h2>
              <p className="text-sm text-white/40 leading-relaxed max-w-md mb-6 sm:mb-10">
                Tidak perlu antri, tidak perlu datang ke kantor. Seluruh informasi proses reintegrasi tersedia secara real-time dari genggaman tangan Anda.
              </p>
              <Link
                href="/tracking"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-sm shadow-teal-500/30 active:scale-95"
              >
                Mulai Pengecekan <ArrowRight className="h-4 w-4" />
              </Link>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {keunggulan?.map(({ id, data: f }, i) => {
                const Icon = ICON_MAP[f.icon] ?? ShieldCheck;
                return (
                <AnimateOnScroll key={id} animation="animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-500" delay={i * 100}>
                  <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 hover:bg-white/[0.05] hover:border-white/[0.12] hover:-translate-y-1 transition-all duration-300 h-full">
                    <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-4">
                      <Icon className="h-4 w-4 text-teal-400" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-2">{f.title}</h3>
                    <p className="text-xs text-white/35 leading-relaxed">{f.desc}</p>
                  </div>
                </AnimateOnScroll>
              );})}
            </div>
          </div>
        </div>
      </section>

      {/* ── TAHAPAN ── */}
      <section className="bg-[#0c1120] border-t border-white/[0.05] py-12 sm:py-16 lg:py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll animation="animate-in fade-in slide-in-from-bottom-4 duration-700" className="text-center mb-8 sm:mb-14">
            <p className="text-xs font-bold text-teal-500 uppercase tracking-widest mb-3">Alur Proses</p>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              {tahapan?.length ?? 8} Tahapan Reintegrasi
            </h2>
            <p className="text-sm text-white/40 mt-3 max-w-sm mx-auto">Proses berurutan dari verifikasi berkas hingga terbitnya Surat Keputusan.</p>
          </AnimateOnScroll>

          {/* Steps — timeline layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-0 max-w-4xl mx-auto">
            {tahapan?.map(({ num, title, sub, desc }, i) => (
              <AnimateOnScroll key={num} animation="animate-in fade-in slide-in-from-bottom-4 duration-500" delay={i * 80}>
                <div className="flex gap-4 py-4 group">
                  {/* Number + line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center border text-sm font-black flex-shrink-0 transition-all ${
                      i === 0
                        ? "bg-teal-500/15 border-teal-500/30 text-teal-400 shadow-md shadow-teal-500/10"
                        : "bg-white/[0.04] border-white/[0.08] text-white/30 group-hover:border-white/[0.15] group-hover:text-white/50"
                    }`}>
                      {num}
                    </div>
                    {i < (tahapan?.length ?? 0) - 1 && (
                      <div className="w-px flex-1 min-h-4 mt-2 bg-gradient-to-b from-white/[0.08] to-transparent lg:hidden" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pt-1.5 min-w-0">
                    <p className={`text-sm font-bold mb-0.5 ${i === 0 ? "text-white" : "text-white/70"}`}>{title}</p>
                    <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1.5 ${i === 0 ? "text-teal-400" : "text-white/25"}`}>{sub}</p>
                    <p className="text-xs text-white/30 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW TO ── */}
      <section className="bg-[#080c14] border-t border-white/[0.05] py-12 sm:py-16 lg:py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left: steps */}
            <AnimateOnScroll animation="animate-in fade-in slide-in-from-left-6 duration-700">
              <p className="text-xs font-bold text-teal-500 uppercase tracking-widest mb-3">Cara Penggunaan</p>
              <h2 className="text-3xl font-black text-white tracking-tight mb-6 sm:mb-10">3 Langkah Mudah</h2>
              <div className="space-y-0">
                {howTo?.map(({ id, data: step }, i, arr) => (
                  <div key={id} className="flex gap-5">
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-sm font-black flex-shrink-0 shadow-sm shadow-teal-500/30">
                        {step.n}
                      </div>
                      {i < arr.length - 1 && <div className="w-px flex-1 min-h-8 my-2 bg-gradient-to-b from-teal-500/30 to-transparent" />}
                    </div>
                    <div className={i < arr.length - 1 ? "pb-8" : ""}>
                      <h3 className="text-sm font-bold text-white mb-1">{step.title}</h3>
                      <p className="text-xs text-white/35 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>

            {/* Right: CTA card */}
            <AnimateOnScroll animation="animate-in fade-in slide-in-from-right-6 zoom-in-95 duration-700" delay={200}>
              <div className="relative">
                <div className="absolute inset-0 bg-teal-500/5 rounded-3xl blur-3xl" />
                <div className="relative bg-gradient-to-br from-teal-900/30 to-emerald-900/20 border border-teal-500/20 rounded-3xl p-10 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-teal-500/30">
                    <Clock className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3">Cek Sekarang</h3>
                  <p className="text-sm text-white/40 mb-8 max-w-xs mx-auto leading-relaxed">
                    Dapatkan informasi terkini tentang status reintegrasi anggota keluarga Anda.
                  </p>
                  <Link
                    href="/tracking"
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white text-sm font-bold px-6 py-3.5 rounded-xl transition-all shadow-md shadow-teal-500/30 active:scale-95 mb-4"
                  >
                    Mulai Pengecekan <ArrowRight className="h-4 w-4" />
                  </Link>
                  <div className="flex items-center justify-center gap-4 text-xs text-white/25">
                    <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-teal-500" />Gratis</span>
                    <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-teal-500" />Akses Aman</span>
                    <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-teal-500" />24/7</span>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>
    </>
  );
}
