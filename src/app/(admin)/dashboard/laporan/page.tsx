export const metadata = {"title":"Laporan"};

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const LaporanContent = dynamic(() => import("@/components/laporan/LaporanContent"), {
  loading: () => (
    <div className="space-y-4 p-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  ),
});

export default function Page() {
  return <LaporanContent />;
}
