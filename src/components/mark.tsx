import { cn } from "@/lib/utils";

export function KofaMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("fill-current", className)}
      aria-hidden="true"
    >
      <rect x="5" y="5" width="3.2" height="22" />
      <rect x="23.8" y="5" width="3.2" height="22" />
      <rect x="5" y="5" width="22" height="3.2" />
      <rect x="14.4" y="14" width="3.2" height="13" />
    </svg>
  );
}

export function KofaWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <KofaMark className="size-5" />
      <span className="font-display text-[1.15rem] font-medium tracking-tight">
        Kofa
      </span>
    </span>
  );
}
