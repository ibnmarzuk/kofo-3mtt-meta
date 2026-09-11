import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { DecisionBadge } from "@/components/ui/badge";
import { SYSTEM_PROMPT } from "@/lib/kofa/prompt";
import { SHOP } from "@/lib/kofa/shop";
import { CAPSTONE_TITLE, PROBLEM_ONE_LINER, STATEMENT, WORD_COUNT } from "@/lib/kofa/statement";
import { lineStats } from "@/lib/kofa/stats";
import { useKofa } from "@/lib/kofa/store";
import type { Conversation, FaqEntry, FaqTopic } from "@/lib/kofa/types";
import { cn, formatClock, formatDay, uid } from "@/lib/utils";

const TABS = [
  { id: "inbox", label: "Inbox" },
  { id: "faqs", label: "Owned FAQ" },
  { id: "guard", label: "Prompt + guard" },
  { id: "evidence", label: "Evidence" },
] as const;

export type DeskTab = (typeof TABS)[number]["id"];

export function DeskPanel({ tab }: { tab: DeskTab }) {
  const conversations = useKofa((s) => s.conversations);
  const stats = useMemo(() => lineStats(conversations), [conversations]);
  const resetDemo = useKofa((s) => s.resetDemo);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      <div className="flex flex-col gap-4 border-b border-line py-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
            Owner desk · {SHOP.name}
          </p>
          <h1 className="mt-1 font-display text-3xl font-medium tracking-tight sm:text-4xl">
            {SHOP.owner} still closes the door
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Stat n={stats.answered} l="FAQ handled" />
          <Stat n={stats.refused} l="Refused" />
          <Stat n={stats.handed} l="Handed over" />
          <Stat n={`${stats.loadDrop}%`} l="First-line share" />
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto py-4">
        {TABS.map((t) => (
          <Link
            key={t.id}
            to="/desk"
            search={{ tab: t.id }}
            className={cn(
              "inline-flex h-11 shrink-0 items-center rounded-full px-4 text-sm",
              tab === t.id ? "bg-ink text-paper-3" : "text-ink-soft hover:bg-chip",
            )}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {tab === "inbox" && <Inbox />}
      {tab === "faqs" && <FaqEditor />}
      {tab === "guard" && <GuardView />}
      {tab === "evidence" && <Evidence stats={stats} />}

      <div className="mt-10 flex justify-end">
        <Button variant="ghost" size="sm" onClick={() => resetDemo()}>
          Reset demo data
        </Button>
      </div>
    </div>
  );
}

function Stat({ n, l }: { n: number | string; l: string }) {
  return (
    <div className="min-w-[7rem] rounded-lg bg-paper-3 px-3 py-2 shadow-[var(--shadow-border)]">
      <p className="font-display text-2xl tabular-nums leading-none">{n}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-muted">{l}</p>
    </div>
  );
}

function Inbox() {
  const conversations = useKofa((s) => s.conversations);
  const ordered = useMemo(
    () => [...conversations].sort((a, b) => b.startedAt - a.startedAt),
    [conversations],
  );
  const [active, setActive] = useState<string | undefined>(undefined);
  const current = conversations.find((c) => c.id === active) ?? ordered[0];
  const appendOwner = useKofa((s) => s.appendOwner);
  const [note, setNote] = useState("");

  if (!current) {
    return <p className="text-muted">No conversations yet. Open the line.</p>;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
      <ul className="divide-y divide-line rounded-xl bg-paper-3 shadow-[var(--shadow-border)]">
        {ordered.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => setActive(c.id)}
              className={cn(
                "flex w-full flex-col items-start gap-1 px-4 py-3 text-left",
                current.id === c.id ? "bg-chip" : "hover:bg-paper",
              )}
            >
              <span className="flex w-full items-center justify-between gap-2">
                <span className="truncate text-sm font-medium">{c.title}</span>
                <StatusDot status={c.status} />
              </span>
              <span className="text-xs text-muted">
                {formatDay(c.startedAt)} · {c.source === "sample" ? "sample" : "live"}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Transcript
        conversation={current}
        note={note}
        setNote={setNote}
        onClose={() => {
          const t = note.trim();
          if (!t) return;
          appendOwner(current.id, t);
          setNote("");
        }}
      />
    </div>
  );
}

function StatusDot({ status }: { status: Conversation["status"] }) {
  const label =
    status === "handed" ? "Needs Tunde" : status === "closed" ? "Closed" : "Open";
  const color =
    status === "handed"
      ? "bg-clay"
      : status === "closed"
        ? "bg-sage"
        : "bg-forest";
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-muted">
      <span className={cn("size-1.5 rounded-full", color)} />
      {label}
    </span>
  );
}

function Transcript({
  conversation,
  note,
  setNote,
  onClose,
}: {
  conversation: Conversation;
  note: string;
  setNote: (v: string) => void;
  onClose: () => void;
}) {
  const lastKofa = [...conversation.messages].reverse().find((m) => m.role === "kofa");
  return (
    <div className="flex flex-col rounded-xl bg-paper-3 shadow-[var(--shadow-border)]">
      <div className="border-b border-line px-4 py-3">
        <p className="font-display text-lg">{conversation.title}</p>
        {lastKofa?.ownerReason && (
          <p className="mt-1 text-sm text-ink-soft">{lastKofa.ownerReason}</p>
        )}
        {lastKofa?.localGuard && (
          <p className="mt-1 font-mono text-[11px] leading-relaxed text-muted">
            {lastKofa.localGuard}
          </p>
        )}
      </div>
      <div className="max-h-[420px] space-y-3 overflow-y-auto px-4 py-4">
        {conversation.messages.map((m) => (
          <div key={m.id}>
            <p className="text-[11px] uppercase tracking-[0.12em] text-muted">
              {m.role === "kofa" ? "Kofa" : m.role === "owner" ? SHOP.owner : "Customer"}{" "}
              · {formatClock(m.at)}
            </p>
            <p className="mt-0.5 text-sm leading-relaxed">{m.text}</p>
            {m.decision && (
              <div className="mt-1">
                <DecisionBadge decision={m.decision} />
              </div>
            )}
          </div>
        ))}
      </div>
      <form
        className="flex gap-2 border-t border-line p-3"
        onSubmit={(e) => {
          e.preventDefault();
          onClose();
        }}
      >
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={`Reply as ${SHOP.owner} and close`}
          className="h-11 flex-1 rounded-md bg-paper px-3 text-sm focus:outline-2 focus:outline-forest"
        />
        <Button type="submit" variant="ink" disabled={!note.trim()}>
          Close it
        </Button>
      </form>
    </div>
  );
}

function FaqEditor() {
  const faqs = useKofa((s) => s.faqs);
  const upsertFaq = useKofa((s) => s.upsertFaq);
  const removeFaq = useKofa((s) => s.removeFaq);
  const restoreFaqs = useKofa((s) => s.restoreFaqs);
  const [editing, setEditing] = useState<FaqEntry | null>(null);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
      <div className="space-y-2">
        {faqs.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setEditing(f)}
            className="w-full rounded-xl bg-paper-3 px-4 py-3 text-left shadow-[var(--shadow-border)]"
          >
            <p className="text-[11px] uppercase tracking-[0.12em] text-muted">
              {f.topic} · {f.id}
            </p>
            <p className="font-medium">{f.title}</p>
            <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{f.answer}</p>
          </button>
        ))}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() =>
              setEditing({
                id: uid("faq"),
                topic: "process",
                title: "",
                question: "",
                answer: "",
                keywords: [],
              })
            }
          >
            Add FAQ
          </Button>
          <Button variant="ghost" onClick={() => restoreFaqs()}>
            Restore seed
          </Button>
        </div>
      </div>
      {editing && (
        <FaqForm
          value={editing}
          onChange={setEditing}
          onSave={() => {
            if (!editing.title.trim() || !editing.answer.trim()) return;
            upsertFaq({
              ...editing,
              id: editing.id || uid("faq"),
              keywords: editing.keywords.length
                ? editing.keywords
                : editing.title.toLowerCase().split(/\s+/),
            });
            setEditing(null);
          }}
          onDelete={() => {
            removeFaq(editing.id);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function FaqForm({
  value,
  onChange,
  onSave,
  onDelete,
}: {
  value: FaqEntry;
  onChange: (v: FaqEntry) => void;
  onSave: () => void;
  onDelete: () => void;
}) {
  const topics: FaqTopic[] = [
    "hours",
    "location",
    "pricing",
    "booking",
    "documents",
    "warranty",
    "process",
  ];
  return (
    <form
      className="space-y-3 rounded-xl bg-paper-3 p-4 shadow-[var(--shadow-border)]"
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
    >
      <p className="font-display text-lg">Edit owned FAQ</p>
      <label className="block text-xs uppercase tracking-[0.12em] text-muted">
        Title
        <input
          className="mt-1 h-11 w-full rounded-md bg-paper px-3 text-sm text-ink"
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
        />
      </label>
      <label className="block text-xs uppercase tracking-[0.12em] text-muted">
        Topic
        <select
          className="mt-1 h-11 w-full rounded-md bg-paper px-3 text-sm text-ink"
          value={value.topic}
          onChange={(e) =>
            onChange({ ...value, topic: e.target.value as FaqTopic })
          }
        >
          {topics.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <label className="block text-xs uppercase tracking-[0.12em] text-muted">
        Customer question
        <input
          className="mt-1 h-11 w-full rounded-md bg-paper px-3 text-sm text-ink"
          value={value.question}
          onChange={(e) => onChange({ ...value, question: e.target.value })}
        />
      </label>
      <label className="block text-xs uppercase tracking-[0.12em] text-muted">
        Answer Tunde actually stands behind
        <textarea
          className="mt-1 min-h-28 w-full rounded-md bg-paper px-3 py-2 text-sm text-ink"
          value={value.answer}
          onChange={(e) => onChange({ ...value, answer: e.target.value })}
        />
      </label>
      <label className="block text-xs uppercase tracking-[0.12em] text-muted">
        Keywords (comma)
        <input
          className="mt-1 h-11 w-full rounded-md bg-paper px-3 text-sm text-ink"
          value={value.keywords.join(", ")}
          onChange={(e) =>
            onChange({
              ...value,
              keywords: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
            })
          }
        />
      </label>
      <div className="flex gap-2">
        <Button type="submit">Save</Button>
        <Button type="button" variant="ghost" onClick={onDelete}>
          Remove
        </Button>
      </div>
    </form>
  );
}

function GuardView() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-xl bg-paper-3 p-5 shadow-[var(--shadow-border)]">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
          Evidence 1 · the prompt
        </p>
        <h2 className="mt-1 font-display text-2xl">What the model is allowed to be</h2>
        <pre className="mt-4 max-h-[480px] overflow-auto whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-ink-soft">
          {SYSTEM_PROMPT}
        </pre>
      </section>
      <section className="rounded-xl bg-ink p-5 text-paper-3 shadow-[var(--shadow-border)]">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-paper-3/60">
          Llama Guard-style local layer
        </p>
        <h2 className="mt-1 font-display text-2xl">What never waits on the model</h2>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-paper-3/85">
          <li>Criminal / ownership-bypass (stolen, no receipt + unlock, spy, hack) — hard refuse, no improvisation.</li>
          <li>Medical or legal — refuse. This is a phone clinic, not a chambers.</li>
          <li>Deadline, “ready by 2pm”, pay-after, haggling below the published range — handoff.</li>
          <li>Identity of a device — handoff. Kofa does not decide if a phone is stolen.</li>
          <li>Lookup is a defined tool over the owned FAQ. No free-form web copy. No “the model already knows our books.”</li>
          <li>Endpoint can be swapped to Llama. The bound stays.</li>
        </ul>
      </section>
    </div>
  );
}

function Evidence({
  stats,
}: {
  stats: ReturnType<typeof lineStats>;
}) {
  const conversations = useKofa((s) => s.conversations);
  const refused = conversations.filter((c) =>
    c.messages.some((m) => m.decision === "refuse"),
  );

  return (
    <div className="space-y-6">
      <section className="grid gap-3 sm:grid-cols-3">
        <EvidenceCard
          k="1"
          title="Prompt + guardrail"
          body="The exact system prompt and the local Llama Guard-style layer live on the Guard tab. They are the product, not a slide."
          to="/desk"
          search={{ tab: "guard" }}
        />
        <EvidenceCard
          k="2"
          title="A case it was not allowed to answer"
          body={
            refused[0]
              ? `“${refused[0].title}” — the first line refused and told Tunde.`
              : "Send the unlock-without-papers chip on the line. It must refuse."
          }
          to="/line"
        />
        <EvidenceCard
          k="3"
          title="First-line load"
          body={`${stats.answered} FAQ turns handled of ${stats.turns} scored turns (${stats.loadDrop}%). Tunde still closes ${stats.handed} handoffs and ${stats.refused} refuses.`}
        />
      </section>

      <section className="rounded-xl bg-paper-3 p-5 shadow-[var(--shadow-border)] sm:p-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
          300 words · {WORD_COUNT} counted
        </p>
        <h2 className="mt-1 font-display text-2xl sm:text-3xl">{CAPSTONE_TITLE}</h2>
        <p className="mt-3 text-sm text-ink-soft">{PROBLEM_ONE_LINER}</p>
        <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink-soft">
          {STATEMENT.split("\n\n").map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted">
          Fellow FE/23/45768260 · SULEIMAN Abdurrahman Bature · 3MTT × Meta AI Skills
          Development. Showcase with name.
        </p>
      </section>
    </div>
  );
}

function EvidenceCard({
  k,
  title,
  body,
  to,
  search,
}: {
  k: string;
  title: string;
  body: string;
  to?: "/line" | "/desk";
  search?: { tab: DeskTab };
}) {
  const inner = (
    <>
      <p className="font-mono text-xs text-muted">{k}</p>
      <h3 className="mt-2 font-display text-xl">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
    </>
  );
  if (to) {
    return (
      <Link
        to={to}
        search={search}
        className="block rounded-xl bg-paper-3 p-5 shadow-[var(--shadow-border)]"
      >
        {inner}
      </Link>
    );
  }
  return <div className="rounded-xl bg-paper-3 p-5 shadow-[var(--shadow-border)]">{inner}</div>;
}
