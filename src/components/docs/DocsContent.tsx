"use client";

import { PageShell } from "@/components/layout/PageShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DOCS_DATA } from "@/lib/static";

export default function DocsContent() {
  const sections = DOCS_DATA.filter((d) => d.isActive).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      <div className="space-y-5 w-full">
        <PageShell title="Docs SITARA" breadcrumbItems={[{ label: "Docs" }]} subtitle="Dokumentasi singkat penggunaan SITARA." />
        <div className="space-y-5">
          {sections.map((section) => (
            <Card key={section.id} className="rounded-2xl border-slate-200/70 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <Badge className="bg-teal-50 text-teal-700 border-teal-100 hover:bg-teal-50">{section.sectionTitle}</Badge>
                <ul className="space-y-2 text-sm text-slate-600 list-disc pl-5">
                  {section.items.map((item, i) => (
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
