"use client";

import { PageShell } from "@/components/layout/PageShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CHANGELOG_DATA } from "@/lib/static";

export default function ChangelogContent() {
  const entries = CHANGELOG_DATA.filter((c) => c.isPublished);

  return (
    <>
      <div className="space-y-5 w-full">
        <PageShell title="Changelog" breadcrumbItems={[{ label: "Changelog" }]} subtitle="Riwayat perubahan SITARA." />
        <div className="space-y-5">
          {entries.map((entry) => (
            <Card key={entry.id} className="rounded-2xl border-slate-200/70 shadow-sm">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Badge className="bg-teal-50 text-teal-700 border-teal-100 hover:bg-teal-50">{entry.version}</Badge>
                  <span className="text-xs text-slate-400">{entry.date}</span>
                </div>
                <ul className="space-y-1.5 text-sm text-slate-600 list-disc pl-5">
                  {entry.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
