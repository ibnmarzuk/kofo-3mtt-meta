import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { PhoneChat } from "@/components/phone-chat";
import { useHydrateKofa } from "@/components/hydrate-kofa";
import { DEMO_CHIPS, SHOP } from "@/lib/kofa/shop";

type LineSearch = { q?: string };

export const Route = createFileRoute("/line")({
  validateSearch: (s: Record<string, unknown>): LineSearch => ({
    q: typeof s.q === "string" ? s.q : undefined,
  }),
  component: LinePage,
});

function LinePage() {
  const hydrated = useHydrateKofa();
  const { q } = Route.useSearch();

  return (
    <div className="min-h-dvh bg-paper-2/40">
      <SiteNav tone="forest" />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <aside className="order-2 space-y-6 lg:order-1">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
              Customer line
            </p>
            <h1 className="mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl">
              WhatsApp, bounded.
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
              In production this sits on {SHOP.name}’s number. Here you play the
              customer. The four chips below are the capstone tests: two FAQ
              turns, one refuse, one handoff.
            </p>
          </div>
          <ol className="space-y-3">
            {DEMO_CHIPS.map((c, i) => (
              <li key={c.id} className="flex gap-3">
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
                <div>
                  <p className="text-sm font-medium">{c.label}</p>
                  <p className="text-sm text-ink-soft">{c.text}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-muted">
                    Expect {c.expect}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="text-xs leading-relaxed text-muted">
            Photos: only a receipt or the customer’s own device. Anything else is
            refused. Open the desk to see Tunde’s queue.
          </p>
        </aside>
        <div className="order-1 lg:order-2">
          {hydrated ? (
            <PhoneChat seed={q} />
          ) : (
            <div className="mx-auto h-[min(760px,calc(100dvh-8rem))] max-w-[420px] rounded-[2rem] bg-ink/90" />
          )}
        </div>
      </div>
    </div>
  );
}
