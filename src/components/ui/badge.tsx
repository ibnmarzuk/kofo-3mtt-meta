import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Decision } from "@/lib/kofa/types";

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.12em] text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function DecisionBadge({ decision }: { decision: Decision }) {
  const map = {
    answer: "bg-sage/15 text-forest",
    refuse: "bg-clay/15 text-clay",
    handoff: "bg-ink/10 text-ink-soft",
  } as const;
  const label = {
    answer: "Answered from FAQ",
    refuse: "Refused",
    handoff: "Flagged for Tunde",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em]",
        map[decision],
      )}
    >
      {label[decision]}
    </span>
  );
}
