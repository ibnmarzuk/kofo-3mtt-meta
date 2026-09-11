import { i as __toESM } from "../_runtime.mjs";
import { n as SHOP } from "./shop-Mqx5AVU9.mjs";
import { t as SYSTEM_PROMPT } from "./prompt-Bn1fp3Ai.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as Route$1 } from "./router-6q_a06u6.mjs";
import { a as formatClock, i as cn, o as formatDay, r as SiteNav, s as uid, t as Button } from "./site-nav-USTXb7iD.mjs";
import { n as useHydrateKofa, r as useKofa, t as DecisionBadge } from "./hydrate-kofa-D2W3bBsh.mjs";
import { i as WORD_COUNT, n as PROBLEM_ONE_LINER, r as STATEMENT, t as CAPSTONE_TITLE } from "./statement-D34Fl6l2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/desk-BVxgLweB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function lineStats(conversations) {
	let answered = 0;
	let refused = 0;
	let handed = 0;
	for (const c of conversations) for (const m of c.messages) {
		if (m.role !== "kofa" || !m.decision) continue;
		if (m.decision === "answer") answered += 1;
		if (m.decision === "refuse") refused += 1;
		if (m.decision === "handoff") handed += 1;
	}
	const turns = answered + refused + handed;
	const firstLine = answered;
	const loadDrop = turns ? Math.round(firstLine / turns * 100) : 0;
	return {
		answered,
		refused,
		handed,
		turns,
		firstLine,
		loadDrop
	};
}
var TABS = [
	{
		id: "inbox",
		label: "Inbox"
	},
	{
		id: "faqs",
		label: "Owned FAQ"
	},
	{
		id: "guard",
		label: "Prompt + guard"
	},
	{
		id: "evidence",
		label: "Evidence"
	}
];
function DeskPanel({ tab }) {
	const conversations = useKofa((s) => s.conversations);
	const stats = (0, import_react.useMemo)(() => lineStats(conversations), [conversations]);
	const resetDemo = useKofa((s) => s.resetDemo);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 border-b border-line py-6 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[11px] font-medium uppercase tracking-[0.16em] text-muted",
					children: ["Owner desk · ", SHOP.name]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-1 font-display text-3xl font-medium tracking-tight sm:text-4xl",
					children: [SHOP.owner, " still closes the door"]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							n: stats.answered,
							l: "FAQ handled"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							n: stats.refused,
							l: "Refused"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							n: stats.handed,
							l: "Handed over"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							n: `${stats.loadDrop}%`,
							l: "First-line share"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1 overflow-x-auto py-4",
				children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/desk",
					search: { tab: t.id },
					className: cn("inline-flex h-11 shrink-0 items-center rounded-full px-4 text-sm", tab === t.id ? "bg-ink text-paper-3" : "text-ink-soft hover:bg-chip"),
					children: t.label
				}, t.id))
			}),
			tab === "inbox" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, {}),
			tab === "faqs" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaqEditor, {}),
			tab === "guard" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuardView, {}),
			tab === "evidence" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Evidence, { stats }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => resetDemo(),
					children: "Reset demo data"
				})
			})
		]
	});
}
function Stat({ n, l }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-[7rem] rounded-lg bg-paper-3 px-3 py-2 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-2xl tabular-nums leading-none",
			children: n
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-[11px] uppercase tracking-[0.12em] text-muted",
			children: l
		})]
	});
}
function Inbox() {
	const conversations = useKofa((s) => s.conversations);
	const ordered = (0, import_react.useMemo)(() => [...conversations].sort((a, b) => b.startedAt - a.startedAt), [conversations]);
	const [active, setActive] = (0, import_react.useState)(void 0);
	const current = conversations.find((c) => c.id === active) ?? ordered[0];
	const appendOwner = useKofa((s) => s.appendOwner);
	const [note, setNote] = (0, import_react.useState)("");
	if (!current) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "No conversations yet. Open the line."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y divide-line rounded-xl bg-paper-3 shadow-[var(--shadow-border)]",
			children: ordered.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setActive(c.id),
				className: cn("flex w-full flex-col items-start gap-1 px-4 py-3 text-left", current.id === c.id ? "bg-chip" : "hover:bg-paper"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex w-full items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate text-sm font-medium",
						children: c.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusDot, { status: c.status })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-muted",
					children: [
						formatDay(c.startedAt),
						" · ",
						c.source === "sample" ? "sample" : "live"
					]
				})]
			}) }, c.id))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Transcript, {
			conversation: current,
			note,
			setNote,
			onClose: () => {
				const t = note.trim();
				if (!t) return;
				appendOwner(current.id, t);
				setNote("");
			}
		})]
	});
}
function StatusDot({ status }) {
	const label = status === "handed" ? "Needs Tunde" : status === "closed" ? "Closed" : "Open";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-muted",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-1.5 rounded-full", status === "handed" ? "bg-clay" : status === "closed" ? "bg-sage" : "bg-forest") }), label]
	});
}
function Transcript({ conversation, note, setNote, onClose }) {
	const lastKofa = [...conversation.messages].reverse().find((m) => m.role === "kofa");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col rounded-xl bg-paper-3 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-line px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg",
						children: conversation.title
					}),
					lastKofa?.ownerReason && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-ink-soft",
						children: lastKofa.ownerReason
					}),
					lastKofa?.localGuard && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-mono text-[11px] leading-relaxed text-muted",
						children: lastKofa.localGuard
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-[420px] space-y-3 overflow-y-auto px-4 py-4",
				children: conversation.messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] uppercase tracking-[0.12em] text-muted",
						children: [
							m.role === "kofa" ? "Kofa" : m.role === "owner" ? SHOP.owner : "Customer",
							" ",
							"· ",
							formatClock(m.at)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-sm leading-relaxed",
						children: m.text
					}),
					m.decision && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DecisionBadge, { decision: m.decision })
					})
				] }, m.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex gap-2 border-t border-line p-3",
				onSubmit: (e) => {
					e.preventDefault();
					onClose();
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: note,
					onChange: (e) => setNote(e.target.value),
					placeholder: `Reply as ${SHOP.owner} and close`,
					className: "h-11 flex-1 rounded-md bg-paper px-3 text-sm focus:outline-2 focus:outline-forest"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					variant: "ink",
					disabled: !note.trim(),
					children: "Close it"
				})]
			})
		]
	});
}
function FaqEditor() {
	const faqs = useKofa((s) => s.faqs);
	const upsertFaq = useKofa((s) => s.upsertFaq);
	const removeFaq = useKofa((s) => s.removeFaq);
	const restoreFaqs = useKofa((s) => s.restoreFaqs);
	const [editing, setEditing] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [faqs.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setEditing(f),
				className: "w-full rounded-xl bg-paper-3 px-4 py-3 text-left shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] uppercase tracking-[0.12em] text-muted",
						children: [
							f.topic,
							" · ",
							f.id
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: f.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 line-clamp-2 text-sm text-ink-soft",
						children: f.answer
					})
				]
			}, f.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setEditing({
						id: uid("faq"),
						topic: "process",
						title: "",
						question: "",
						answer: "",
						keywords: []
					}),
					children: "Add FAQ"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => restoreFaqs(),
					children: "Restore seed"
				})]
			})]
		}), editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaqForm, {
			value: editing,
			onChange: setEditing,
			onSave: () => {
				if (!editing.title.trim() || !editing.answer.trim()) return;
				upsertFaq({
					...editing,
					id: editing.id || uid("faq"),
					keywords: editing.keywords.length ? editing.keywords : editing.title.toLowerCase().split(/\s+/)
				});
				setEditing(null);
			},
			onDelete: () => {
				removeFaq(editing.id);
				setEditing(null);
			}
		})]
	});
}
function FaqForm({ value, onChange, onSave, onDelete }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-3 rounded-xl bg-paper-3 p-4 shadow-[var(--shadow-border)]",
		onSubmit: (e) => {
			e.preventDefault();
			onSave();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-lg",
				children: "Edit owned FAQ"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-xs uppercase tracking-[0.12em] text-muted",
				children: ["Title", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "mt-1 h-11 w-full rounded-md bg-paper px-3 text-sm text-ink",
					value: value.title,
					onChange: (e) => onChange({
						...value,
						title: e.target.value
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-xs uppercase tracking-[0.12em] text-muted",
				children: ["Topic", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					className: "mt-1 h-11 w-full rounded-md bg-paper px-3 text-sm text-ink",
					value: value.topic,
					onChange: (e) => onChange({
						...value,
						topic: e.target.value
					}),
					children: [
						"hours",
						"location",
						"pricing",
						"booking",
						"documents",
						"warranty",
						"process"
					].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: t }, t))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-xs uppercase tracking-[0.12em] text-muted",
				children: ["Customer question", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "mt-1 h-11 w-full rounded-md bg-paper px-3 text-sm text-ink",
					value: value.question,
					onChange: (e) => onChange({
						...value,
						question: e.target.value
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-xs uppercase tracking-[0.12em] text-muted",
				children: ["Answer Tunde actually stands behind", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: "mt-1 min-h-28 w-full rounded-md bg-paper px-3 py-2 text-sm text-ink",
					value: value.answer,
					onChange: (e) => onChange({
						...value,
						answer: e.target.value
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-xs uppercase tracking-[0.12em] text-muted",
				children: ["Keywords (comma)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "mt-1 h-11 w-full rounded-md bg-paper px-3 text-sm text-ink",
					value: value.keywords.join(", "),
					onChange: (e) => onChange({
						...value,
						keywords: e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Save"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					onClick: onDelete,
					children: "Remove"
				})]
			})
		]
	});
}
function GuardView() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-xl bg-paper-3 p-5 shadow-[var(--shadow-border)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium uppercase tracking-[0.16em] text-muted",
					children: "Evidence 1 · the prompt"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-2xl",
					children: "What the model is allowed to be"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "mt-4 max-h-[480px] overflow-auto whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-ink-soft",
					children: SYSTEM_PROMPT
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-xl bg-ink p-5 text-paper-3 shadow-[var(--shadow-border)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium uppercase tracking-[0.16em] text-paper-3/60",
					children: "Llama Guard-style local layer"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-2xl",
					children: "What never waits on the model"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 space-y-3 text-sm leading-relaxed text-paper-3/85",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Criminal / ownership-bypass (stolen, no receipt + unlock, spy, hack) — hard refuse, no improvisation." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Medical or legal — refuse. This is a phone clinic, not a chambers." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Deadline, “ready by 2pm”, pay-after, haggling below the published range — handoff." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Identity of a device — handoff. Kofa does not decide if a phone is stolen." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Lookup is a defined tool over the owned FAQ. No free-form web copy. No “the model already knows our books.”" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Endpoint can be swapped to Llama. The bound stays." })
					]
				})
			]
		})]
	});
}
function Evidence({ stats }) {
	const refused = useKofa((s) => s.conversations).filter((c) => c.messages.some((m) => m.decision === "refuse"));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "grid gap-3 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EvidenceCard, {
					k: "1",
					title: "Prompt + guardrail",
					body: "The exact system prompt and the local Llama Guard-style layer live on the Guard tab. They are the product, not a slide.",
					to: "/desk",
					search: { tab: "guard" }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EvidenceCard, {
					k: "2",
					title: "A case it was not allowed to answer",
					body: refused[0] ? `“${refused[0].title}” — the first line refused and told Tunde.` : "Send the unlock-without-papers chip on the line. It must refuse.",
					to: "/line"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EvidenceCard, {
					k: "3",
					title: "First-line load",
					body: `${stats.answered} FAQ turns handled of ${stats.turns} scored turns (${stats.loadDrop}%). Tunde still closes ${stats.handed} handoffs and ${stats.refused} refuses.`
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-xl bg-paper-3 p-5 shadow-[var(--shadow-border)] sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[11px] font-medium uppercase tracking-[0.16em] text-muted",
					children: [
						"300 words · ",
						WORD_COUNT,
						" counted"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-2xl sm:text-3xl",
					children: CAPSTONE_TITLE
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-ink-soft",
					children: PROBLEM_ONE_LINER
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 space-y-4 text-[15px] leading-relaxed text-ink-soft",
					children: STATEMENT.split("\n\n").map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p }, p.slice(0, 24)))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-xs text-muted",
					children: "Fellow FE/23/45768260 · SULEIMAN Abdurrahman Bature · 3MTT × Meta AI Skills Development. Showcase with name."
				})
			]
		})]
	});
}
function EvidenceCard({ k, title, body, to, search }) {
	const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-xs text-muted",
			children: k
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "mt-2 font-display text-xl",
			children: title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm leading-relaxed text-ink-soft",
			children: body
		})
	] });
	if (to) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to,
		search,
		className: "block rounded-xl bg-paper-3 p-5 shadow-[var(--shadow-border)]",
		children: inner
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-xl bg-paper-3 p-5 shadow-[var(--shadow-border)]",
		children: inner
	});
}
function DeskPage() {
	const hydrated = useHydrateKofa();
	const { tab } = Route$1.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteNav, {}), hydrated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskPanel, { tab }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-6xl px-4 py-16 text-muted",
			children: "Opening the desk…"
		})]
	});
}
//#endregion
export { DeskPage as component };
