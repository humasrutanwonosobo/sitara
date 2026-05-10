import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

export interface BreadcrumbEntry {
  label: string;
  href?: string;
}

interface PageBreadcrumbProps {
  items: BreadcrumbEntry[];
}

export function PageBreadcrumb({ items }: PageBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="flex-nowrap gap-1 sm:gap-1.5">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">
              <span className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors font-medium">
                <Home className="h-3 w-3 flex-shrink-0" />
                <span className="hidden sm:inline">Dashboard</span>
              </span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <span key={`${item.label}-${index}`} className="contents">
              <BreadcrumbSeparator className="text-slate-300 [&>svg]:h-3 [&>svg]:w-3" />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-xs font-semibold text-slate-700 min-w-0 sm:min-w-44 truncate">
                    {item.label}
                  </BreadcrumbPage>
                ) : item.href ? (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>
                      <span className="text-xs text-slate-400 hover:text-slate-700 transition-colors font-medium">
                        {item.label}
                      </span>
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <span className="text-xs text-slate-400 font-medium">{item.label}</span>
                )}
              </BreadcrumbItem>
            </span>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
