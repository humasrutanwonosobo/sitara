import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10 will-change-opacity transform-gpu", className)}
      style={{ transform: "translateZ(0)" }}
      {...props}
    />
  )
}

export { Skeleton }
