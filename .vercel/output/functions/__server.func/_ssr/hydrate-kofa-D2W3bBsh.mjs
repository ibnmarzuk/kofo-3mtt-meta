import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as cn, s as uid } from "./site-nav-USTXb7iD.mjs";
import { t as SEED_FAQS } from "./faqs-CHzRhsQS.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hydrate-kofa-D2W3bBsh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DecisionBadge({ decision }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em]", {
			answer: "bg-sage/15 text-forest",
			refuse: "bg-clay/15 text-clay",
			handoff: "bg-ink/10 text-ink-soft"
		}[decision]),
		children: {
			answer: "Answered from FAQ",
			refuse: "Refused",
			handoff: "Flagged for Tunde"
		}[decision]
	});
}
var t0 = Date.parse("2026-09-08T10:14:00+01:00");
function sampleConversations() {
	return [
		{
			id: "sample-hours",
			title: "Saturday hours — FAQ handled",
			startedAt: t0,
			status: "closed",
			source: "sample",
			messages: [{
				id: uid("m"),
				role: "customer",
				text: "Una dey open Saturday? I wan drop my phone.",
				at: t0
			}, {
				id: uid("m"),
				role: "kofa",
				text: "Yes — Saturday we open 9:00am to 7:00pm. Last drop-off 6:30pm. Closed Sunday. Shop 14, Taiwo Road, Ilorin.",
				at: t0 + 4e3,
				decision: "answer",
				faqIds: ["hours", "location"],
				flags: [],
				ownerReason: "Hours + location are in the owned FAQ.",
				localGuard: "No local-guard pattern hit. Retrieval + model decide."
			}]
		},
		{
			id: "sample-refuse",
			title: "Unlock without papers — refused",
			startedAt: t0 + 36e5,
			status: "closed",
			source: "sample",
			messages: [{
				id: uid("m"),
				role: "customer",
				text: "I found this phone, no receipt. Unlock am and keep it quiet. No questions.",
				at: t0 + 36e5
			}, {
				id: uid("m"),
				role: "kofa",
				text: "I can't help with that. We only unlock a phone with proof of ownership — ID and receipt. I've flagged this for Tunde. He will not bypass a lock on a phone without papers.",
				at: t0 + 36e5 + 3e3,
				decision: "refuse",
				faqIds: ["unlock"],
				flags: ["criminal"],
				ownerReason: "Ownership-bypass. Hard refuse. Not a first-line FAQ.",
				localGuard: "Criminal / ownership-bypass pattern — hard refuse, no model improvisation."
			}]
		},
		{
			id: "sample-handoff",
			title: "₦2,000 by 2pm — handed to Tunde",
			startedAt: t0 + 72e5,
			status: "handed",
			source: "sample",
			messages: [{
				id: uid("m"),
				role: "customer",
				text: "Finish the iPhone 11 screen by 2pm today for ₦2,000. I go pay after.",
				at: t0 + 72e5
			}, {
				id: uid("m"),
				role: "kofa",
				text: "Screen replacement for an iPhone 11 sits in our published range of ₦8,000–₦25,000 — exact figure after we see the phone. I can't take ₦2,000, a 2pm finish, or payment-after. Flagged Tunde; he'll close this at the counter.",
				at: t0 + 72e5 + 5e3,
				decision: "handoff",
				faqIds: ["screen", "booking"],
				flags: ["pricing", "commitment"],
				ownerReason: "Haggling below range + a deadline + pay-after. Human must close.",
				localGuard: "Time or completion commitment — human must close. Negotiation or a figure below the published range — human must close."
			}]
		}
	];
}
function blankLive() {
	return {
		id: uid("live"),
		title: "Live line",
		startedAt: Date.now(),
		messages: [],
		status: "open",
		source: "live"
	};
}
function seed() {
	const live = blankLive();
	return {
		faqs: SEED_FAQS,
		conversations: [...sampleConversations(), live],
		liveId: live.id
	};
}
var useKofa = create()(persist((set, get) => ({
	...seed(),
	hydrated: false,
	setHydrated: (v) => set({ hydrated: v }),
	resetDemo: () => set({
		...seed(),
		hydrated: true
	}),
	setFaqs: (faqs) => set({ faqs }),
	upsertFaq: (faq) => set({ faqs: get().faqs.some((f) => f.id === faq.id) ? get().faqs.map((f) => f.id === faq.id ? faq : f) : [...get().faqs, faq] }),
	removeFaq: (id) => set({ faqs: get().faqs.filter((f) => f.id !== id) }),
	restoreFaqs: () => set({ faqs: SEED_FAQS }),
	ensureLive: () => {
		const { liveId, conversations } = get();
		if (conversations.some((c) => c.id === liveId)) return liveId;
		const live = blankLive();
		set({
			conversations: [...conversations, live],
			liveId: live.id
		});
		return live.id;
	},
	newLive: () => {
		const live = blankLive();
		set({
			conversations: [...get().conversations, live],
			liveId: live.id
		});
		return live.id;
	},
	appendCustomer: (text, photoLabel) => {
		const id = get().ensureLive();
		const msg = {
			id: uid("m"),
			role: "customer",
			text,
			at: Date.now(),
			photoLabel
		};
		set({ conversations: get().conversations.map((c) => c.id === id ? {
			...c,
			title: c.messages.length === 0 ? text.slice(0, 42) || "Photo" : c.title,
			messages: [...c.messages, msg]
		} : c) });
		return id;
	},
	appendReply: (reply) => {
		const id = get().liveId;
		const msg = {
			id: uid("m"),
			role: "kofa",
			text: reply.customerText,
			at: Date.now(),
			decision: reply.decision,
			flags: reply.flags,
			faqIds: reply.faqIds,
			ownerReason: reply.ownerReason,
			localGuard: reply.localGuard
		};
		set({ conversations: get().conversations.map((c) => c.id === id ? {
			...c,
			status: reply.decision === "handoff" ? "handed" : c.status,
			messages: [...c.messages, msg]
		} : c) });
	},
	appendOwner: (conversationId, text) => {
		const msg = {
			id: uid("m"),
			role: "owner",
			text,
			at: Date.now()
		};
		set({ conversations: get().conversations.map((c) => c.id === conversationId ? {
			...c,
			status: "closed",
			messages: [...c.messages, msg]
		} : c) });
	},
	closeConversation: (id) => set({ conversations: get().conversations.map((c) => c.id === id ? {
		...c,
		status: "closed"
	} : c) })
}), {
	name: "kofa-v1",
	skipHydration: true,
	partialize: (s) => ({
		faqs: s.faqs,
		conversations: s.conversations,
		liveId: s.liveId
	})
}));
function useHydrateKofa() {
	const setHydrated = useKofa((s) => s.setHydrated);
	const hydrated = useKofa((s) => s.hydrated);
	(0, import_react.useEffect)(() => {
		Promise.resolve(useKofa.persist.rehydrate()).finally(() => setHydrated(true));
	}, [setHydrated]);
	return hydrated;
}
//#endregion
export { useHydrateKofa as n, useKofa as r, DecisionBadge as t };
