import type { Metadata } from "next";
import { getWbpById } from "@/lib/db/queries";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const WbpEditContent = dynamic(() => import("@/components/wbp/WbpEditContent"), {
  loading: () => (
    <div className="space-y-4 p-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  ),
});

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  if (!id) return { title: "Edit Data WBP" };

  const wbp = await getWbpById(id);

  if (!wbp) return { title: "Edit Data WBP" };

  return {
    title: `Edit — ${wbp.nama}`,
  };
}

export default function Page() {
  return <WbpEditContent />;
}
