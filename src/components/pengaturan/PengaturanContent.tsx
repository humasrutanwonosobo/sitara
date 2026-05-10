"use client";

import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Pencil, Trash2, BookOpen, GitBranch, Layers, ListOrdered, Settings2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// ── Shared Types ──
type Doc = { id: string; sectionTitle: string; items: string[]; sortOrder: number; isActive: boolean };
type ChangelogEntry = { id: string; version: string; date: string; items: string[]; isPublished: boolean };
type Layanan = { id: string; code: string; label: string; desc: string; color: string; glow: string; dot: string; sortOrder: number; isActive: boolean };
type Tahapan = { id: string; num: string; title: string; sub: string; desc: string; sortOrder: number; isActive: boolean };

// ── Generic CRUD Section ──
function CrudSection<T extends { id: string }>({
  title, icon: Icon, queryKey, apiUrl, items, renderCard, renderForm: FormComponent,
}: {
  title: string; icon: React.ElementType; queryKey: string; apiUrl: string;
  items: T[] | undefined; renderCard: (item: T, onDelete: () => void) => React.ReactNode;
  renderForm: React.ComponentType<{ item?: T; apiUrl: string; queryKey: string; onClose: () => void }>;
}) {
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<T | undefined>();
  const qc = useQueryClient();

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      return res.json();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: [queryKey] }); toast.success("Berhasil dihapus"); },
    onError: () => toast.error("Gagal menghapus"),
  });

  return (
    <Card className="rounded-2xl border-slate-200/70 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-teal-600" />
          <CardTitle className="text-base">{title}</CardTitle>
          <Badge variant="secondary" className="text-[10px] sm:text-xs">{items?.length ?? 0}</Badge>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditItem(undefined); }}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-7 text-xs gap-1" onClick={() => setEditItem(undefined)}>
              <Plus className="h-3 w-3" /> Tambah
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editItem ? "Edit" : "Tambah"} {title}</DialogTitle></DialogHeader>
            <FormComponent item={editItem} apiUrl={apiUrl} queryKey={queryKey} onClose={() => { setOpen(false); setEditItem(undefined); }} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-2">
        {items?.map((item) => renderCard(item, () => deleteMut.mutate(item.id)))}
        {!items?.length && <p className="text-sm text-slate-400 text-center py-4">Belum ada data</p>}
      </CardContent>
    </Card>
  );
}

// ── Form Components ──
function DocsForm({ item, apiUrl, queryKey, onClose }: { item?: Doc; apiUrl: string; queryKey: string; onClose: () => void }) {
  const qc = useQueryClient();
  const [title, setTitle] = useState(item?.sectionTitle ?? "");
  const [items, setItems] = useState(item?.items?.join("\n") ?? "");
  const [sortOrder, setSortOrder] = useState(item?.sortOrder ?? 0);
  const mut = useMutation({
    mutationFn: async () => {
      const body = { sectionTitle: title, items: items.split("\n").filter(Boolean), sortOrder, isActive: true };
      const res = item ? await fetch(`${apiUrl}/${item.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
                        : await fetch(apiUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error("Gagal menyimpan");
      return res.json();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: [queryKey] }); toast.success("Berhasil disimpan"); onClose(); },
    onError: () => toast.error("Gagal menyimpan"),
  });
  return (
    <div className="space-y-3">
      <div><Label>Judul Section</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
      <div><Label>Items (satu per baris)</Label><Textarea rows={5} value={items} onChange={(e) => setItems(e.target.value)} /></div>
      <div><Label>Urutan</Label><Input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} /></div>
      <Button onClick={() => mut.mutate()} disabled={mut.isPending} className="w-full">
        {mut.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Simpan
      </Button>
    </div>
  );
}

function ChangelogForm({ item, apiUrl, queryKey, onClose }: { item?: ChangelogEntry; apiUrl: string; queryKey: string; onClose: () => void }) {
  const qc = useQueryClient();
  const [version, setVersion] = useState(item?.version ?? "");
  const [date, setDate] = useState(item?.date ?? "");
  const [items, setItems] = useState(item?.items?.join("\n") ?? "");
  const mut = useMutation({
    mutationFn: async () => {
      const body = { version, date, items: items.split("\n").filter(Boolean), isPublished: true };
      const res = item ? await fetch(`${apiUrl}/${item.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
                        : await fetch(apiUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error("Gagal menyimpan");
      return res.json();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: [queryKey] }); toast.success("Berhasil disimpan"); onClose(); },
    onError: () => toast.error("Gagal menyimpan"),
  });
  return (
    <div className="space-y-3">
      <div><Label>Versi</Label><Input value={version} onChange={(e) => setVersion(e.target.value)} placeholder="v1.0.0" /></div>
      <div><Label>Tanggal</Label><Input value={date} onChange={(e) => setDate(e.target.value)} placeholder="01 Jan 2026" /></div>
      <div><Label>Items (satu per baris)</Label><Textarea rows={5} value={items} onChange={(e) => setItems(e.target.value)} /></div>
      <Button onClick={() => mut.mutate()} disabled={mut.isPending} className="w-full">
        {mut.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Simpan
      </Button>
    </div>
  );
}

function LayananForm({ item, apiUrl, queryKey, onClose }: { item?: Layanan; apiUrl: string; queryKey: string; onClose: () => void }) {
  const qc = useQueryClient();
  const [code, setCode] = useState(item?.code ?? "");
  const [label, setLabel] = useState(item?.label ?? "");
  const [desc, setDesc] = useState(item?.desc ?? "");
  const [color, setColor] = useState(item?.color ?? "from-teal-500 to-emerald-600");
  const [glow, setGlow] = useState(item?.glow ?? "shadow-teal-500/20");
  const [dot, setDot] = useState(item?.dot ?? "bg-teal-400");
  const [sortOrder, setSortOrder] = useState(item?.sortOrder ?? 0);
  const mut = useMutation({
    mutationFn: async () => {
      const body = { code, label, desc, color, glow, dot, sortOrder, isActive: true };
      const res = item ? await fetch(`${apiUrl}/${item.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
                        : await fetch(apiUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error("Gagal menyimpan");
      return res.json();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: [queryKey] }); toast.success("Berhasil disimpan"); onClose(); },
    onError: () => toast.error("Gagal menyimpan"),
  });
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Kode</Label><Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="PB" /></div>
        <div><Label>Label</Label><Input value={label} onChange={(e) => setLabel(e.target.value)} /></div>
      </div>
      <div><Label>Deskripsi</Label><Textarea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
      <div className="grid grid-cols-3 gap-3">
        <div><Label>Color</Label><Input value={color} onChange={(e) => setColor(e.target.value)} /></div>
        <div><Label>Glow</Label><Input value={glow} onChange={(e) => setGlow(e.target.value)} /></div>
        <div><Label>Dot</Label><Input value={dot} onChange={(e) => setDot(e.target.value)} /></div>
      </div>
      <div><Label>Urutan</Label><Input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} /></div>
      <Button onClick={() => mut.mutate()} disabled={mut.isPending} className="w-full">
        {mut.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Simpan
      </Button>
    </div>
  );
}

function TahapanForm({ item, apiUrl, queryKey, onClose }: { item?: Tahapan; apiUrl: string; queryKey: string; onClose: () => void }) {
  const qc = useQueryClient();
  const [num, setNum] = useState(item?.num ?? "");
  const [title, setTitle] = useState(item?.title ?? "");
  const [sub, setSub] = useState(item?.sub ?? "");
  const [desc, setDesc] = useState(item?.desc ?? "");
  const [sortOrder, setSortOrder] = useState(item?.sortOrder ?? 0);
  const mut = useMutation({
    mutationFn: async () => {
      const body = { num, title, sub, desc, sortOrder, isActive: true };
      const res = item ? await fetch(`${apiUrl}/${item.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
                        : await fetch(apiUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error("Gagal menyimpan");
      return res.json();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: [queryKey] }); toast.success("Berhasil disimpan"); onClose(); },
    onError: () => toast.error("Gagal menyimpan"),
  });
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Nomor</Label><Input value={num} onChange={(e) => setNum(e.target.value)} placeholder="01" /></div>
        <div><Label>Urutan</Label><Input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} /></div>
      </div>
      <div><Label>Judul</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
      <div><Label>Sub</Label><Input value={sub} onChange={(e) => setSub(e.target.value)} /></div>
      <div><Label>Deskripsi</Label><Textarea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
      <Button onClick={() => mut.mutate()} disabled={mut.isPending} className="w-full">
        {mut.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Simpan
      </Button>
    </div>
  );
}

// ── Main Pengaturan Page ──
export default function PengaturanContent() {
  const { data: docs } = useQuery<Doc[]>({ queryKey: ["pengaturan-docs-all"], queryFn: () => fetch("/api/pengaturan/docs").then((r) => r.json()) });
  const { data: changelog } = useQuery<ChangelogEntry[]>({ queryKey: ["pengaturan-changelog-all"], queryFn: () => fetch("/api/pengaturan/changelog").then((r) => r.json()) });
  const { data: layanan } = useQuery<Layanan[]>({ queryKey: ["pengaturan-layanan-all"], queryFn: () => fetch("/api/pengaturan/layanan").then((r) => r.json()) });
  const { data: tahapan } = useQuery<Tahapan[]>({ queryKey: ["pengaturan-tahapan-all"], queryFn: () => fetch("/api/pengaturan/tahapan").then((r) => r.json()) });

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6  w-full">
        <PageShell
          title="Pengaturan"
          breadcrumbItems={[{ label: "Pengaturan" }]}
          subtitle="Kelola seluruh pengaturan dinamis SITARA dari satu tempat."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Docs */}
          <CrudSection<Doc>
            title="Dokumentasi" icon={BookOpen} queryKey="pengaturan-docs-all" apiUrl="/api/pengaturan/docs" items={docs}
            renderCard={(item, onDelete) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800 truncate">{item.sectionTitle}</p>
                  <p className="text-xs text-slate-400">{item.items.length} items · Urutan {item.sortOrder}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant={item.isActive ? "default" : "secondary"} className="text-[10px] sm:text-xs">{item.isActive ? "Aktif" : "Nonaktif"}</Badge>
                  <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-3 w-3" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={onDelete}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </div>
            )}
            renderForm={DocsForm}
          />

          {/* Changelog */}
          <CrudSection<ChangelogEntry>
            title="Changelog" icon={GitBranch} queryKey="pengaturan-changelog-all" apiUrl="/api/pengaturan/changelog" items={changelog}
            renderCard={(item, onDelete) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">{item.version}</p>
                  <p className="text-xs text-slate-400">{item.date} · {item.items.length} items</p>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant={item.isPublished ? "default" : "secondary"} className="text-[10px] sm:text-xs">{item.isPublished ? "Published" : "Draft"}</Badge>
                  <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-3 w-3" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={onDelete}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </div>
            )}
            renderForm={ChangelogForm}
          />

          {/* Layanan */}
          <CrudSection<Layanan>
            title="Layanan Reintegrasi" icon={Layers} queryKey="pengaturan-layanan-all" apiUrl="/api/pengaturan/layanan" items={layanan}
            renderCard={(item, onDelete) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                    <p className="text-sm font-semibold text-slate-800">{item.code} — {item.label}</p>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{item.desc}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-3 w-3" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={onDelete}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </div>
            )}
            renderForm={LayananForm}
          />

          {/* Tahapan */}
          <CrudSection<Tahapan>
            title="Tahapan Proses" icon={ListOrdered} queryKey="pengaturan-tahapan-all" apiUrl="/api/pengaturan/tahapan" items={tahapan}
            renderCard={(item, onDelete) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">{item.num}. {item.title}</p>
                  <p className="text-xs text-slate-400">{item.sub}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-3 w-3" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={onDelete}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </div>
            )}
            renderForm={TahapanForm}
          />
        </div>

        {/* Quick Links */}
        <Card className="rounded-2xl border-slate-200/70 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-teal-600" />
              <CardTitle className="text-base">Konfigurasi Situs</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500 mb-3">Konfigurasi situs (hero, footer, helpdesk) dikelola secara statis di codebase untuk performa maksimal.</p>
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg">
              <Settings2 className="h-3 w-3" /> Dikelola di <code className="font-mono text-teal-600">src/lib/static/</code>
            </span>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
