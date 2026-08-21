import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card/95 group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-2xl group-[.toaster]:backdrop-blur-xl group-[.toaster]:rounded-2xl group-[.toaster]:p-4 group-[.toaster]:font-medium group-[.toaster]:border",
          description: "group-[.toast]:text-muted-foreground text-xs",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-xl font-bold",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-xl",
          success:
            "group-[.toaster]:!border-emerald-500/30 group-[.toaster]:!text-emerald-500 dark:group-[.toaster]:!text-emerald-400 group-[.toaster]:[--success-icon:#10b981]",
          error:
            "group-[.toaster]:!border-red-500/30 group-[.toaster]:!text-red-500 dark:group-[.toaster]:!text-red-400 group-[.toaster]:[--error-icon:#ef4444]",
          warning:
            "group-[.toaster]:!border-amber-500/30 group-[.toaster]:!text-amber-500 dark:group-[.toaster]:!text-amber-400 group-[.toaster]:[--warning-icon:#f59e0b]",
          info:
            "group-[.toaster]:!border-blue-500/30 group-[.toaster]:!text-blue-500 dark:group-[.toaster]:!text-blue-400 group-[.toaster]:[--info-icon:#3b82f6]",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-5 text-emerald-500 shrink-0" />,
        info: <InfoIcon className="size-5 text-blue-500 shrink-0" />,
        warning: <TriangleAlertIcon className="size-5 text-amber-500 shrink-0" />,
        error: <OctagonXIcon className="size-5 text-red-500 shrink-0" />,
        loading: <Loader2Icon className="size-5 text-primary animate-spin shrink-0" />,
      }}
      {...props}
    />
  );
};

export { Toaster };