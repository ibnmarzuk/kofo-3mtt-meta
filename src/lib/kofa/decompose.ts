/**
 * Question & Intent Decomposition for Kofa.
 * Splits incoming customer messages into distinct question/intent clauses
 * without breaking compound verbs or phrases like "bring my phone and pay later".
 */

export function decomposeIntents(message: string): string[] {
  const clean = message.trim();
  if (!clean) return [];

  // Split by sentence delimiters: question marks, newlines, semicolons
  const majorChunks = clean
    .split(/[\n;?]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const intents: string[] = [];

  // Transition regex: catches coordinating conjunctions and transition words
  // ONLY when followed by interrogatives or clause subjects:
  // e.g., " and how much", ", where", " and can you", " also what", ", do I"
  // Does NOT split compound verbs like "and pay later" or "and dry" unless preceded by a modal/question starter.
  const transitionRegex =
    /(?:,\s*and\s+|\s+and\s+also\s+|\s+and\s+|,\s*also\s+|\s+also\s+|,\s*what\s+about\s+|\s+what\s+about\s+|,\s*)(?=(?:where|what|when|how|why|who|can(?:\s+(?:i|you|we))?|could(?:\s+(?:i|you|we))?|will(?:\s+(?:it|you))?|would(?:\s+(?:it|you))?|do(?:\s+(?:i|you|we))?|does(?:\s+(?:it|the))?|did|is(?:\s+(?:there|this|it))?|are(?:\s+(?:you|there))?|should(?:\s+i)?|must|may)\b)/gi;

  for (const chunk of majorChunks) {
    const parts = chunk.split(transitionRegex).map((s) => s.trim());
    for (const part of parts) {
      // Strip leading/trailing commas, dots, or spaces
      const stripped = part.replace(/^[,.\s]+|[,.\s]+$/g, "");
      if (stripped.length > 2) {
        intents.push(stripped);
      }
    }
  }

  // Fallback: if splitting produced nothing, return the trimmed message
  return intents.length > 0 ? intents : [clean];
}
