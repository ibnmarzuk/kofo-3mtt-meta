import { decomposeIntents } from "./decompose";
import { HANDOFF_COPY, REFUSE_COPY, runGuards, type GuardHit } from "./guards";
import { retrieveFaqs } from "./retrieve";
import type { Decision, FaqEntry, Flag, LineReply } from "./types";

export type IntentOutcome = {
  intent: string;
  decision: Decision;
  customerText: string;
  ownerReason: string;
  flags: Flag[];
  faqIds: string[];
  faqTopic?: string;
  faqTitle?: string;
};

/**
 * Resolves a single intent against security guards, ownership/commitment rules,
 * and the published FAQ database.
 */
export function resolveSingleIntent(intent: string, faqs: FaqEntry[]): IntentOutcome {
  const guard = runGuards(intent);

  // Stage 1/2/3: Immediate Security & Out-of-Scope Hard Refusals
  if (guard.hardRefuse) {
    return {
      intent,
      decision: "refuse",
      customerText: REFUSE_COPY,
      ownerReason: guard.localGuard,
      flags: guard.flags,
      faqIds: [],
    };
  }

  // Stage 4/5: Ownership & Identity Verification (human must close)
  if (guard.flags.includes("identity")) {
    return {
      intent,
      decision: "handoff",
      customerText:
        "For device ownership verification or IMEI checks, Tunde handles this in person with valid proof of purchase.",
      ownerReason: "Device ownership / identity check requested.",
      flags: ["identity"],
      faqIds: [],
    };
  }

  // Stage 5: Completion Deadlines / Commitments (human must close)
  if (guard.flags.includes("commitment")) {
    return {
      intent,
      decision: "handoff",
      customerText:
        "I cannot guarantee repair timing or completion deadlines on chat; Tunde must inspect the phone first and confirm directly whether it can be ready.",
      ownerReason: "Repair deadline / timing commitment requested.",
      flags: ["commitment"],
      faqIds: [],
    };
  }

  // Stage 5: Payment Negotiation / Installments (human must close)
  if (guard.flags.includes("pricing")) {
    const hits = retrieveFaqs(intent, faqs);
    const rangeHit = hits.find((h) => h.faq.topic === "pricing");
    const range = rangeHit
      ? `${rangeHit.faq.answer.split(".")[0]}. `
      : "";
    return {
      intent,
      decision: "handoff",
      customerText: `${range}Any custom discounts, installment plans, deposits, or credit terms must be agreed with Tunde in person.`,
      ownerReason: "Price negotiation / payment installment terms requested.",
      flags: ["pricing"],
      faqIds: rangeHit ? [rangeHit.faq.id] : [],
    };
  }

  // Stage 6: FAQ Retrieval using robust token-based matching
  const hits = retrieveFaqs(intent, faqs);
  if (hits.length && hits[0].score >= 1.5) {
    const top = hits[0].faq;
    return {
      intent,
      decision: "answer",
      customerText: top.answer,
      ownerReason: `Matched owned FAQ “${top.title}”.`,
      flags: [],
      faqIds: [top.id],
      faqTopic: top.topic,
      faqTitle: top.title,
    };
  }

  // Stage 7: Unsupported question (do not invent answers, hand off to owner)
  return {
    intent,
    decision: "handoff",
    customerText:
      "That specific question is not covered in our published FAQ, so I have flagged Tunde to confirm for you.",
    ownerReason: `No confident FAQ match for intent: "${intent}". Flagged to owner.`,
    flags: ["out_of_scope"],
    faqIds: [],
  };
}

/**
 * Main Kofa response composer:
 * 1. Decomposes the customer message into distinct intents.
 * 2. Processes each intent independently through guards & retrieval.
 * 3. Enforces safety priority (criminal/bypass requests refuse the whole turn).
 * 4. Combines all resolved outcomes into one concise, natural WhatsApp response without dropping questions.
 */
