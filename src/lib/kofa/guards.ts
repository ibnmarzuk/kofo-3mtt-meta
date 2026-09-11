import type { Flag } from "./types";

export type GuardHit = {
  flags: Flag[];
  localGuard: string;
  hardRefuse: boolean;
  forceHandoff: boolean;
};

const CRIMINAL = [
  /stolen/i,
  /i found this phone/i,
  /phone i found/i,
  /no questions/i,
  /keep it quiet/i,
  /keep am quiet/i,
  /bypass (icloud|frp|google lock)/i,
  /hack(ing)? (this|the|my girlfriend|his|her)/i,
  /spy(ing)? (on|app)/i,
  /track (her|him|my wife|girlfriend)/i,
  /clone (whatsapp|sim)/i,
  /yahoo/i,
  /no receipt.*unlock/i,
  /unlock.*no receipt/i,
];

const MEDICAL_LEGAL = [
  /\b(sue|lawyer|court|police report|affidavit)\b/i,
  /\b(diagnos|prescription|medical)\b/i,
];

const COMMITMENT = [
  /\bby \d{1,2}\s*(am|pm)?\b/i,
  /\btoday\b.*\b(finish|ready|collect|done)\b/i,
  /\b(finish|ready|collect).*\btoday\b/i,
  /\bsame day\b/i,
  /\b2pm\b/i,
  /\bdeadline\b/i,
  /\bmust (be|dey) ready\b/i,
];

const IDENTITY = [
  /\bis this (stolen|my|his|her)\b/i,
  /\bprove (it'?s|ownership|na my)\b/i,
  /\bwho (owns|own)\b/i,
  /\bimei (check|trace|track)\b/i,
];

const HAGGLE = [
  /\b(last price|reduce|too much|discount|make i pay|pay after|credit|installment)\b/i,
  /₦?\s*2,?000\b/,
  /\b2k\b/i,
  /\bfor ₦?\s*\d{3,5}\b/i,
];

const OUT_OF_SCOPE = [
  /\b(assignment|homework|write my|essay)\b/i,
  /\b(bitcoin|crypto|loan|betting|sporty)\b/i,
  /\b(other shop|your competitor|slot|jumia)\b/i,
  /\breplace (the )?(owner|tunde|staff|team)\b/i,
  /\bhandle all my customers\b/i,
];

function firstMatch(patterns: RegExp[], text: string) {
  return patterns.find((p) => p.test(text));
}

export function runGuards(text: string): GuardHit {
  const flags: Flag[] = [];
  const notes: string[] = [];

  if (firstMatch(CRIMINAL, text)) {
    flags.push("criminal");
    notes.push("Criminal / ownership-bypass pattern — hard refuse, no model improvisation.");
  }
  if (firstMatch(MEDICAL_LEGAL, text)) {
    flags.push("medical_legal");
    notes.push("Medical or legal ask — outside the shop FAQ.");
  }
  if (firstMatch(OUT_OF_SCOPE, text)) {
    flags.push("out_of_scope");
    notes.push("Outside the published FAQ set.");
  }
  if (firstMatch(COMMITMENT, text)) {
    flags.push("commitment");
    notes.push("Time or completion commitment — human must close.");
  }
  if (firstMatch(IDENTITY, text)) {
    flags.push("identity");
    notes.push("Identity / ownership question — human must close.");
  }
  if (firstMatch(HAGGLE, text)) {
    flags.push("pricing");
    notes.push("Negotiation or a figure below the published range — human must close.");
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

  return {
    flags: unique(flags),
    localGuard: notes.join(" ") || "No local-guard pattern hit. Retrieval + model decide.",
    hardRefuse,
    forceHandoff,
  };
}

function unique<T>(xs: T[]) {
  return [...new Set(xs)];
}

export const REFUSE_COPY =
  "I can't help with that. Tunde only published answers for hours, location, price ranges, booking, and what to bring. I've flagged this for him — he closes anything that looks like ownership, a deadline, or a private deal.";

export const HANDOFF_COPY =
  "That's past what I'm allowed to answer. I've flagged Tunde. He'll close price, timing, and ownership himself — I only carry the published ranges and the next-step booking.";
