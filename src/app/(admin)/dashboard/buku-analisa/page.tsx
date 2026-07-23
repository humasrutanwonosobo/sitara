export const metadata = {"title":"Buku Analisa"};

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const BukuAnalisaContent = dynamic(() => import("@/components/buku-analisa/BukuAnalisaContent"), {
  loading: () => (
    <div className="space-y-4 p-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  ),
});

export default function Page() {
  return <BukuAnalisaContent />;
}
