import { PageBreadcrumb, type BreadcrumbEntry } from "@/components/layout/PageBreadcrumb";
import { ReactNode } from "react";

export function PageShell({
  title,
  children,
  breadcrumbItems,
  titleClassName = "text-xl sm:text-2xl",
  subtitle,
}: {
  title: string;
  children?: ReactNode;
  breadcrumbItems: BreadcrumbEntry[];
  titleClassName?: string;
  subtitle?: ReactNode;
}) {
  return (
    <div className="w-full space-y-4">
      {/* Breadcrumb bar */}
      <div className="bg-white border-b border-slate-100 -mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 px-4 sm:px-6 lg:px-8 py-2.5 mb-6">
        <PageBreadcrumb items={breadcrumbItems} />
      </div>

      {/* Title + actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className={`font-black text-slate-900 tracking-tight ${titleClassName}`}>{title}</h1>
          {subtitle ? <div className="mt-1 text-slate-500 text-sm sm:text-base">{subtitle}</div> : null}
        </div>
        {children ? <div className="flex items-center gap-2 flex-shrink-0">{children}</div> : null}
      </div>
    </div>
  );
}
