import { PublicLayout } from "@/components/layout/PublicLayout";
import { PageTransitionProvider } from "@/components/motion/PageTransition";

export default function PublicRouteGroup({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicLayout>
      <PageTransitionProvider>{children}</PageTransitionProvider>
    </PublicLayout>
  );
}
