//#region node_modules/.nitro/vite/services/ssr/assets/statement-D34Fl6l2.js
var CAPSTONE_TITLE = "Kofa — a bounded first-line WhatsApp assistant for Nigerian service shops";
var PROBLEM_ONE_LINER = "Small Nigerian service businesses still answer the same customer questions by hand on WhatsApp. Kofa cuts that first-line load without handing the customer an unsupervised model.";
var STATEMENT = `The problem. Small Nigerian service businesses — and the 3MTT fellows who build for them — still spend evenings repeating the same WhatsApp answers: hours, price ranges, how to book, what to bring. The Blueprint courses show GenAI can draft and retrieve. They also show the failure mode: unguarded output, invented figures, and the fantasy of replacing the team. The problem is not “we need an AI company.” It is: reduce repeated first-line replies without handing the customer an unsupervised model.

What I built. Kofa is a bounded prototype of a WhatsApp-facing assistant for a real shop shape — Tunde Phone Clinic, Taiwo Road, Ilorin. It answers only a short, owner-owned FAQ (hours, location, published naira ranges, next-step booking, document checklist). Lookup is a defined tool, not free-form web copy. A Llama Guard-style layer refuses criminal, medical, legal, and out-of-scope asks, and flags pricing, identity, and time commitments for a human. A photo is accepted only when it is a receipt or a product shot. The owner desk shows the prompt, the refusal cases, and whether first-line load dropped. The endpoint can be swapped to Llama; the bound does not depend on a new foundation model.

What I would not trust it with. I would not trust Kofa to quote a final price, confirm a deadline, decide if a phone is stolen, diagnose water damage, take payment, or speak for Tunde after the FAQ ends. I would not scrape private customer chats to train it. I would not let it run overnight without a human on the handoff queue. Pass mark is responsible use on real conversations in this window, not a viral product.

Module that helped most. Prompting, tool use, and the Llama Guard / responsible-use lessons — they forced the product to be a gate, not a replacement.`;
var WORD_COUNT = STATEMENT.trim().split(/\s+/).length;
//#endregion
export { WORD_COUNT as i, PROBLEM_ONE_LINER as n, STATEMENT as r, CAPSTONE_TITLE as t };
