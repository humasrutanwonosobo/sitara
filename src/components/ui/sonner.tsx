import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="bottom-right"
      richColors
      expand={false}
      toastOptions={{
        classNames: {
          toast: "group toast rounded-xl shadow-lg border border-slate-200/60 text-sm font-medium",
          title: "font-semibold text-slate-900",
          description: "text-slate-500 text-xs",
          actionButton: "bg-teal-600 text-white text-xs font-semibold rounded-lg",
          cancelButton: "bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg",
          success: "border-green-200/60",
          error: "border-red-200/60",
          info: "border-blue-200/60",
          warning: "border-amber-200/60",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
