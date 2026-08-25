import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";

interface SidebarCustomLinkProps {
  link: { label: string; href: string; icon: React.ReactNode };
  className?: string;
  active?: boolean;
  onClick?: () => void;
}

export const SidebarCustomLink = ({
  link,
  className,
  active,
  onClick,
}: SidebarCustomLinkProps) => {
  const { open, animate } = useSidebar();
  return (
    <Link
      to={link.href}
      onClick={onClick}
      title={!open ? link.label : undefined}
      className={cn(
        "flex items-center justify-start gap-3 group/sidebar py-2.5 px-3 rounded-2xl transition-all duration-150 font-medium text-xs sm:text-sm",
        active
          ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        className,
      )}
    >
      <div className="shrink-0 flex items-center justify-center">
        {link.icon}
      </div>
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="truncate whitespace-pre group-hover/sidebar:translate-x-1 rtl:group-hover/sidebar:-translate-x-1 transition duration-150"
      >
        {String(link.label)}
      </motion.span>
    </Link>
  );
};
