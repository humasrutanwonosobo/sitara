export const metadata = {"title":"Data Warga Binaan"};

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const WbpListContent = dynamic(() => import("@/components/wbp/WbpListContent"), {
  loading: () => (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-12 w-full" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  ),
});

export default function Page() {
  return <WbpListContent />;
}
