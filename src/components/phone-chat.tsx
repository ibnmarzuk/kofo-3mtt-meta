import { useEffect, useRef, useState } from "react";
import {
  ImagePlus,
  Send,
  LoaderCircle,
  Paperclip,
  X,
  Bot,
  UserCheck,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
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

  const [mode, setMode] = useState<"auto" | "handoff">("auto");
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

    // If user selected "Request Human Handoff" mode, route directly to owner
    if (mode === "handoff") {
      appendReply({
        customerText: `Your inquiry has been routed directly to ${SHOP.owner} at the owner desk. Because this involves a sensitive or custom inquiry, he will inspect the details and close this conversation with you.`,
        decision: "handoff",
        flags: ["user_requested_handoff", "sensitive_query"],
        faqIds: [],
        ownerReason: `Customer requested direct human handoff for sensitive inquiry: "${trimmed.slice(0, 80)}"`,
        localGuard: "Manual mode: Customer toggled 'Request Human Handoff'",
      });
      toast.success("Human handoff request acknowledged", {
        description: `${SHOP.owner} has been notified on the owner desk for sensitive review.`,
      });
      setBusy(false);
      return;
    }

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

      if (reply.decision === "handoff") {
        toast.info("Human handoff request acknowledged", {
          description: `Passed to ${SHOP.owner} at the desk.`,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not send.";
      setError(msg);
      toast.error("Failed to send message", { description: msg });
    } finally {
      setBusy(false);
    }
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    try {
      const p = await fileToDataUrl(file);
      setPhoto(p);
      toast.success("Image attached successfully", { description: p.label });
    } catch {
      setError("Could not read that photo.");
      toast.error("Could not read image file.");
    }
  }

  function attachDemoReceipt() {
    setPhoto({ dataUrl: demoReceiptDataUrl(), label: "demo-receipt.jpg" });
    setDraft("This is my receipt. Can you start the warranty checklist?");
    toast.success("Sample receipt attached", {
      description: "Warranty checklist prompt pre-filled.",
    });
  }

  const handed = live?.status === "handed";

  return (
    <div className="mx-auto flex w-full max-w-[420px] flex-col animate-enter-scale-up">
      <div className="rounded-[2rem] bg-ink p-2 shadow-[var(--shadow-border)] transition-shadow duration-300">
        <div className="flex h-[min(760px,calc(100dvh-8rem))] flex-col overflow-hidden rounded-[1.55rem] bg-[#ece5d8]">
          <div className="flex items-center gap-3 bg-forest px-4 py-3 text-paper-3 transition-colors duration-200">
            <div className="flex size-10 items-center justify-center rounded-full bg-forest-2 transition-transform duration-200 hover:scale-105">
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
              onClick={() => {
                newLive();
                toast.info("New chat session started");
              }}
              className="h-11 px-2 text-[11px] uppercase tracking-[0.14em] text-paper-3/70 transition-colors duration-150 hover:text-paper-3"
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
                onPick={(t, label) => {
                  setDraft(t);
                  toast.info("Demo question loaded", { description: label });
                }}
                onReceipt={attachDemoReceipt}
              />
            )}
            {messages.map((m) => (
              <Bubble key={m.id} message={m} />
            ))}
            {busy && <TypingIndicator />}
            {handed && !busy && (
              <p className="rounded-md bg-ink/90 px-3 py-2 text-center text-xs text-paper-3 animate-enter-fade-up">
                Passed to {SHOP.owner}. He will close this from the desk.
              </p>
            )}
          </div>

          <div className="border-t border-line bg-paper-3 px-2.5 py-2 transition-colors duration-200">
            {/* Mode Toggle between Auto-response and Request Human Handoff with Status Dot */}
            <div className="mb-2 flex items-center gap-1.5">
              <div className="flex flex-1 items-center justify-between rounded-lg bg-chip/70 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode("auto");
                    toast.info("Switched to Auto-response mode");
                  }}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-all duration-200",
                    mode === "auto"
                      ? "bg-forest text-paper-3 shadow-xs"
                      : "text-muted hover:text-ink",
                  )}
                >
                  <Bot className="size-3.5" />
                  <span>Auto-response mode</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("handoff");
                    toast.info("Switched to Human Handoff mode", {
                      description: "Next message will notify Tunde directly.",
                    });
                  }}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-all duration-200",
                    mode === "handoff"
                      ? "bg-clay text-paper-3 shadow-xs"
                      : "text-muted hover:text-ink",
                  )}
                >
                  <UserCheck className="size-3.5" />
                  <span>Request Human Handoff</span>
                </button>
              </div>

              {/* Status indicator dot that pulses when actively processing */}
              <div
                className={cn(
                  "relative flex size-8 shrink-0 items-center justify-center rounded-lg border transition-all duration-300",
                  busy
                    ? "border-forest/40 bg-forest/15"
                    : "border-transparent bg-chip/70",
                )}
                title={
                  busy
                    ? "Bot is actively processing a request…"
                    : "Bot is idle and ready"
                }
                aria-label={
                  busy ? "Bot is actively processing a request" : "Bot is ready"
                }
              >
                <span className="relative flex size-2.5 items-center justify-center">
                  {busy && (
                    <span className="absolute size-4 animate-ping rounded-full bg-forest/80" />
                  )}
                  <span
                    className={cn(
                      "relative size-2.5 rounded-full transition-all duration-300",
                      busy
                        ? "bg-forest animate-pulse shadow-[0_0_8px_rgba(62,74,56,0.9)]"
                        : "bg-muted/40",
                    )}
                  />
                </span>
              </div>
            </div>

            {mode === "handoff" && (
              <div className="mb-2 flex items-center gap-2 rounded-md border border-clay/30 bg-clay/10 px-2.5 py-1.5 text-xs text-clay animate-enter-fade-in">
                <ShieldAlert className="size-4 shrink-0" />
                <p className="leading-tight">
                  <strong>Sensitive Request:</strong> Notifies {SHOP.owner} at the desk to negotiate pricing, terms, or review custom requests.
                </p>
              </div>
            )}

            {error && <p className="px-2 pb-1 text-xs text-clay animate-enter-fade-in">{error}</p>}
            {photo && (
              <div className="mb-2 flex items-center gap-2 rounded-sm bg-chip px-2 py-1.5 text-xs animate-enter-fade-in">
                <Paperclip className="size-3.5 text-muted" />
                <span className="min-w-0 flex-1 truncate">{photo.label}</span>
                <button
                  type="button"
                  className="inline-flex size-8 items-center justify-center transition-colors hover:text-clay"
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
                className="inline-flex size-11 items-center justify-center text-ink-soft transition-colors duration-150 hover:text-ink"
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
                placeholder={
                  mode === "handoff"
                    ? `Message ${SHOP.owner} directly for sensitive request…`
                    : "Message the first line…"
                }
                className={cn(
                  "max-h-28 min-h-11 flex-1 resize-none rounded-md bg-transparent px-2.5 py-2.5 text-[15px] leading-snug text-ink placeholder:text-muted focus:outline-none transition-colors duration-200",
                  mode === "handoff" && "placeholder:text-clay/60 bg-clay/5",
                )}
              />
              <Button
                type="submit"
                size="icon"
                disabled={busy || (!draft.trim() && !photo)}
                aria-label="Send"
                className={cn(
                  "transition-all duration-200 active:scale-95",
                  mode === "handoff" && "bg-clay hover:bg-clay/90 text-paper-3",
                )}
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
  onPick: (t: string, label: string) => void;
  onReceipt: () => void;
}) {
  return (
    <div className="space-y-3 px-1 pt-2 animate-enter-fade-in">
      <p className="font-display text-lg leading-snug text-ink">
        This is the shop’s first line. Try a real WhatsApp question — including
        one it should refuse.
      </p>
      <div className="flex flex-col gap-2">
        {DEMO_CHIPS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onPick(c.text, c.label)}
            className="rounded-lg bg-paper-3 px-3 py-3 text-left shadow-[var(--shadow-border)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
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
          className="rounded-lg border border-dashed border-line px-3 py-3 text-left text-sm text-ink-soft transition-all duration-150 hover:bg-paper-3/60 hover:-translate-y-0.5"
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
    <div
      className={cn(
        "flex animate-enter-fade-up transition-all duration-200",
        mine ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-lg px-3 py-2 text-[15px] leading-snug transition-all duration-200",
          mine && "rounded-br-xs bg-forest text-paper-3 shadow-xs",
          message.role === "kofa" &&
            "rounded-bl-xs bg-paper-3 text-ink shadow-[var(--shadow-border)]",
          owner && "rounded-bl-xs bg-ink text-paper-3 shadow-xs",
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

function TypingIndicator() {
  return (
    <div className="flex justify-start animate-enter-fade-up">
      <div className="flex items-center gap-2.5 rounded-lg rounded-bl-xs bg-paper-3 px-3.5 py-2.5 text-[14px] leading-snug text-ink shadow-[var(--shadow-border)]">
        <div className="flex items-center gap-1 py-0.5">
          <span className="size-1.5 rounded-full bg-forest typing-dot-1" />
          <span className="size-1.5 rounded-full bg-forest typing-dot-2" />
          <span className="size-1.5 rounded-full bg-forest typing-dot-3" />
        </div>
        <span className="text-xs text-muted">typing…</span>
      </div>
    </div>
  );
}


