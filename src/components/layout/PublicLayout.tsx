"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUp, Coffee, LayoutDashboard } from "lucide-react";
import { useGetMe } from "@/lib/api-client";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [showTop, setShowTop] = useState(false);
  const { data: user } = useGetMe();

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#080c14]">
      <header className="sticky top-0 z-30 bg-[#080c14]/60 backdrop-blur-2xl">
        <div className="max-w-6xl mx-auto px-5">
          <div className="h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <Image src="/logo.png" alt="SITARA Logo" width={34} height={34} className="rounded-xl ring-1 ring-white/[0.08] group-hover:ring-teal-500/40 transition-all" />
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-sm tracking-[0.2em] leading-none">SITARA</span>
                <span className="hidden sm:block text-[10px] text-white/30 font-medium mt-0.5">Rutan Wonosobo</span>
              </div>
            </Link>

            <nav className="flex items-center gap-1 sm:gap-2">
              <Link href="/tracking" className="text-sm font-medium text-white/50 hover:text-white transition-colors px-3 sm:px-4 py-2 rounded-xl hover:bg-white/[0.06]">
                Cek Status
              </Link>
              <Link href="/panduan" className="hidden sm:block text-sm font-medium text-white/50 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/[0.06]">
                Panduan
              </Link>
              {user ? (
                <Link href="/dashboard" className="text-xs font-bold bg-teal-500 hover:bg-teal-400 border border-teal-500 text-white px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </Link>
              ) : (
                <Link href="/login" className="text-xs font-bold bg-white/[0.08] hover:bg-teal-500 border border-white/[0.1] hover:border-teal-500 text-white/80 hover:text-white px-4 py-2 rounded-xl transition-all duration-200">
                  Login
                </Link>
              )}
            </nav>
          </div>
          {/* Bottom border glow */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="border-t border-white/[0.04] bg-[#050810]">
        {/* Top gradient line */}
        <div className="h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent" />

        <div className="max-w-6xl mx-auto px-5 py-10">
          {/* Main footer content */}
          <div className="flex flex-col items-center gap-6">
            {/* Logo & brand */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image src="/logo.png" alt="SITARA Logo" width={28} height={28} className="rounded-lg ring-1 ring-white/[0.08] group-hover:ring-teal-500/30 transition-all" />
              <span className="font-extrabold text-white/70 text-sm tracking-[0.2em] group-hover:text-white/90 transition-colors">SITARA</span>
            </Link>

            {/* Description */}
            <p className="text-xs text-white/25 text-center max-w-md leading-relaxed">
              Sistem Informasi Tracking Reintegrasi Narapidana — Platform resmi pemantauan proses reintegrasi Warga Binaan Pemasyarakatan.
            </p>

            {/* Nav links */}
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
              {[
                { href: "/tracking", label: "Cek Status" },
                { href: "/panduan", label: "Panduan" },
                { href: "/tentang", label: "Tentang" },
                { href: "/kontak", label: "Kontak" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} className="text-xs text-white/30 hover:text-teal-400 font-medium transition-colors">
                  {label}
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />

            {/* Bottom row */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-xs text-white/20">
              <span>© {new Date().getFullYear() > 2026 ? `2026 – ${new Date().getFullYear()}` : "2026"} Rumah Tahanan Negara Wonosobo</span>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-white/10" />
              <span>
                Dibuat dengan <Coffee className="inline h-3 w-3" /> oleh{" "}
                <a href="https://www.instagram.com/eliyantosarage_/" target="_blank" rel="noopener noreferrer" className="text-white/40 font-semibold hover:text-teal-400 transition-colors">
                  Eliyanto Sarage
                </a>
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Kembali ke atas"
        className={`fixed bottom-6 right-6 z-40 w-11 h-11 rounded-xl bg-white/[0.08] border border-white/[0.1] backdrop-blur-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-teal-500 hover:border-teal-500 shadow-lg shadow-black/20 transition-all duration-300 ${
          showTop ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </div>
  );
}
