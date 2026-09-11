import { useEffect, useRef, useState } from "react";
import { ImagePlus, Send, LoaderCircle, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DecisionBadge } from "@/components/ui/badge";
import { KofaMark } from "@/components/mark";
import { sendLine } from "@/lib/kofa/reply";
import { SHOP, DEMO_CHIPS } from "@/lib/kofa/shop";
import { useKofa } from "@/lib/kofa/store";
import { demoReceiptDataUrl, fileToDataUrl } from "@/lib/kofa/image";
import type { Message } from "@/lib/kofa/types";
import { cn, formatClock } from "@/lib/utils";

export function PhoneChat({ seed }: { seed?: string }) {
  const conversations = useKofa((s) => s.conversations);
  const liveId = useKofa((s) => s.liveId);
  const faqs = useKofa((s) => s.faqs);
  const appendCustomer = useKofa((s) => s.appendCustomer);
  const appendReply = useKofa((s) => s.appendReply);
  const newLive = useKofa((s) => s.newLive);

  const live = conversations.find((c) => c.id === liveId);
  const messages = live?.messages ?? [];

  const [draft, setDraft] = useState(seed ?? "");
  const [photo, setPhoto] = useState<{ dataUrl: string; label: string } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (seed) setDraft(seed);
  }, [seed]);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length, busy]);

  async function submit(text = draft) {
    const trimmed = text.trim();
    if ((!trimmed && !photo) || busy) return;
    setBusy(true);
    setError(null);
    setDraft("");
    const attached = photo;
    setPhoto(null);
    appendCustomer(trimmed || "Photo attached.", attached?.label);
    try {
      const history = [
        ...messages.map((m) => ({ role: m.role, text: m.text })),
        { role: "customer", text: trimmed },
      ];
      const reply = await sendLine({
        data: {
          text: trimmed,
          photoLabel: attached?.label,
          photoDataUrl: attached?.dataUrl,
          history,
          faqs,
        },
      });
      appendReply(reply);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send.");
    } finally {
      setBusy(false);
    }
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    try {
      setPhoto(await fileToDataUrl(file));
    } catch {
      setError("Could not read that photo.");
    }
  }

  function attachDemoReceipt() {
    setPhoto({ dataUrl: demoReceiptDataUrl(), label: "demo-receipt.jpg" });
    setDraft("This is my receipt. Can you start the warranty checklist?");
  }

  const handed = live?.status === "handed";

  return (
    <div className="mx-auto flex w-full max-w-[420px] flex-col">
      <div className="rounded-[2rem] bg-ink p-2 shadow-[var(--shadow-border)]">
        <div className="flex h-[min(760px,calc(100dvh-8rem))] flex-col overflow-hidden rounded-[1.55rem] bg-[#ece5d8]">
          <div className="flex items-center gap-3 bg-forest px-4 py-3 text-paper-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-forest-2">
              <KofaMark className="size-5 text-paper-3" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-base font-medium leading-tight">
                {SHOP.name}
              </p>
              <p className="text-xs text-paper-3/70">
                First line · {SHOP.owner} still closes
              </p>
            </div>
            <button
              type="button"
              onClick={() => newLive()}
              className="h-11 px-2 text-[11px] uppercase tracking-[0.14em] text-paper-3/70 hover:text-paper-3"
            >
              New
            </button>
          </div>

          <div
            ref={scroller}
            className="flex-1 space-y-3 overflow-y-auto px-3 py-4"
          >
            {messages.length === 0 && (
              <EmptyLine
                onPick={(t) => setDraft(t)}
                onReceipt={attachDemoReceipt}
              />
            )}
            {messages.map((m) => (
              <Bubble key={m.id} message={m} />
            ))}
            {busy && (
              <div className="flex items-center gap-2 pl-1 text-xs text-muted">
                <LoaderCircle className="size-3.5 animate-spin" />
                Checking the owned FAQ…
              </div>
            )}
            {handed && !busy && (
              <p className="rounded-md bg-ink/90 px-3 py-2 text-center text-xs text-paper-3">
                Passed to {SHOP.owner}. He will close this from the desk.
              </p>
            )}
          </div>

          <div className="border-t border-line bg-paper-3 px-2 py-2">
            {error && <p className="px-2 pb-1 text-xs text-clay">{error}</p>}
            {photo && (
              <div className="mb-2 flex items-center gap-2 rounded-sm bg-chip px-2 py-1.5 text-xs">
                <Paperclip className="size-3.5 text-muted" />
                <span className="min-w-0 flex-1 truncate">{photo.label}</span>
                <button
                  type="button"
                  className="inline-flex size-8 items-center justify-center"
                  onClick={() => setPhoto(null)}
                  aria-label="Remove photo"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            )}
            <form
              className="flex items-end gap-1"
              onSubmit={(e) => {
                e.preventDefault();
                void submit();
              }}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => void onFile(e.target.files?.[0])}
              />
              <button
                type="button"
                className="inline-flex size-11 items-center justify-center text-ink-soft"
                aria-label="Attach photo"
                onClick={() => fileRef.current?.click()}
              >
                <ImagePlus className="size-5" />
              </button>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void submit();
                  }
                }}
                rows={1}
                placeholder="Message the first line…"
                className="max-h-28 min-h-11 flex-1 resize-none bg-transparent px-2 py-2.5 text-[15px] leading-snug text-ink placeholder:text-muted focus:outline-none"
              />
              <Button
                type="submit"
                size="icon"
                disabled={busy || (!draft.trim() && !photo)}
                aria-label="Send"
              >
                {busy ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyLine({
  onPick,
  onReceipt,
}: {
  onPick: (t: string) => void;
  onReceipt: () => void;
}) {
  return (
    <div className="space-y-3 px-1 pt-2">
      <p className="font-display text-lg leading-snug text-ink">
        This is the shop’s first line. Try a real WhatsApp question — including
        one it should refuse.
      </p>
      <div className="flex flex-col gap-2">
        {DEMO_CHIPS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onPick(c.text)}
            className="rounded-lg bg-paper-3 px-3 py-3 text-left shadow-[var(--shadow-border)]"
          >
            <span className="block text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
              {c.label}
            </span>
            <span className="mt-1 block text-sm text-ink-soft">{c.text}</span>
          </button>
        ))}
        <button
          type="button"
          onClick={onReceipt}
          className="rounded-lg border border-dashed border-line px-3 py-3 text-left text-sm text-ink-soft"
        >
          Attach a sample receipt (warranty checklist)
        </button>
      </div>
    </div>
  );
}

function Bubble({ message }: { message: Message }) {
  const mine = message.role === "customer";
  const owner = message.role === "owner";
  return (
    <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-lg px-3 py-2 text-[15px] leading-snug",
          mine && "rounded-br-xs bg-forest text-paper-3",
          message.role === "kofa" &&
            "rounded-bl-xs bg-paper-3 text-ink shadow-[var(--shadow-border)]",
          owner && "rounded-bl-xs bg-ink text-paper-3",
        )}
      >
        {message.photoLabel && (
          <p
            className={cn(
              "mb-1 text-[11px] opacity-70",
              mine ? "text-paper-3" : "text-muted",
            )}
          >
            Photo: {message.photoLabel}
          </p>
        )}
        <p>{message.text}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          {message.decision && <DecisionBadge decision={message.decision} />}
          <span
            className={cn(
              "text-[10px] tabular-nums",
              mine || owner ? "text-paper-3/60" : "text-muted",
            )}
          >
            {formatClock(message.at)}
            {owner ? " · Tunde" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
