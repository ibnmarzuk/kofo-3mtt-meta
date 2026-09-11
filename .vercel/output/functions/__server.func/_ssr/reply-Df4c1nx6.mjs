import { n as buildUserPayload, t as SYSTEM_PROMPT } from "./prompt-Bn1fp3Ai.mjs";
import { t as SEED_FAQS } from "./faqs-CHzRhsQS.mjs";
import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reply-Df4c1nx6.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var CRIMINAL = [
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
	/unlock.*no receipt/i
];
var MEDICAL_LEGAL = [/\b(sue|lawyer|court|police report|affidavit)\b/i, /\b(diagnos|prescription|medical)\b/i];
var COMMITMENT = [
	/\bby \d{1,2}\s*(am|pm)?\b/i,
	/\btoday\b.*\b(finish|ready|collect|done)\b/i,
	/\b(finish|ready|collect).*\btoday\b/i,
	/\bsame day\b/i,
	/\b2pm\b/i,
	/\bdeadline\b/i,
	/\bmust (be|dey) ready\b/i
];
var IDENTITY = [
	/\bis this (stolen|my|his|her)\b/i,
	/\bprove (it'?s|ownership|na my)\b/i,
	/\bwho (owns|own)\b/i,
	/\bimei (check|trace|track)\b/i
];
var HAGGLE = [
	/\b(last price|reduce|too much|discount|make i pay|pay after|credit|installment)\b/i,
	/₦?\s*2,?000\b/,
	/\b2k\b/i,
	/\bfor ₦?\s*\d{3,5}\b/i
];
var OUT_OF_SCOPE = [
	/\b(assignment|homework|write my|essay)\b/i,
	/\b(bitcoin|crypto|loan|betting|sporty)\b/i,
	/\b(other shop|your competitor|slot|jumia)\b/i,
	/\breplace (the )?(owner|tunde|staff|team)\b/i,
	/\bhandle all my customers\b/i
];
function firstMatch(patterns, text) {
	return patterns.find((p) => p.test(text));
}
function runGuards(text) {
	const flags = [];
	const notes = [];
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
	const hardRefuse = flags.includes("criminal") || flags.includes("medical_legal") || flags.includes("out_of_scope") && !flags.includes("pricing");
	const forceHandoff = !hardRefuse && (flags.includes("commitment") || flags.includes("identity") || flags.includes("pricing"));
	return {
		flags: unique$1(flags),
		localGuard: notes.join(" ") || "No local-guard pattern hit. Retrieval + model decide.",
		hardRefuse,
		forceHandoff
	};
}
function unique$1(xs) {
	return [...new Set(xs)];
}
var REFUSE_COPY = "I can't help with that. Tunde only published answers for hours, location, price ranges, booking, and what to bring. I've flagged this for him — he closes anything that looks like ownership, a deadline, or a private deal.";
var HANDOFF_COPY = "That's past what I'm allowed to answer. I've flagged Tunde. He'll close price, timing, and ownership himself — I only carry the published ranges and the next-step booking.";
var STOP = /* @__PURE__ */ new Set([
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
	"na"
]);
function tokenize(text) {
	return text.toLowerCase().replace(/₦/g, " ").split(/[^a-z0-9+#]+/i).map((t) => t.trim()).filter((t) => t.length > 1 && !STOP.has(t));
}
function retrieveFaqs(query, faqs, k = 4) {
	const qTokens = tokenize(query);
	return faqs.map((faq) => {
		const hay = tokenize(`${faq.title} ${faq.question} ${faq.answer} ${faq.keywords.join(" ")}`);
		const haySet = new Set(hay);
		let overlap = 0;
		for (const t of qTokens) if (haySet.has(t)) overlap += 1;
		else if (faq.keywords.some((kw) => kw.includes(t) || t.includes(kw))) overlap += .6;
		const phraseBoost = faq.keywords.some((kw) => query.toLowerCase().includes(kw.toLowerCase())) ? 1.5 : 0;
		return {
			faq,
			score: overlap + phraseBoost
		};
	}).filter((s) => s.score > 0).sort((a, b) => b.score - a.score).slice(0, k);
}
function formatRetrieved(hits) {
	if (!hits.length) return "No FAQ lookup hits.";
	return hits.map((h) => `[${h.faq.id} · ${h.faq.title} · score ${h.score.toFixed(1)}]\nQ: ${h.faq.question}\nA: ${h.faq.answer}`).join("\n\n");
}
function localReply(text, faqs, photoLabel) {
	const guard = runGuards(text);
	const hits = retrieveFaqs(text, faqs);
	const faqIds = hits.map((h) => h.faq.id);
	const flags = [...guard.flags];
	if (photoLabel) flags.push("photo");
	if (guard.hardRefuse) return {
		decision: "refuse",
		customerText: REFUSE_COPY,
		ownerReason: guard.localGuard,
		flags: unique(flags),
		faqIds,
		localGuard: guard.localGuard,
		modelUsed: false
	};
	if (guard.forceHandoff) {
		const rangeHit = hits.find((h) => h.faq.topic === "pricing");
		return {
			decision: "handoff",
			customerText: `${rangeHit ? `${rangeHit.faq.answer.split(".")[0]}. ` : ""}${HANDOFF_COPY}`,
			ownerReason: guard.localGuard,
			flags: unique(flags),
			faqIds,
			localGuard: guard.localGuard,
			modelUsed: false
		};
	}
	if (hits.length && hits[0].score >= 1.5) {
		const top = hits[0].faq;
		return {
			decision: "answer",
			customerText: top.answer,
			ownerReason: `Matched owned FAQ “${top.title}”.`,
			flags: unique(flags),
			faqIds,
			localGuard: guard.localGuard,
			modelUsed: false
		};
	}
	return {
		decision: "refuse",
		customerText: "That's not in what Tunde published for me — hours, location, price ranges, booking, and what to bring. I've flagged him so he can take it.",
		ownerReason: "No confident FAQ hit. Refuse rather than invent.",
		flags: unique([...flags, "out_of_scope"]),
		faqIds,
		localGuard: guard.localGuard,
		modelUsed: false
	};
}
function mergeModel(local, guard, parsed) {
	let decision = parsed.decision ?? local.decision;
	if (guard.hardRefuse) decision = "refuse";
	else if (guard.forceHandoff && decision === "answer") decision = "handoff";
	const text = (parsed.customer_text ?? "").trim();
	return {
		decision,
		customerText: text || local.customerText,
		ownerReason: parsed.owner_reason?.trim() || local.ownerReason,
		flags: unique([
			...parsed.flags ?? [],
			...guard.flags,
			...local.flags
		]),
		faqIds: parsed.faq_ids?.length ? parsed.faq_ids : local.faqIds,
		localGuard: guard.localGuard,
		modelUsed: true
	};
}
function unique(xs) {
	return [...new Set(xs)];
}
function extractJson(text) {
	const raw = text.match(/```json\s*([\s\S]*?)```/i)?.[1] ?? text;
	const start = raw.indexOf("{");
	const end = raw.lastIndexOf("}");
	if (start < 0 || end <= start) throw new Error("no json");
	return JSON.parse(raw.slice(start, end + 1));
}
var sendLine_createServerFn_handler = createServerRpc({
	id: "6ccbf21a744e8496945950581d31836cee69c2976e3c45b40893f81437edd7d6",
	name: "sendLine",
	filename: "src/lib/kofa/reply.ts"
}, (opts) => sendLine.__executeServer(opts));
var sendLine = createServerFn({ method: "POST" }).validator((input) => {
	const text = (input.text ?? "").trim().slice(0, 2e3);
	if (!text && !input.photoDataUrl) throw new Error("Empty message");
	return {
		text: text || "(photo only)",
		photoLabel: input.photoLabel?.slice(0, 120),
		photoDataUrl: input.photoDataUrl && input.photoDataUrl.length < 28e4 ? input.photoDataUrl : void 0,
		history: (input.history ?? []).slice(-8).map((m) => ({
			role: m.role,
			text: String(m.text ?? "").slice(0, 800)
		})),
		faqs: Array.isArray(input.faqs) && input.faqs.length ? input.faqs : SEED_FAQS
	};
}).handler(sendLine_createServerFn_handler, async ({ data }) => {
	const faqs = data.faqs;
	const guard = runGuards(data.text);
	const local = localReply(data.text, faqs, data.photoLabel);
	const retrieved = formatRetrieved(retrieveFaqs(data.text, faqs));
	if (guard.hardRefuse) return local;
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return local;
	const userText = buildUserPayload({
		text: data.text,
		photoLabel: data.photoLabel,
		retrieved,
		history: data.history,
		faqs
	});
	const userContent = data.photoDataUrl ? [{
		type: "text",
		text: userText
	}, {
		type: "image_url",
		image_url: { url: data.photoDataUrl }
	}] : userText;
	try {
		const res = await fetch("https://api.x.ai/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: "grok-4.5",
				temperature: .2,
				max_tokens: 420,
				messages: [{
					role: "system",
					content: SYSTEM_PROMPT
				}, {
					role: "user",
					content: userContent
				}]
			})
		});
		if (!res.ok) return local;
		return mergeModel(local, guard, extractJson((await res.json()).choices?.[0]?.message?.content ?? ""));
	} catch {
		return local;
	}
});
//#endregion
export { sendLine_createServerFn_handler };
