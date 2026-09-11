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
  "if",
  "should",
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/₦/g, " ")
    .split(/[^a-z0-9+#]+/i)
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && !STOP.has(t));
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Robust token-based FAQ retrieval.
 * Matches keywords and document tokens using strict word boundaries and token sets,
 * completely preventing substring false positives (e.g. 'inside' triggering 'id', 'repair' triggering 'pair').
 */
export function retrieveFaqs(query: string, faqs: FaqEntry[], k = 4) {
  const qTokens = tokenize(query);
  const qTokenSet = new Set(qTokens);

  if (!qTokens.length) return [];

  const scored = faqs
    .map((faq) => {
      // Document text tokens (title, question, answer)
      const docTokens = tokenize(
        `${faq.title} ${faq.question} ${faq.answer}`,
      );
      const docTokenSet = new Set(docTokens);

      // 1. Direct word-token overlap between query and document text
      let tokenOverlap = 0;
      for (const t of qTokenSet) {
        if (docTokenSet.has(t)) {
          tokenOverlap += 1.0;
        }
      }

      // 2. Strict keyword matching:
      // - Single word keyword: MUST be an exact token in qTokenSet
      // - Multi-word keyword phrase: MUST match with strict word boundaries (\b...\b)
      let keywordScore = 0;
      for (const rawKw of faq.keywords) {
        const kw = rawKw.trim().toLowerCase();
        if (!kw) continue;

        if (!kw.includes(" ")) {
          // Single word keyword: exact token match only - prevents 'inside' matching 'id' or 'repair' matching 'pair'
          if (qTokenSet.has(kw)) {
            keywordScore += 1.5;
          }
        } else {
          // Multi-word phrase: match using regex word boundary
          const phraseRegex = new RegExp(`\\b${escapeRegex(kw)}\\b`, "i");
          if (phraseRegex.test(query)) {
            keywordScore += 2.5;
          }
        }
      }

      // 3. Title token boost
      const titleTokens = tokenize(faq.title);
      let titleBoost = 0;
      for (const t of titleTokens) {
        if (qTokenSet.has(t)) {
          titleBoost += 1.0;
        }
      }

      const totalScore = tokenOverlap + keywordScore + titleBoost;
      return { faq, score: totalScore };
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

