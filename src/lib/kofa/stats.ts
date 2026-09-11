import type { Conversation } from "./types";

export function lineStats(conversations: Conversation[]) {
  let answered = 0;
  let refused = 0;
  let handed = 0;
  for (const c of conversations) {
    for (const m of c.messages) {
      if (m.role !== "kofa" || !m.decision) continue;
      if (m.decision === "answer") answered += 1;
      if (m.decision === "refuse") refused += 1;
      if (m.decision === "handoff") handed += 1;
    }
  }
  const turns = answered + refused + handed;
  const firstLine = answered;
  const loadDrop = turns ? Math.round((firstLine / turns) * 100) : 0;
  return { answered, refused, handed, turns, firstLine, loadDrop };
}
