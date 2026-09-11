import { Link } from "@tanstack/react-router";
import { KofaWordmark } from "@/components/mark";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "The gate" },
  { to: "/line", label: "The line" },
  { to: "/desk", label: "The desk" },
] as const;

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
      <nav className="flex items-center gap-1 text-sm">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={cn(
              "inline-flex h-11 items-center px-3",
              tone === "forest"
                ? "text-paper-3/80 hover:text-paper-3"
                : "text-ink-soft hover:text-ink",
            )}
            activeProps={{
              className:
                tone === "forest"
                  ? "text-paper-3 underline decoration-paper-3/40 underline-offset-8"
                  : "text-ink underline decoration-forest/50 underline-offset-8",
            }}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
