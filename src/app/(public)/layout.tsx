import { PublicLayout } from "@/components/layout/PublicLayout";

export default function PublicRouteGroup({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicLayout>{children}</PublicLayout>;
}
