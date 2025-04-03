import { type ReactNode } from "react";
import { cn } from "~/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function BgWrapper({ children, className }: Props) {
  return (
    <div className={cn("bg-white transition-all rounded-lg shadow-xs border border-secondary/60", className)}>
      {children}
    </div>
  );
}
