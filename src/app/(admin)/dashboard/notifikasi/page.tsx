export const metadata = {"title":"Notifikasi"};

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const NotifikasiContent = dynamic(() => import("@/components/notifikasi/NotifikasiContent"), {
  loading: () => (
    <div className="space-y-4 p-6">
      <Skeleton className="h-8 w-64" />
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
});

export default function Page() {
  return <NotifikasiContent />;
}
