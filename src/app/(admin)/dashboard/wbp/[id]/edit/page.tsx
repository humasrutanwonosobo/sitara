import type { Metadata } from "next";
import { getWbpById } from "@/lib/db/queries";
import WbpEditContent from "@/components/wbp/WbpEditContent";

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
