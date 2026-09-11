import { createFileRoute } from "@tanstack/react-router";
import { DeskPanel, type DeskTab } from "@/components/desk-panel";
import { SiteNav } from "@/components/site-nav";
import { useHydrateKofa } from "@/components/hydrate-kofa";

const TABS: DeskTab[] = ["inbox", "faqs", "guard", "evidence"];

export const Route = createFileRoute("/desk")({
  validateSearch: (s: Record<string, unknown>): { tab: DeskTab } => ({
    tab: TABS.includes(s.tab as DeskTab) ? (s.tab as DeskTab) : "inbox",
  }),
  component: DeskPage,
});

function DeskPage() {
  const hydrated = useHydrateKofa();
  const { tab } = Route.useSearch();

  return (
    <div className="min-h-dvh">
      <SiteNav />
      {hydrated ? (
        <DeskPanel tab={tab} />
      ) : (
        <div className="mx-auto max-w-6xl px-4 py-16 text-muted">Opening the desk…</div>
      )}
    </div>
  );
}
