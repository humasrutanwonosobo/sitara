"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAdminLogin, useGetMe } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock, Mail, ArrowRight, ShieldAlert } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export default function Login() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: user, isLoading: isCheckingAuth } = useGetMe();
  const loginMutation = useAdminLogin();

  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate({ data: values }, {
      onSuccess: () => {
        toast({ title: "Selamat datang", description: "Berhasil masuk ke Portal SITARA." });
        router.push("/dashboard");
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Login Gagal",
          description: (error as { error?: { error?: string } }).error?.error || "Periksa email dan password Anda.",
        });
      },
    });
  };

  if (isCheckingAuth) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — Visual Panel */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col overflow-hidden bg-[#0a0f1e]">
        {/* Mesh gradient bg */}
        <div className="absolute inset-0">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-teal-600/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/15 blur-[100px]" />
          <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] rounded-full bg-teal-500/10 blur-[80px]" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />

        <div className="relative z-10 flex flex-col h-full p-12">
          <div className="flex items-center gap-3 mb-auto">
            <Image src="/logo.png" alt="SITARA" width={36} height={36} className="rounded-xl shadow-lg" />
            <div>
              <p className="font-bold text-white text-base tracking-wide">SITARA</p>
              <p className="text-[10px] sm:text-xs text-teal-400 uppercase tracking-widest font-medium">Portal Petugas</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-md">
            <div className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] text-teal-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-8 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              Sistem Aktif & Aman
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-5 tracking-tight">
              Tracking Reintegrasi<br />
              <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                Narapidana
              </span>
            </h2>
            <p className="text-slate-400 leading-relaxed text-base">
              Platform manajemen data dan pemantauan status proses reintegrasi untuk petugas pemasyarakatan.
            </p>

            <div className="mt-12 grid grid-cols-3 gap-4">
              {[
                { num: "8", label: "Tahapan", sub: "Proses Terstruktur" },
                { num: "4", label: "Layanan", sub: "PB · CB · CMB · Asimilasi" },
                { num: "24/7", label: "Akses", sub: "Monitoring Real-time" },
              ].map(({ num, label, sub }) => (
                <div key={label} className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-4">
                  <p className="text-2xl font-bold text-white">{num}</p>
                  <p className="text-xs font-semibold text-teal-400 mt-0.5">{label}</p>
                  <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-600 mt-auto">
            © {new Date().getFullYear() > 2026 ? `2026 – ${new Date().getFullYear()}` : "2026"} SITARA · Rumah Tahanan Negara Wonosobo
          </p>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-6 sm:mb-10 lg:hidden">
            <Image src="/logo.png" alt="SITARA" width={32} height={32} className="rounded-lg" />
            <span className="font-bold text-slate-900">SITARA</span>
          </div>

          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-teal-600 transition-colors mb-6">
              <ArrowRight className="h-3.5 w-3.5 rotate-180" />
              Kembali ke Beranda
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Masuk ke Portal</h1>
            <p className="text-slate-500 mt-1.5 text-sm">Gunakan kredensial yang diberikan administrator.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">Alamat Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="admin@sitara.go.id"
                          className="pl-9 h-11 bg-slate-50 border-slate-200 focus-visible:ring-teal-500/30 focus-visible:border-teal-400 rounded-xl"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="pl-9 h-11 bg-slate-50 border-slate-200 focus-visible:ring-teal-500/30 focus-visible:border-teal-400 rounded-xl"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-sm shadow-teal-500/25 transition-all mt-2"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ArrowRight className="h-4 w-4 mr-2" />
                )}
                {loginMutation.isPending ? "Memproses..." : "Masuk"}
              </Button>
            </form>
          </Form>

          <p className="text-xs text-slate-400 text-center mt-8">
            Lupa password? Hubungi administrator sistem.
          </p>

          {/* Access notice */}
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <p className="text-xs text-amber-800 leading-relaxed flex items-start gap-2">
              <ShieldAlert className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
              <span><span className="font-semibold">Akses Terbatas</span> — Portal ini hanya untuk petugas Rutan Wonosobo yang telah terdaftar. Percobaan login tanpa izin akan tercatat di sistem.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
