import { createServerFn } from "@tanstack/react-start";
import { localReply, mergeModel } from "./compose";
import { decomposeIntents } from "./decompose";
import { SEED_FAQS } from "./faqs";
import { runGuards } from "./guards";
import { SYSTEM_PROMPT, buildUserPayload } from "./prompt";
import { formatRetrieved, retrieveFaqs, type FaqHit } from "./retrieve";
import type { Decision, FaqEntry, Flag, LineReply } from "./types";

export type SendLineInput = {
  text: string;
  photoLabel?: string;
  photoDataUrl?: string;
  history: { role: string; text: string }[];
  faqs: FaqEntry[];
};

function extractJson(text: string): {
  decision?: Decision;
  faq_ids?: string[];
  customer_text?: string;
  owner_reason?: string;
  flags?: Flag[];
} {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i);
  const raw = fenced?.[1] ?? text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("no json");
  return JSON.parse(raw.slice(start, end + 1)) as {
    decision?: Decision;
    faq_ids?: string[];
    customer_text?: string;
    owner_reason?: string;
    flags?: Flag[];
  };
}

export const sendLine = createServerFn({ method: "POST" })
  .validator((input: SendLineInput) => {
    const text = (input.text ?? "").trim().slice(0, 2000);
    if (!text && !input.photoDataUrl) {
      throw new Error("Empty message");
    }
    return {
      text: text || "(photo only)",
      photoLabel: input.photoLabel?.slice(0, 120),
      photoDataUrl:
        input.photoDataUrl && input.photoDataUrl.length < 280_000
          ? input.photoDataUrl
          : undefined,
      history: (input.history ?? []).slice(-8).map((m) => ({
        role: m.role,
        text: String(m.text ?? "").slice(0, 800),
      })),
      faqs: Array.isArray(input.faqs) && input.faqs.length ? input.faqs : SEED_FAQS,
    } satisfies SendLineInput;
  })
  .handler(async ({ data }): Promise<LineReply> => {
    const faqs = data.faqs;
    // Step 1: Run security, ownership, and payment/commitment guards first
    const guard = runGuards(data.text);
    const local = localReply(data.text, faqs, data.photoLabel);

    // Immediate security refusal or strict ownership/commitment handoff requires no LLM call
    if (guard.hardRefuse || (guard.forceHandoff && !guard.flags.includes("pricing"))) {
      return local;
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    const xaiApiKey = process.env.XAI_API_KEY;
    if (!geminiApiKey && !xaiApiKey) return local;

    // Step 2: Format retrieved FAQs across all decomposed intents for model completion
    const intents = decomposeIntents(data.text);
    const hitMap = new Map<string, FaqHit>();
    for (const it of intents) {
      for (const h of retrieveFaqs(it, faqs)) {
        const prev = hitMap.get(h.faq.id);
        if (!prev || h.score > prev.score) {
          hitMap.set(h.faq.id, h);
        }
      }
    }
    const hits = Array.from(hitMap.values()).sort((a, b) => b.score - a.score);
    const retrieved = formatRetrieved(hits);

    const userText = buildUserPayload({
      text: data.text,
      photoLabel: data.photoLabel,
      retrieved,
      history: data.history,
      faqs,
    });

    if (geminiApiKey) {
      try {
        const parts: Array<Record<string, unknown>> = [{ text: userText }];
        if (data.photoDataUrl) {
          const match = data.photoDataUrl.match(/^data:([^;]+);base64,(.+)$/);
          if (match) {
            parts.push({
              inline_data: {
                mime_type: match[1],
                data: match[2],
              },
            });
          }
        }

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              system_instruction: {
                parts: [{ text: SYSTEM_PROMPT }],
              },
              contents: [{ role: "user", parts }],
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 500,
                responseMimeType: "application/json",
              },
            }),
          },
        );

        if (res.ok) {
          const body = (await res.json()) as {
            candidates?: Array<{
              content?: { parts?: Array<{ text?: string }> };
            }>;
          };
          const content = body.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
          if (content) {
            const parsed = extractJson(content);
            return mergeModel(local, guard, parsed);
          }
        }
      } catch {
        // Fall back to local if Gemini call fails
      }
    }

    if (xaiApiKey) {
      type ContentPart =
        | { type: "text"; text: string }
        | { type: "image_url"; image_url: { url: string } };

      const userContent: string | ContentPart[] = data.photoDataUrl
        ? [
            { type: "text", text: userText },
            { type: "image_url", image_url: { url: data.photoDataUrl } },
          ]
        : userText;

      try {
        const res = await fetch("https://api.x.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${xaiApiKey}`,
          },
          body: JSON.stringify({
            model: "grok-4.5",
            temperature: 0.2,
            max_tokens: 420,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: userContent },
            ],
          }),
        });
        if (!res.ok) return local;
        const body = (await res.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        const content = body.choices?.[0]?.message?.content ?? "";
        const parsed = extractJson(content);
        return mergeModel(local, guard, parsed);
      } catch {
        return local;
      }
    }

    return local;
  });