export function localReply(
  text: string,
  faqs: FaqEntry[],
  photoLabel?: string,
): LineReply {
  // 1. Decompose message into distinct intents/questions
  const intents = decomposeIntents(text);

  // 2. Process each intent independently
  const outcomes: IntentOutcome[] = intents.map((it) =>
    resolveSingleIntent(it, faqs),
  );

  // Validation step (Section 32: No question dropping)
  if (outcomes.length !== intents.length) {
    outcomes.push({
      intent: text,
      decision: "handoff",
      customerText: HANDOFF_COPY,
      ownerReason: "Fallback for unresolved intent.",
      flags: ["out_of_scope"],
      faqIds: [],
    });
  }

  const allFlags = unique([
    ...outcomes.flatMap((o) => o.flags),
    ...(photoLabel ? (["photo"] as Flag[]) : []),
  ]);

  // 3. Safety Priority Check (Section 28)
  // If ANY intent triggers a security, criminal, or ownership-bypass hard refusal:
  // Refuse immediately. Do NOT disclose pricing, unlock tips, or procedural bypasses.
  const securityRisk = outcomes.find(
    (o) => o.flags.includes("criminal") || o.flags.includes("medical_legal"),
  );
  if (securityRisk) {
    return {
      decision: "refuse",
      customerText: REFUSE_COPY,
      ownerReason: securityRisk.ownerReason,
      flags: allFlags,
      faqIds: [],
      localGuard: securityRisk.ownerReason,
      modelUsed: false,
    };
  }

  // Deduplicate answers by FAQ ID to avoid repetitive text if user asked same question twice
  const answers: IntentOutcome[] = [];
  const seenFaqIds = new Set<string>();
  for (const o of outcomes) {
    if (o.decision === "answer") {
      const id = o.faqIds[0];
      if (!id || !seenFaqIds.has(id)) {
        if (id) seenFaqIds.add(id);
        answers.push(o);
      }
    }
  }

  const handoffs = outcomes.filter((o) => o.decision === "handoff");
  const refusals = outcomes.filter((o) => o.decision === "refuse");
  const allFaqIds = unique(outcomes.flatMap((o) => o.faqIds));

  // Case A: All intents are fully answered by owned FAQs
  if (answers.length > 0 && handoffs.length === 0 && refusals.length === 0) {
    const combinedText = answers.map((a) => a.customerText).join("\n\n");
    return {
      decision: "answer",
      customerText: combinedText,
      ownerReason: `Answered all questions from owned FAQs: ${answers
        .map((a) => a.faqTitle)
        .join(", ")}.`,
      flags: allFlags,
      faqIds: allFaqIds,
      localGuard: "Multi-intent: all customer questions answered.",
      modelUsed: false,
    };
  }

  // Case B: Customer has answered questions AND items requiring handoff
  // (e.g. Price answered + Repair deadline handoff, or Location answered + Payment terms handoff)
  if (answers.length > 0 && handoffs.length > 0) {
    const answerText = answers.map((a) => a.customerText).join("\n\n");
    const handoffText = handoffs.map((h) => h.customerText).join(" ");
    const combined = `${answerText}\n\n${handoffText}`;
    return {
      decision: "handoff",
      customerText: combined,
      ownerReason: `Answered: ${answers
        .map((a) => a.faqTitle)
        .join(", ")}; Flagged for Tunde: ${handoffs
        .map((h) => h.ownerReason)
        .join("; ")}.`,
      flags: allFlags,
      faqIds: allFaqIds,
      localGuard: "Multi-intent: answered supported questions, handed off remaining.",
      modelUsed: false,
    };
  }

  // Case C: All intents require handoff (commitments, haggling, or unsupported questions)
  if (handoffs.length > 0) {
    const textOut = handoffs.map((h) => h.customerText).join(" ");
    return {
      decision: "handoff",
      customerText: textOut,
      ownerReason: handoffs.map((h) => h.ownerReason).join("; "),
      flags: allFlags,
      faqIds: allFaqIds,
      localGuard: "Multi-intent: all questions handed off to owner.",
      modelUsed: false,
    };
  }

  // Case D: Pure out-of-scope refusals
  return {
    decision: "refuse",
    customerText:
      "That's not in what Tunde published for me — hours, location, price ranges, booking, and what to bring. I've flagged him so he can take it.",
    ownerReason: "No confident FAQ hit for any intent. Refused rather than invent.",
    flags: unique([...allFlags, "out_of_scope"]),
    faqIds: [],
    localGuard: "Multi-intent: refused out-of-scope queries.",
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

