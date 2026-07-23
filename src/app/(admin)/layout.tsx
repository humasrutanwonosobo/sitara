import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageTransitionProvider } from "@/components/motion/PageTransition";

export default function AdminRouteGroup({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLayout>
      <PageTransitionProvider>{children}</PageTransitionProvider>
    </AdminLayout>
  );
}
