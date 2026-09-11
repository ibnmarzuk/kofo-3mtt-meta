import { _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-nav-USTXb7iD.js
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid(prefix = "id") {
	return `${prefix}-${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(36)}`;
}
function formatClock(ts) {
	return new Intl.DateTimeFormat("en-NG", {
		hour: "numeric",
		minute: "2-digit"
	}).format(ts);
}
function formatDay(ts) {
	return new Intl.DateTimeFormat("en-NG", {
		weekday: "short",
		day: "numeric",
		month: "short"
	}).format(ts);
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[transform,background-color,color,opacity] duration-150 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest", {
	variants: {
		variant: {
			primary: "bg-forest text-paper-3 hover:bg-forest-2",
			ink: "bg-ink text-paper-3 hover:bg-ink-soft",
			outline: "bg-transparent text-ink shadow-[0_0_0_1px_rgba(26,24,20,0.18)] hover:bg-chip",
			ghost: "bg-transparent text-ink-soft hover:bg-chip hover:text-ink",
			clay: "bg-clay text-paper-3 hover:opacity-90"
		},
		size: {
			md: "h-11 rounded-md px-4 text-sm",
			sm: "h-9 rounded-sm px-3 text-sm",
			lg: "h-12 rounded-lg px-5 text-base",
			icon: "size-11 rounded-md"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function KofaMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: cn("fill-current", className),
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "5",
				y: "5",
				width: "3.2",
				height: "22"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "23.8",
				y: "5",
				width: "3.2",
				height: "22"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "5",
				y: "5",
				width: "22",
				height: "3.2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "14.4",
				y: "14",
				width: "3.2",
				height: "13"
			})
		]
	});
}
function KofaWordmark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-2", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KofaMark, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-display text-[1.15rem] font-medium tracking-tight",
			children: "Kofa"
		})]
	});
}
var links = [
	{
		to: "/",
		label: "The gate"
	},
	{
		to: "/line",
		label: "The line"
	},
	{
		to: "/desk",
		label: "The desk"
	}
];
function SiteNav({ tone = "paper" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: cn("sticky top-0 z-30 flex items-center justify-between gap-4 px-4 py-3 sm:px-6", tone === "forest" ? "bg-forest text-paper-3" : "bg-paper/90 text-ink backdrop-blur-md"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			className: "min-h-11 inline-flex items-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KofaWordmark, { className: tone === "forest" ? "text-paper-3 [&_svg]:text-paper-3" : void 0 })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			className: "flex items-center gap-1 text-sm",
			children: links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: l.to,
				className: cn("inline-flex h-11 items-center px-3", tone === "forest" ? "text-paper-3/80 hover:text-paper-3" : "text-ink-soft hover:text-ink"),
				activeProps: { className: tone === "forest" ? "text-paper-3 underline decoration-paper-3/40 underline-offset-8" : "text-ink underline decoration-forest/50 underline-offset-8" },
				children: l.label
			}, l.to))
		})]
	});
}
//#endregion
export { formatClock as a, cn as i, KofaMark as n, formatDay as o, SiteNav as r, uid as s, Button as t };
