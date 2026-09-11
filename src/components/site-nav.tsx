import { Link } from "@tanstack/react-router";
import { KofaWordmark } from "@/components/mark";
import { cn } from "@/lib/utils";

export function SiteNav({ tone = "paper" }: { tone?: "paper" | "forest" }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex items-center justify-between gap-4 px-4 py-3 sm:px-6",
        tone === "forest"
          ? "bg-forest text-paper-3"
          : "bg-paper/90 text-ink backdrop-blur-md",
      )}
    >
      <Link to="/" className="min-h-11 inline-flex items-center">
        <KofaWordmark
          className={tone === "forest" ? "text-paper-3 [&_svg]:text-paper-3" : undefined}
        />
      </Link>
      <nav className="flex items-center gap-2 text-sm">
        <Link
          id="nav-link-gate"
          to="/"
          className={cn(
            "inline-flex h-9 items-center rounded-md px-3 text-xs font-medium transition-colors",
            tone === "forest"
              ? "text-paper-3/80 hover:bg-paper-3/10 hover:text-paper-3"
              : "text-ink-soft hover:bg-chip/60 hover:text-ink",
          )}
          activeProps={{
            className:
              tone === "forest"
                ? "bg-paper-3/15 text-paper-3 font-semibold"
                : "bg-chip/80 text-ink font-semibold",
          }}
        >
          The gate
        </Link>
        <Link
          id="nav-link-line"
          to="/line"
          className={cn(
            "inline-flex h-9 items-center rounded-md px-3 text-xs font-medium transition-colors",
            tone === "forest"
              ? "text-paper-3/80 hover:bg-paper-3/10 hover:text-paper-3"
              : "text-ink-soft hover:bg-chip/60 hover:text-ink",
          )}
          activeProps={{
            className:
              tone === "forest"
                ? "bg-paper-3/15 text-paper-3 font-semibold"
                : "bg-chip/80 text-ink font-semibold",
          }}
        >
          The line
        </Link>
        <Link
          id="nav-button-desk"
          to="/desk"
          search={{ tab: "inbox" }}
          className={cn(
            "inline-flex h-9 items-center justify-center gap-1.5 rounded-md border px-3.5 text-xs font-medium transition-all active:scale-[0.98]",
            tone === "forest"
              ? "border-paper-3/30 bg-paper-3/15 text-paper-3 shadow-xs hover:border-paper-3/50 hover:bg-paper-3/25"
              : "border-line bg-paper-3 text-ink shadow-xs hover:border-forest/40 hover:bg-white",
          )}
          activeProps={{
            className:
              tone === "forest"
                ? "border-paper-3 bg-paper-3 font-semibold text-forest shadow-sm hover:bg-paper-3/90"
                : "border-forest bg-forest font-semibold text-paper-3 shadow-sm hover:bg-forest-2",
          }}
        >
          <span>The desk</span>
        </Link>
      </nav>
    </header>
  );
}
