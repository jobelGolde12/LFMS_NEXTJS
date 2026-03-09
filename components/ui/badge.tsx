import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        {
          "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200":
            variant === "default",
          "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400":
            variant === "success",
          "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400":
            variant === "warning",
          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400":
            variant === "danger",
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400":
            variant === "info",
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
