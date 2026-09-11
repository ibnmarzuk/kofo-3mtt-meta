import { HANDOFF_COPY, REFUSE_COPY, runGuards, type GuardHit } from "./guards";
import { retrieveFaqs } from "./retrieve";
import type { Decision, FaqEntry, Flag, LineReply } from "./types";

export function localReply(
  text: string,
  faqs: FaqEntry[],
  photoLabel?: string,
): LineReply {
  const guard = runGuards(text);
  const hits = retrieveFaqs(text, faqs);
  const faqIds = hits.map((h) => h.faq.id);
  const flags: Flag[] = [...guard.flags];
  if (photoLabel) flags.push("photo");

  if (guard.hardRefuse) {
    return {
      decision: "refuse",
      customerText: REFUSE_COPY,
      ownerReason: guard.localGuard,
      flags: unique(flags),
      faqIds,
      localGuard: guard.localGuard,
      modelUsed: false,
    };
  }

  if (guard.forceHandoff) {
    const rangeHit = hits.find((h) => h.faq.topic === "pricing");
    const range = rangeHit
      ? `${rangeHit.faq.answer.split(".")[0]}. `
      : "";
    return {
      decision: "handoff",
      customerText: `${range}${HANDOFF_COPY}`,
      ownerReason: guard.localGuard,
      flags: unique(flags),
      faqIds,
      localGuard: guard.localGuard,
      modelUsed: false,
    };
  }

  if (hits.length && hits[0].score >= 1.5) {
    const top = hits[0].faq;
    return {
      decision: "answer",
      customerText: top.answer,
      ownerReason: `Matched owned FAQ “${top.title}”.`,
      flags: unique(flags),
      faqIds,
      localGuard: guard.localGuard,
      modelUsed: false,
    };
  }

  return {
    decision: "refuse",
    customerText:
      "That's not in what Tunde published for me — hours, location, price ranges, booking, and what to bring. I've flagged him so he can take it.",
    ownerReason: "No confident FAQ hit. Refuse rather than invent.",
    flags: unique([...flags, "out_of_scope"]),
    faqIds,
    localGuard: guard.localGuard,
    modelUsed: false,
  };
}

export function mergeModel(
  local: LineReply,
  guard: GuardHit,
  parsed: {
    decision?: Decision;
    faq_ids?: string[];
    customer_text?: string;
    owner_reason?: string;
    flags?: Flag[];
  },
): LineReply {
  let decision = parsed.decision ?? local.decision;
  if (guard.hardRefuse) decision = "refuse";
  else if (guard.forceHandoff && decision === "answer") decision = "handoff";

  const text = (parsed.customer_text ?? "").trim();
  return {
    decision,
    customerText: text || local.customerText,
    ownerReason: parsed.owner_reason?.trim() || local.ownerReason,
    flags: unique([...(parsed.flags ?? []), ...guard.flags, ...local.flags]),
    faqIds: parsed.faq_ids?.length ? parsed.faq_ids : local.faqIds,
    localGuard: guard.localGuard,
    modelUsed: true,
  };
}

function unique<T>(xs: T[]) {
  return [...new Set(xs)];
}
