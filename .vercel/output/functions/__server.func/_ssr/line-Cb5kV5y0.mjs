import { i as __toESM } from "../_runtime.mjs";
import { n as SHOP, t as DEMO_CHIPS } from "./shop-Mqx5AVU9.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as LoaderCircle, i as Paperclip, o as ImagePlus, r as Send, t as X } from "../_libs/lucide-react.mjs";
import { n as Route } from "./router-6q_a06u6.mjs";
import { a as formatClock, i as cn, n as KofaMark, r as SiteNav, t as Button } from "./site-nav-USTXb7iD.mjs";
import { t as SEED_FAQS } from "./faqs-CHzRhsQS.mjs";
import { n as useHydrateKofa, r as useKofa, t as DecisionBadge } from "./hydrate-kofa-D2W3bBsh.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/line-Cb5kV5y0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
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
}).handler(createSsrRpc("6ccbf21a744e8496945950581d31836cee69c2976e3c45b40893f81437edd7d6"));
async function fileToDataUrl(file) {
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, 720 / Math.max(bitmap.width, bitmap.height));
	const w = Math.max(1, Math.round(bitmap.width * scale));
	const h = Math.max(1, Math.round(bitmap.height * scale));
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("No canvas");
	ctx.drawImage(bitmap, 0, 0, w, h);
	bitmap.close();
	return {
		dataUrl: canvas.toDataURL("image/jpeg", .72),
		label: file.name
	};
}
function demoReceiptDataUrl() {
	const canvas = document.createElement("canvas");
	canvas.width = 640;
	canvas.height = 860;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("No canvas");
	ctx.fillStyle = "#f6f1e6";
	ctx.fillRect(0, 0, 640, 860);
	ctx.fillStyle = "#efe6d4";
	ctx.fillRect(24, 24, 592, 812);
	ctx.strokeStyle = "#c9bda8";
	ctx.lineWidth = 2;
	ctx.strokeRect(36, 36, 568, 788);
	ctx.fillStyle = "#1a1814";
	ctx.font = "600 28px Georgia, serif";
	ctx.fillText("TAIWO GADGETS", 64, 100);
	ctx.font = "16px ui-monospace, monospace";
	ctx.fillStyle = "#3a352e";
	ctx.fillText("Shop 2, Taiwo Road, Ilorin", 64, 132);
	ctx.fillText("TIN 01234567-0001", 64, 156);
	ctx.beginPath();
	ctx.moveTo(64, 180);
	ctx.lineTo(576, 180);
	ctx.strokeStyle = "#d7cfc0";
	ctx.stroke();
	const lines = [
		["Date", "12 Aug 2026"],
		["Item", "Tecno Spark 20"],
		["IMEI", "3591 4401 2280 173"],
		["Serial", "TN-ILR-88421"],
		["Amount", "NGN 148,500"],
		["Paid", "Cash"],
		["Warranty", "14 days hardware"]
	];
	ctx.font = "18px ui-monospace, monospace";
	lines.forEach((row, i) => {
		ctx.fillStyle = "#6b645a";
		ctx.fillText(row[0], 64, 230 + i * 42);
		ctx.fillStyle = "#1a1814";
		ctx.fillText(row[1], 280, 230 + i * 42);
	});
	ctx.font = "italic 16px Georgia, serif";
	ctx.fillStyle = "#6b645a";
	ctx.fillText("Keep this slip for warranty / unlock.", 64, 560);
	ctx.fillText("Not a Tunde Phone Clinic ticket.", 64, 586);
	ctx.font = "500 14px ui-monospace, monospace";
	ctx.fillText("DEMO RECEIPT — for Kofa photo test", 64, 780);
	return canvas.toDataURL("image/jpeg", .8);
}
function PhoneChat({ seed }) {
	const conversations = useKofa((s) => s.conversations);
	const liveId = useKofa((s) => s.liveId);
	const faqs = useKofa((s) => s.faqs);
	const appendCustomer = useKofa((s) => s.appendCustomer);
	const appendReply = useKofa((s) => s.appendReply);
	const newLive = useKofa((s) => s.newLive);
	const live = conversations.find((c) => c.id === liveId);
	const messages = live?.messages ?? [];
	const [draft, setDraft] = (0, import_react.useState)(seed ?? "");
	const [photo, setPhoto] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const scroller = (0, import_react.useRef)(null);
	const fileRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (seed) setDraft(seed);
	}, [seed]);
	(0, import_react.useEffect)(() => {
		const el = scroller.current;
		if (!el) return;
		el.scrollTop = el.scrollHeight;
	}, [messages.length, busy]);
	async function submit(text = draft) {
		const trimmed = text.trim();
		if (!trimmed && !photo || busy) return;
		setBusy(true);
		setError(null);
		setDraft("");
		const attached = photo;
		setPhoto(null);
		appendCustomer(trimmed || "Photo attached.", attached?.label);
		try {
			const history = [...messages.map((m) => ({
				role: m.role,
				text: m.text
			})), {
				role: "customer",
				text: trimmed
			}];
			const reply = await sendLine({ data: {
				text: trimmed,
				photoLabel: attached?.label,
				photoDataUrl: attached?.dataUrl,
				history,
				faqs
			} });
			appendReply(reply);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not send.");
		} finally {
			setBusy(false);
		}
	}
	async function onFile(file) {
		if (!file) return;
		try {
			setPhoto(await fileToDataUrl(file));
		} catch {
			setError("Could not read that photo.");
		}
	}
	function attachDemoReceipt() {
		setPhoto({
			dataUrl: demoReceiptDataUrl(),
			label: "demo-receipt.jpg"
		});
		setDraft("This is my receipt. Can you start the warranty checklist?");
	}
	const handed = live?.status === "handed";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto flex w-full max-w-[420px] flex-col",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-[2rem] bg-ink p-2 shadow-[var(--shadow-border)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-[min(760px,calc(100dvh-8rem))] flex-col overflow-hidden rounded-[1.55rem] bg-[#ece5d8]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 bg-forest px-4 py-3 text-paper-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex size-10 items-center justify-center rounded-full bg-forest-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KofaMark, { className: "size-5 text-paper-3" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-display text-base font-medium leading-tight",
									children: SHOP.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-paper-3/70",
									children: [
										"First line · ",
										SHOP.owner,
										" still closes"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => newLive(),
								className: "h-11 px-2 text-[11px] uppercase tracking-[0.14em] text-paper-3/70 hover:text-paper-3",
								children: "New"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						ref: scroller,
						className: "flex-1 space-y-3 overflow-y-auto px-3 py-4",
						children: [
							messages.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyLine, {
								onPick: (t) => setDraft(t),
								onReceipt: attachDemoReceipt
							}),
							messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bubble, { message: m }, m.id)),
							busy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 pl-1 text-xs text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }), "Checking the owned FAQ…"]
							}),
							handed && !busy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "rounded-md bg-ink/90 px-3 py-2 text-center text-xs text-paper-3",
								children: [
									"Passed to ",
									SHOP.owner,
									". He will close this from the desk."
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-line bg-paper-3 px-2 py-2",
						children: [
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-2 pb-1 text-xs text-clay",
								children: error
							}),
							photo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 flex items-center gap-2 rounded-sm bg-chip px-2 py-1.5 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "size-3.5 text-muted" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "min-w-0 flex-1 truncate",
										children: photo.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "inline-flex size-8 items-center justify-center",
										onClick: () => setPhoto(null),
										"aria-label": "Remove photo",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "flex items-end gap-1",
								onSubmit: (e) => {
									e.preventDefault();
									submit();
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										ref: fileRef,
										type: "file",
										accept: "image/*",
										className: "hidden",
										onChange: (e) => void onFile(e.target.files?.[0])
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "inline-flex size-11 items-center justify-center text-ink-soft",
										"aria-label": "Attach photo",
										onClick: () => fileRef.current?.click(),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										value: draft,
										onChange: (e) => setDraft(e.target.value),
										onKeyDown: (e) => {
											if (e.key === "Enter" && !e.shiftKey) {
												e.preventDefault();
												submit();
											}
										},
										rows: 1,
										placeholder: "Message the first line…",
										className: "max-h-28 min-h-11 flex-1 resize-none bg-transparent px-2 py-2.5 text-[15px] leading-snug text-ink placeholder:text-muted focus:outline-none"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										size: "icon",
										disabled: busy || !draft.trim() && !photo,
										"aria-label": "Send",
										children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
									})
								]
							})
						]
					})
				]
			})
		})
	});
}
function EmptyLine({ onPick, onReceipt }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3 px-1 pt-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-lg leading-snug text-ink",
			children: "This is the shop’s first line. Try a real WhatsApp question — including one it should refuse."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [DEMO_CHIPS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onPick(c.text),
				className: "rounded-lg bg-paper-3 px-3 py-3 text-left shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-[10px] font-medium uppercase tracking-[0.14em] text-muted",
					children: c.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1 block text-sm text-ink-soft",
					children: c.text
				})]
			}, c.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onReceipt,
				className: "rounded-lg border border-dashed border-line px-3 py-3 text-left text-sm text-ink-soft",
				children: "Attach a sample receipt (warranty checklist)"
			})]
		})]
	});
}
function Bubble({ message }) {
	const mine = message.role === "customer";
	const owner = message.role === "owner";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex", mine ? "justify-end" : "justify-start"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("max-w-[85%] rounded-lg px-3 py-2 text-[15px] leading-snug", mine && "rounded-br-xs bg-forest text-paper-3", message.role === "kofa" && "rounded-bl-xs bg-paper-3 text-ink shadow-[var(--shadow-border)]", owner && "rounded-bl-xs bg-ink text-paper-3"),
			children: [
				message.photoLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: cn("mb-1 text-[11px] opacity-70", mine ? "text-paper-3" : "text-muted"),
					children: ["Photo: ", message.photoLabel]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: message.text }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1.5 flex flex-wrap items-center gap-2",
					children: [message.decision && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DecisionBadge, { decision: message.decision }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: cn("text-[10px] tabular-nums", mine || owner ? "text-paper-3/60" : "text-muted"),
						children: [formatClock(message.at), owner ? " · Tunde" : ""]
					})]
				})
			]
		})
	});
}
function LinePage() {
	const hydrated = useHydrateKofa();
	const { q } = Route.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper-2/40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteNav, { tone: "forest" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "order-2 space-y-6 lg:order-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-medium uppercase tracking-[0.16em] text-muted",
							children: "Customer line"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl",
							children: "WhatsApp, bounded."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 max-w-md text-sm leading-relaxed text-ink-soft",
							children: [
								"In production this sits on ",
								SHOP.name,
								"’s number. Here you play the customer. The four chips below are the capstone tests: two FAQ turns, one refuse, one handoff."
							]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "space-y-3",
						children: DEMO_CHIPS.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-xs text-muted",
								children: ["0", i + 1]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: c.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-ink-soft",
									children: c.text
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-[11px] uppercase tracking-[0.12em] text-muted",
									children: ["Expect ", c.expect]
								})
							] })]
						}, c.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs leading-relaxed text-muted",
						children: "Photos: only a receipt or the customer’s own device. Anything else is refused. Open the desk to see Tunde’s queue."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "order-1 lg:order-2",
				children: hydrated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneChat, { seed: q }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto h-[min(760px,calc(100dvh-8rem))] max-w-[420px] rounded-[2rem] bg-ink/90" })
			})]
		})]
	});
}
//#endregion
export { LinePage as component };
