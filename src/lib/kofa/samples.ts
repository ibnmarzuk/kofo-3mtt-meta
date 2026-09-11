import { uid } from "../utils";
import type { Conversation } from "./types";

const t0 = Date.parse("2026-09-08T10:14:00+01:00");

export function sampleConversations(): Conversation[] {
  return [
    {
      id: "sample-hours",
      title: "Saturday hours — FAQ handled",
      startedAt: t0,
      status: "closed",
      source: "sample",
      messages: [
        {
          id: uid("m"),
          role: "customer",
          text: "Una dey open Saturday? I wan drop my phone.",
          at: t0,
        },
        {
          id: uid("m"),
          role: "kofa",
          text: "Yes — Saturday we open 9:00am to 7:00pm. Last drop-off 6:30pm. Closed Sunday. Shop 14, Taiwo Road, Ilorin.",
          at: t0 + 4000,
          decision: "answer",
          faqIds: ["hours", "location"],
          flags: [],
          ownerReason: "Hours + location are in the owned FAQ.",
          localGuard: "No local-guard pattern hit. Retrieval + model decide.",
        },
      ],
    },
    {
      id: "sample-refuse",
      title: "Unlock without papers — refused",
      startedAt: t0 + 3600_000,
      status: "closed",
      source: "sample",
      messages: [
        {
          id: uid("m"),
          role: "customer",
          text: "I found this phone, no receipt. Unlock am and keep it quiet. No questions.",
          at: t0 + 3600_000,
        },
        {
          id: uid("m"),
          role: "kofa",
          text: "I can't help with that. We only unlock a phone with proof of ownership — ID and receipt. I've flagged this for Tunde. He will not bypass a lock on a phone without papers.",
          at: t0 + 3600_000 + 3000,
          decision: "refuse",
          faqIds: ["unlock"],
          flags: ["criminal"],
          ownerReason: "Ownership-bypass. Hard refuse. Not a first-line FAQ.",
          localGuard:
            "Criminal / ownership-bypass pattern — hard refuse, no model improvisation.",
        },
      ],
    },
    {
      id: "sample-handoff",
      title: "₦2,000 by 2pm — handed to Tunde",
      startedAt: t0 + 7200_000,
      status: "handed",
      source: "sample",
      messages: [
        {
          id: uid("m"),
          role: "customer",
          text: "Finish the iPhone 11 screen by 2pm today for ₦2,000. I go pay after.",
          at: t0 + 7200_000,
        },
        {
          id: uid("m"),
          role: "kofa",
          text: "Screen replacement for an iPhone 11 sits in our published range of ₦8,000–₦25,000 — exact figure after we see the phone. I can't take ₦2,000, a 2pm finish, or payment-after. Flagged Tunde; he'll close this at the counter.",
          at: t0 + 7200_000 + 5000,
          decision: "handoff",
          faqIds: ["screen", "booking"],
          flags: ["pricing", "commitment"],
          ownerReason:
            "Haggling below range + a deadline + pay-after. Human must close.",
          localGuard:
            "Time or completion commitment — human must close. Negotiation or a figure below the published range — human must close.",
        },
      ],
    },
  ];
}
