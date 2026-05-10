"use client";

import { useGetMe, useAdminLogout } from "@/lib/api-client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Loader2, LogOut, LayoutDashboard, Users, Bell, Coffee,
  Settings, FileText, MessageSquare, ChevronRight, BookOpen,
  Headphones, Clock, PhoneCall
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const NAV_MAIN = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/wbp", label: "Data WBP", icon: Users },
  { href: "/dashboard/buku-analisa", label: "Buku Analisa", icon: BookOpen },
  { href: "/dashboard/notifikasi", label: "Notifikasi WA", icon: MessageSquare },
];

const NAV_SISTEM = [
  { href: "/dashboard/laporan", label: "Laporan", icon: FileText },
  { href: "/dashboard/pengaturan", label: "Pengaturan", icon: Settings },
  { href: "/dashboard/docs", label: "Docs", icon: BookOpen },
  { href: "/dashboard/changelog", label: "Changelog", icon: ChevronRight },
];

function NavItem({ href, label, icon: Icon, active }: { href: string; label: string; icon: React.ElementType; active: boolean }) {
  return (
    <Link
      href={href}
      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-all text-left group ${
        active
          ? "bg-teal-50 text-teal-700 font-semibold ring-1 ring-teal-100"
          : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
      }`}
    >
      <Icon className={`h-4 w-4 flex-shrink-0 transition-colors ${active ? "text-teal-600" : "text-slate-400 group-hover:text-slate-600"}`} />
      <span className="flex-1">{label}</span>
      {active && <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />}
    </Link>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: user } = useGetMe();
  const router = useRouter();
  const pathname = usePathname();
  const logout = useAdminLogout();

  const handleLogout = () => {
    logout.mutate(undefined, { onSuccess: () => router.push("/login") });
  };

  const isActive = (href: string) => {
    if (!pathname) return false;
    return href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname === href || pathname.startsWith(href + "/");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()
    : "AS";

  return (
    <div className="h-screen overflow-hidden bg-slate-50 flex flex-col">
      {/* ── Topbar ── */}
      <header className="h-14 bg-[#111827] flex items-center justify-between px-5 flex-shrink-0 border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="SITARA" width={32} height={32} className="rounded-lg" />
          <div>
            <span className="font-bold text-white text-sm tracking-wide">SITARA</span>
            <span className="text-slate-500 text-[10px] sm:text-xs ml-2 font-medium uppercase tracking-widest hidden sm:inline">Rutan Wonosobo</span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/[0.06] relative h-8 w-8 rounded-lg">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
          </Button>

          <div className="w-px h-5 bg-white/[0.08] mx-1" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 text-slate-300 hover:text-white hover:bg-white/[0.06] px-2 h-8 rounded-lg">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {initials}
                </div>
                <span className="text-sm font-medium hidden md:block">{user?.name || "Admin"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 rounded-xl shadow-xl border-slate-200/60">
              <DropdownMenuLabel className="text-xs text-slate-400 font-normal">{user?.email || ""}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/dashboard/pengaturan">
                <DropdownMenuItem className="cursor-pointer rounded-lg">
                  <Settings className="mr-2 h-3.5 w-3.5" /> Pengaturan
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 cursor-pointer rounded-lg"
                onClick={handleLogout}
                disabled={logout.isPending}
              >
                {logout.isPending ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <LogOut className="mr-2 h-3.5 w-3.5" />}
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar ── */}
        <aside className="w-56 bg-white flex-shrink-0 hidden md:flex flex-col border-r border-slate-100 shadow-[1px_0_20px_rgba(0,0,0,0.03)]">
          <nav className="flex-1 p-3 pt-5 space-y-5 overflow-y-auto">
            <div>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5 px-3">Menu</p>
              <div className="space-y-0.5">
                {NAV_MAIN.map(({ href, label, icon }) => (
                  <NavItem key={href} href={href} label={label} icon={icon} active={isActive(href)} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5 px-3">Sistem</p>
              <div className="space-y-0.5">
                {NAV_SISTEM.map(({ href, label, icon }) => (
                  <NavItem key={href} href={href} label={label} icon={icon} active={isActive(href)} />
                ))}
              </div>
            </div>
          </nav>

          <div className="p-3 border-t border-slate-100">
            <div className="flex items-center gap-2.5 px-2 py-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-700 truncate">{user?.name || "Admin"}</p>
                <p className="text-[10px] sm:text-xs text-slate-400 truncate">Administrator</p>
              </div>
            </div>
            <div className="mt-2 rounded-xl overflow-hidden border border-teal-200/70 shadow-sm">
              <div className="bg-gradient-to-br from-teal-500 to-emerald-600 px-3 pt-3 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Headphones className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">Helpdesk SITARA</p>
                    <p className="text-[10px] sm:text-xs text-teal-100/80 mt-0.5">Rutan Kelas IIB Wonosobo</p>
                  </div>
                </div>
              </div>
              <div className="bg-white px-3 py-2.5 space-y-1.5">
                <div className="flex items-center gap-2">
                  <PhoneCall className="h-3 w-3 text-teal-500 flex-shrink-0" />
                  <span className="text-xs font-bold text-slate-800 font-mono tracking-wider">(0286) 321030</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-slate-400 flex-shrink-0" />
                  <span className="text-[10px] sm:text-xs text-slate-500">Senin – Jumat · 09.00–11.30</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="flex-1 overflow-y-auto min-w-0 bg-slate-50 flex flex-col">
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </div>

          {/* Admin footer */}
          <footer className="border-t border-slate-100 bg-white px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
              <span>© {new Date().getFullYear() > 2026 ? `2026 – ${new Date().getFullYear()}` : "2026"} SITARA · Rumah Tahanan Negara Wonosobo</span>
              <span>
                Dibuat dengan <Coffee className="inline h-3 w-3" /> oleh{" "}
                <a href="https://www.instagram.com/eliyantosarage_/" target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-500 hover:text-teal-600 transition-colors">
                  Eliyanto Sarage
                </a>
              </span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
