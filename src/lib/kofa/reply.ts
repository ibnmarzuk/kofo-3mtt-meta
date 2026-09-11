import { createServerFn } from "@tanstack/react-start";
import { localReply, mergeModel } from "./compose";
import { SEED_FAQS } from "./faqs";
import { runGuards } from "./guards";
import { SYSTEM_PROMPT, buildUserPayload } from "./prompt";
import { formatRetrieved, retrieveFaqs } from "./retrieve";
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
    const guard = runGuards(data.text);
    const local = localReply(data.text, faqs, data.photoLabel);
    const hits = retrieveFaqs(data.text, faqs);
    const retrieved = formatRetrieved(hits);

    if (guard.hardRefuse) {
      return local;
    }

    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return local;

    const userText = buildUserPayload({
      text: data.text,
      photoLabel: data.photoLabel,
      retrieved,
      history: data.history,
      faqs,
    });

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
          Authorization: `Bearer ${apiKey}`,
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
  });
