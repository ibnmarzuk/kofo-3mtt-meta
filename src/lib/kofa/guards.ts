import type { Flag } from "./types";

export type GuardHit = {
  flags: Flag[];
  localGuard: string;
  hardRefuse: boolean;
  forceHandoff: boolean;
  category?: "security" | "ownership" | "payment_commitment" | "none";
};

// Stage 1: Security & Criminal Guards (Hard Refusal, never delegated to model)
const CRIMINAL_SECURITY = [
  /\bstolen\b/i,
  /\bi found this phone\b/i,
  /\bphone i found\b/i,
  /\bno questions\b/i,
  /\bkeep it quiet\b/i,
  /\bkeep am quiet\b/i,
  /\bbypass (icloud|frp|google lock)\b/i,
  /\bhack(ing)? (this|the|my girlfriend|his|her)\b/i,
  /\bspy(ing)? (on|app)\b/i,
  /\btrack (her|him|my wife|girlfriend)\b/i,
  /\bclone (whatsapp|sim)\b/i,
  /\byahoo\b/i,
  /\bno\s+receipt\b.*\bunlock\b/i,
  /\bunlock\b.*\bno\s+receipt\b/i,
  /\b(without|no)\s+(document|documents|paper|papers|receipt|receipts|box|proof|id)\b/i,
  /\bunlock\b.*\b(without|no)\s+(document|documents|paper|papers|receipt|receipts|box|proof|id)\b/i,
  /\b(without|no)\s+(document|documents|paper|papers|receipt|receipts|box|proof|id)\b.*\bunlock\b/i,
  /\bsystem instruction\b/i,
  /\bignore (your|all|previous) instruction/i,
  /\byou are now\b/i,
  /\bforget the faq\b/i,
  /\byou already checked the books\b/i,
  /\btell me what you know even if\b/i,
];

// Stage 2: Medical & Legal Guards (Hard Refusal)
const MEDICAL_LEGAL = [
  /\b(sue|lawyer|court|police report|affidavit)\b/i,
  /\b(diagnos|prescription|medical)\b/i,
];

// Stage 3: Out-of-Scope Requests (Hard Refusal)
const OUT_OF_SCOPE = [
  /\b(assignment|homework|write my|essay)\b/i,
  /\b(bitcoin|crypto|loan|betting|sporty)\b/i,
  /\b(other shop|your competitor|slot|jumia)\b/i,
  /\breplace (the )?(owner|tunde|staff|team)\b/i,
  /\bhandle all my customers\b/i,
];

// Stage 4: Device Ownership & Identity Guards (Force Handoff - Human must verify)
const OWNERSHIP_IDENTITY = [
  /\bis this (stolen|my|his|her)\b/i,
  /\bprove (it'?s|ownership|na my)\b/i,
  /\bwho (owns|own)\b/i,
  /\bimei (check|trace|track)\b/i,
  /\b(confirm|verify|check|tell me if)\b.*\b(belongs to me|my phone|his phone|her phone|owner|stolen)\b/i,
  /\b(belongs to me|is this mine|is this my phone)\b/i,
];

// Stage 5: Payment, Haggle & Commitment Guards (Force Handoff - Human must close deal)
const PAYMENT_HAGGLE = [
  /\b(last price|reduce|too much|discount|make i pay|pay after|pay later|pay small|pay half|installment|credit|balance later|half now)\b/i,
  /\b(pay half|deposit)\b/i,
  /\bexact price\b/i,
  /₦?\s*2,?000\b/,
  /\b2k\b/i,
  /\bfor ₦?\s*\d{3,5}\b/i,
];

const COMMITMENT = [
  /\bby \d{1,2}\s*(am|pm)?\b/i,
  /\btoday\b.*\b(finish|ready|collect|done|repair|fix|work on)\b/i,
  /\b(finish|ready|collect|repair|fix|work on).*\btoday\b/i,
  /\btomorrow\b.*\b(finish|ready|collect|done|repair|fix|work on)\b/i,
  /\b(finish|ready|collect|repair|fix|work on).*\btomorrow\b/i,
  /\b(guarantee|promise|assure)\b.*\b(ready|tomorrow|today|time|finish|done)\b/i,
  /\bcan you guarantee\b/i,
  /\bsame day\b/i,
  /\b2\s*pm\b/i,
  /\bdeadline\b/i,
  /\bmust (be|dey) ready\b/i,
  /\bhow (long|soon|fast|quick)\b.*\b(take|repair|fix|ready)\b/i,
];

function firstMatch(patterns: RegExp[], text: string) {
  return patterns.find((p) => p.test(text));
}

/**
 * Executes security, ownership, and payment/commitment guards.
 * Designed to execute BEFORE FAQ retrieval to establish strict boundary gates.
 */
export function runGuards(text: string): GuardHit {
  const flags: Flag[] = [];
  const notes: string[] = [];

  // Stage 1: Security & Criminal Check
  if (firstMatch(CRIMINAL_SECURITY, text)) {
    flags.push("criminal");
    notes.push("Criminal / ownership-bypass pattern — hard refuse, no model improvisation.");
  }

  // Stage 2: Medical & Legal Check
  if (firstMatch(MEDICAL_LEGAL, text)) {
    flags.push("medical_legal");
    notes.push("Medical or legal ask — outside the shop FAQ.");
  }

  // Stage 3: Out-of-Scope System Check
  if (firstMatch(OUT_OF_SCOPE, text)) {
    flags.push("out_of_scope");
    notes.push("Outside the published FAQ set.");
  }

  // Stage 4: Ownership & Identity Verification Check
  if (firstMatch(OWNERSHIP_IDENTITY, text)) {
    flags.push("identity");
    notes.push("Identity / ownership question — human must close.");
  }

  // Stage 5: Payment & Commitment Checks
  if (firstMatch(PAYMENT_HAGGLE, text)) {
    flags.push("pricing");
    notes.push("Negotiation or payment terms below published range — human must close.");
  }
  if (firstMatch(COMMITMENT, text)) {
    flags.push("commitment");
    notes.push("Time or completion commitment — human must close.");
  }

  const hardRefuse =
    flags.includes("criminal") ||
    flags.includes("medical_legal") ||
    (flags.includes("out_of_scope") && !flags.includes("pricing"));

  const forceHandoff =
    !hardRefuse &&
    (flags.includes("commitment") ||
      flags.includes("identity") ||
      flags.includes("pricing"));

  const category = hardRefuse
    ? "security"
    : flags.includes("identity")
      ? "ownership"
      : flags.includes("pricing") || flags.includes("commitment")
        ? "payment_commitment"
        : "none";

  return {
    flags: unique(flags),
    localGuard: notes.join(" ") || "No local-guard pattern hit. Retrieval + model decide.",
    hardRefuse,
    forceHandoff,
    category,
  };
}

function unique<T>(xs: T[]) {
  return [...new Set(xs)];
}

export const REFUSE_COPY =
  "I can't help with that. Tunde only published answers for hours, location, price ranges, booking, and what to bring. I've flagged this for him — he closes anything that looks like ownership, a deadline, or a private deal.";

export const HANDOFF_COPY =
  "That's past what I'm allowed to answer. I've flagged Tunde. He'll close price, timing, and ownership himself — I only carry the published ranges and the next-step booking.";

