import type { FaqEntry } from "./types";

const STOP = new Set([
  "the",
  "a",
  "an",
  "to",
  "for",
  "and",
  "or",
  "my",
  "i",
  "you",
  "is",
  "are",
  "of",
  "in",
  "on",
  "it",
  "this",
  "that",
  "please",
  "wan",
  "want",
  "can",
  "how",
  "what",
  "when",
  "do",
  "does",
  "una",
  "dey",
  "am",
  "na",
]);

export function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/₦/g, " ")
    .split(/[^a-z0-9+#]+/i)
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && !STOP.has(t));
}

export function retrieveFaqs(query: string, faqs: FaqEntry[], k = 4) {
  const qTokens = tokenize(query);
  const scored = faqs
    .map((faq) => {
      const hay = tokenize(
        `${faq.title} ${faq.question} ${faq.answer} ${faq.keywords.join(" ")}`,
      );
      const haySet = new Set(hay);
      let overlap = 0;
      for (const t of qTokens) {
        if (haySet.has(t)) overlap += 1;
        else if (faq.keywords.some((kw) => kw.includes(t) || t.includes(kw))) overlap += 0.6;
      }
      const phraseBoost = faq.keywords.some((kw) =>
        query.toLowerCase().includes(kw.toLowerCase()),
      )
        ? 1.5
        : 0;
      return { faq, score: overlap + phraseBoost };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, k);
}

export function formatRetrieved(
  hits: { faq: FaqEntry; score: number }[],
) {
  if (!hits.length) return "No FAQ lookup hits.";
  return hits
    .map(
      (h) =>
        `[${h.faq.id} · ${h.faq.title} · score ${h.score.toFixed(1)}]\nQ: ${h.faq.question}\nA: ${h.faq.answer}`,
    )
    .join("\n\n");
}
