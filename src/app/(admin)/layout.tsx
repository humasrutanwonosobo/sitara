import { AdminLayout } from "@/components/layout/AdminLayout";

export default function AdminRouteGroup({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
