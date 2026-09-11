import { n as SHOP } from "./shop-Mqx5AVU9.mjs";
import { _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as KofaMark, r as SiteNav, t as Button } from "./site-nav-USTXb7iD.mjs";
import { n as PROBLEM_ONE_LINER, t as CAPSTONE_TITLE } from "./statement-D34Fl6l2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CgGYfO1Y.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteNav, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Problem, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bounds, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotTrusted, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopCard, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		] })]
	});
}
function Hero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "grain relative overflow-hidden border-b border-line",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:py-20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium uppercase tracking-[0.18em] text-muted",
					children: "3MTT × Meta · Capstone artefact"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-4 max-w-xl font-display text-[2.6rem] font-medium leading-[1.05] tracking-[-0.03em] text-ink sm:text-6xl",
					children: ["The shop’s first line.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-2 block text-forest",
						children: "A human still closes the door."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg",
					children: [PROBLEM_ONE_LINER, " Hours, ranges, booking, papers. Nothing else."]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-col gap-3 sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/line",
							children: "Open the customer line"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						size: "lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/desk",
							search: { tab: "evidence" },
							children: "Open the owner desk"
						})
					})]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GateBoard, {})]
		})
	});
}
function GateBoard() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative mx-auto w-full max-w-md",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-[1.75rem] bg-forest p-3 text-paper-3 shadow-[var(--shadow-border)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[1.35rem] bg-forest-2 px-5 py-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KofaMark, { className: "size-8 text-paper-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] uppercase tracking-[0.16em] text-paper-3/60",
							children: "Owned FAQ"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-8 font-display text-3xl leading-tight",
						children: SHOP.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-paper-3/70",
						children: [
							SHOP.street,
							", ",
							SHOP.city
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-8 space-y-3 border-t border-paper-3/15 pt-5 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Hours",
								v: "Mon–Sat 9–7 · closed Sunday"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Screen",
								v: "₦8,000–₦25,000 · after we see it"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Battery",
								v: "₦6,000–₦18,000"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Unlock",
								v: "₦3,000–₦7,000 with papers"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Booking",
								v: "Walk in, or send model + window"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Bring",
								v: "Phone, receipt, IMEI for warranty"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-8 text-xs leading-relaxed text-paper-3/60",
						children: "Kofa may read this board. Kofa may not add a line."
					})
				]
			})
		})
	});
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-baseline justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "uppercase tracking-[0.12em] text-[11px] text-paper-3/55",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "text-right text-paper-3",
			children: v
		})]
	});
}
function Problem() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-6xl px-4 py-16 sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-8 lg:grid-cols-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-medium uppercase tracking-[0.18em] text-muted lg:col-span-3",
				children: "The problem"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl font-medium tracking-tight sm:text-4xl",
					children: CAPSTONE_TITLE
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 max-w-2xl text-base leading-relaxed text-ink-soft",
					children: "Nigerian service shops still spend evenings repeating the same WhatsApp answers. The courses show GenAI can draft and retrieve. They also show the failure mode: unguarded output, invented figures, and “replace the team.” Kofa is the other shape — a gate on a short, pre-agreed FAQ, with a human on anything that looks like price, identity, or a promise."
				})]
			})]
		})
	});
}
function Bounds() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-y border-line bg-paper-2/60",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto grid max-w-6xl gap-px sm:grid-cols-3",
			children: [
				{
					n: "01",
					t: "Lookup, not browsing",
					d: "A defined tool over the owner’s FAQ. No free-form web copy. No “the model already knows our books.”"
				},
				{
					n: "02",
					t: "Refuse is a feature",
					d: "Stolen phones, no-papers unlocks, medical, legal, and anything off the board are refused — locally, before the model can be helpful."
				},
				{
					n: "03",
					t: "Tunde closes it",
					d: "Haggling, deadlines, ownership, payment terms: flagged to the desk. The first line does not take the last word."
				}
			].map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-paper px-5 py-10 sm:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs text-muted",
						children: it.n
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-4 font-display text-2xl",
						children: it.t
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-ink-soft",
						children: it.d
					})
				]
			}, it.n))
		})
	});
}
function NotTrusted() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-6xl px-4 py-16 sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-[1.5rem] bg-ink px-6 py-10 text-paper-3 sm:px-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium uppercase tracking-[0.18em] text-paper-3/50",
					children: "What we will not trust it with"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 max-w-xl font-display text-3xl font-medium sm:text-4xl",
					children: "Pass mark is responsible use, not a viral product."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-8 grid gap-3 sm:grid-cols-2",
					children: [
						"A final naira quote",
						"A 2pm pickup promise",
						"Whether a phone is stolen",
						"Liquid-damage diagnosis",
						"Taking payment on chat",
						"Speaking for Tunde after the FAQ ends",
						"Training on private customer threads",
						"Running overnight with an empty handoff queue"
					].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-start gap-3 border-t border-paper-3/10 pt-3 text-sm text-paper-3/80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1 block h-px w-6 shrink-0 bg-clay" }), item]
					}, item))
				})
			]
		})
	});
}
function ShopCard() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-6xl px-4 pb-16 sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col justify-between gap-6 rounded-[1.5rem] bg-paper-3 p-6 shadow-[var(--shadow-border)] sm:flex-row sm:items-center sm:p-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium uppercase tracking-[0.16em] text-muted",
					children: "Demo shop"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-2xl sm:text-3xl",
					children: SHOP.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 max-w-md text-sm leading-relaxed text-ink-soft",
					children: [
						"A bounded stand-in for the Ilorin shops this is built for. Play the customer on the line. Play ",
						SHOP.owner,
						" on the desk. Send the question it must refuse."
					]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/line",
						children: "Try four WhatsApp turns"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/desk",
						search: { tab: "inbox" },
						children: "Watch the handoff queue"
					})
				})]
			})]
		})
	});
}
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "border-t border-line px-4 py-8 text-sm text-muted sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Kofa · SULEIMAN Abdurrahman Bature · FE/23/45768260" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "3MTT × Meta AI Skills Development · Ilorin" })]
		})
	});
}
//#endregion
export { Home as component };
