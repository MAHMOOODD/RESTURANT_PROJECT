import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#120f17]/90 group-[.toaster]:text-foreground group-[.toaster]:border-[rgba(255,255,255,0.12)] group-[.toaster]:shadow-xl group-[.toaster]:shadow-[#ff2a4b]/10 group-[.toaster]:backdrop-blur-xl group-[.toaster]:rounded-2xl group-[.toaster]:p-4",
          description: "group-[.toast]:text-muted-foreground text-xs font-medium",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-bold rounded-xl px-3 py-1.5 text-xs shadow-md shadow-primary/20",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground font-semibold rounded-xl px-3 py-1.5 text-xs",
          success:
            "group-[.toast]:border-emerald-500/30 group-[.toast]:text-emerald-400",
          error:
            "group-[.toast]:border-rose-500/30 group-[.toast]:text-rose-400",
          info:
            "group-[.toast]:border-blue-500/30 group-[.toast]:text-blue-400",
          warning:
            "group-[.toast]:border-amber-500/30 group-[.toast]:text-amber-400",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };