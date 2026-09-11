import type { FaqEntry } from "./types";

export const SEED_FAQS: FaqEntry[] = [
  {
    id: "hours",
    topic: "hours",
    title: "Opening hours",
    question: "When are you open?",
    answer:
      "We're open Monday to Saturday, 9:00am to 7:00pm. Closed Sundays and public holidays. Last drop-off is 6:30pm so we can still log the job.",
    keywords: [
      "open",
      "hours",
      "time",
      "saturday",
      "sunday",
      "close",
      "closing",
      "dey open",
      "una dey",
      "today",
      "holiday",
    ],
  },
  {
    id: "location",
    topic: "location",
    title: "Where to find us",
    question: "Where is the shop?",
    answer:
      "Tunde Phone Clinic, Shop 14, Taiwo Road, Ilorin — opposite the old Total filling station, next to the photocopy kiosk. Look for the green kiosk with phones in the glass.",
    keywords: [
      "where",
      "location",
      "address",
      "taiwo",
      "ilorin",
      "find",
      "shop",
      "direction",
      "map",
      "opposite",
    ],
  },
  {
    id: "screen",
    topic: "pricing",
    title: "Screen replacement range",
    question: "How much to change a screen?",
    answer:
      "Screen replacement is a range, not a final quote: ₦8,000–₦25,000 depending on the model and whether the original glass is still usable. iPhone 11 class sits toward the middle of that band. Exact figure only after we open the phone. We do not hold a price over WhatsApp.",
    keywords: [
      "screen",
      "display",
      "cracked",
      "break",
      "iphone",
      "tecno",
      "infinix",
      "samsung",
      "how much",
      "price",
      "glass",
    ],
  },
  {
    id: "battery",
    topic: "pricing",
    title: "Battery replacement range",
    question: "How much for a new battery?",
    answer:
      "Battery jobs run ₦6,000–₦18,000 depending on model. Swelling, original vs aftermarket, and whether the back glass must come off all change the figure. We quote after we see the phone.",
    keywords: ["battery", "charge", "swelling", "drain", "power", "how much"],
  },
  {
    id: "unlock",
    topic: "pricing",
    title: "Network unlock (with proof)",
    question: "Can you unlock my phone?",
    answer:
      "Network unlock for a phone you can prove is yours: ₦3,000–₦7,000. Bring the phone, a valid ID, and the purchase receipt or box. We do not unlock phones without proof of ownership, and we do not bypass iCloud / Google lock for a third party.",
    keywords: ["unlock", "network", "sim", "locked", "flash", "icloud", "frp"],
  },
  {
    id: "booking",
    topic: "booking",
    title: "How to book a drop-off",
    question: "How do I book?",
    answer:
      "Walk in during hours, or send the model, the fault, and a morning or afternoon window. Tunde will confirm the slot. We do not take a deposit on WhatsApp. Same-day pickup is never promised in chat — only at the counter after inspection.",
    keywords: [
      "book",
      "booking",
      "appointment",
      "drop",
      "drop-off",
      "come",
      "slot",
      "when can",
      "available",
    ],
  },
  {
    id: "documents",
    topic: "documents",
    title: "What to bring",
    question: "What should I bring?",
    answer:
      "Bring the phone, the charger if the fault is power, and — for warranty, unlock, or disputed ownership — the purchase receipt and IMEI (dial *#06#). A photo of the receipt is enough to start the checklist. It is not enough to close a warranty job.",
    keywords: [
      "bring",
      "document",
      "receipt",
      "imei",
      "id",
      "charger",
      "box",
      "warranty papers",
      "what do i need",
    ],
  },
  {
    id: "warranty",
    topic: "warranty",
    title: "Warranty on our work",
    question: "Do you give warranty?",
    answer:
      "Our parts and labour carry 14 days for screen and 30 days for battery, covering the part we fitted — not a fresh drop or liquid. Warranty needs the job ticket Tunde writes at drop-off. No ticket, no warranty claim over chat.",
    keywords: ["warranty", "guarantee", "come back", "failed", "ticket"],
  },
  {
    id: "water",
    topic: "process",
    title: "Liquid damage",
    question: "My phone entered water.",
    answer:
      "Switch it off. Do not charge it. Bring it in. We can inspect and tell you if a clean-and-dry is worth trying. We will not promise recovery, data, or a price for liquid damage on WhatsApp.",
    keywords: ["water", "rain", "liquid", "soak", "fell in", "bathroom", "wash"],
  },
  {
    id: "data",
    topic: "process",
    title: "Backup before we open it",
    question: "Will you keep my data?",
    answer:
      "Back up first if the phone still unlocks. We try not to wipe, but opening a phone can lose data. We are not a data-recovery lab. If the job needs a flash, Tunde will say so at the counter before we proceed.",
    keywords: ["data", "backup", "photos", "files", "wipe", "flash", "memory"],
  },
];

export function faqsById(faqs: FaqEntry[]) {
  return Object.fromEntries(faqs.map((f) => [f.id, f]));
}
