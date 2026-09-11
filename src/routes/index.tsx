import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { KofaMark } from "@/components/mark";
import { TypewriterHeadline } from "@/components/typewriter-headline";
import { SHOP } from "@/lib/kofa/shop";
import { CAPSTONE_TITLE, PROBLEM_ONE_LINER } from "@/lib/kofa/statement";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="min-h-dvh">
      <SiteNav />
      <main>
        <Hero />
        <Problem />
        <Bounds />
        <NotTrusted />
        <ShopCard />
        <Footer />
      </main>
    </div>
  );
}

function Hero() {
  return (
    <section className="grain relative overflow-hidden border-b border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:py-20">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
            3MTT × Meta · Capstone artefact
          </p>
          <TypewriterHeadline
            line1="The shop’s first line."
            line2="A human still closes the door."
          />
          <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg">
            {PROBLEM_ONE_LINER} Hours, ranges, booking, papers. Nothing else.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/line">Open the customer line</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/desk" search={{ tab: "inbox" }}>
                Open the owner desk
              </Link>
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-line/60">
            <p className="text-xs uppercase tracking-wider text-muted font-medium">
              Try multi-question inquiries:
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <Link
                to="/line"
                search={{ q: "Where are you located and how much is screen replacement?" }}
                className="inline-flex items-center gap-1.5 rounded-md border border-line bg-paper-3/80 px-2.5 py-1.5 text-xs text-ink hover:border-forest/40 hover:bg-paper-3 transition-colors"
              >
                <span>📍 Location + Price</span>
              </Link>
              <Link
                to="/line"
                search={{ q: "Where are you, how much is screen replacement, and can I pay later?" }}
                className="inline-flex items-center gap-1.5 rounded-md border border-line bg-paper-3/80 px-2.5 py-1.5 text-xs text-ink hover:border-forest/40 hover:bg-paper-3 transition-colors"
              >
                <span>⚖️ Answer + Handoff</span>
              </Link>
              <Link
                to="/line"
                search={{ q: "Can you unlock this phone without documents and what is the price?" }}
                className="inline-flex items-center gap-1.5 rounded-md border border-line bg-paper-3/80 px-2.5 py-1.5 text-xs text-ink hover:border-clay/40 hover:bg-paper-3 transition-colors"
              >
                <span>🛡️ Safety Refusal</span>
              </Link>
            </div>
          </div>
        </div>
        <GateBoard />
      </div>
    </section>
  );
}

function GateBoard() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="rounded-[1.75rem] bg-forest p-3 text-paper-3 shadow-[var(--shadow-border)]">
        <div className="rounded-[1.35rem] bg-forest-2 px-5 py-5">
          <div className="flex items-center justify-between">
            <KofaMark className="size-8 text-paper-3" />
            <span className="text-[11px] uppercase tracking-[0.16em] text-paper-3/60">
              Owned FAQ
            </span>
          </div>
          <p className="mt-8 font-display text-3xl leading-tight">{SHOP.name}</p>
          <p className="mt-1 text-sm text-paper-3/70">
            {SHOP.street}, {SHOP.city}
          </p>
          <dl className="mt-8 space-y-3 border-t border-paper-3/15 pt-5 text-sm">
            <Row k="Hours" v="Mon–Sat 9–7 · closed Sunday" />
            <Row k="Screen" v="₦8,000–₦25,000 · after we see it" />
            <Row k="Battery" v="₦6,000–₦18,000" />
            <Row k="Unlock" v="₦3,000–₦7,000 with papers" />
            <Row k="Booking" v="Walk in, or send model + window" />
            <Row k="Bring" v="Phone, receipt, IMEI for warranty" />
          </dl>
          <p className="mt-8 text-xs leading-relaxed text-paper-3/60">
            Kofa may read this board. Kofa may not add a line.
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="uppercase tracking-[0.12em] text-[11px] text-paper-3/55">{k}</dt>
      <dd className="text-right text-paper-3">{v}</dd>
    </div>
  );
}

function Problem() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-12">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted lg:col-span-3">
          The problem
        </p>
        <div className="lg:col-span-8">
          <h2 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
            {CAPSTONE_TITLE}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft">
            Nigerian service shops still spend evenings repeating the same WhatsApp
            answers. The courses show GenAI can draft and retrieve. They also show
            the failure mode: unguarded output, invented figures, and “replace the
            team.” Kofa is the other shape — a gate on a short, pre-agreed FAQ, with
            a human on anything that looks like price, identity, or a promise.
          </p>
        </div>
      </div>
    </section>
  );
}

function Bounds() {
  const items = [
    {
      n: "01",
      t: "Lookup, not browsing",
      d: "A defined tool over the owner’s FAQ. No free-form web copy. No “the model already knows our books.”",
    },
    {
      n: "02",
      t: "Refuse is a feature",
      d: "Stolen phones, no-papers unlocks, medical, legal, and anything off the board are refused — locally, before the model can be helpful.",
    },
    {
      n: "03",
      t: "Tunde closes it",
      d: "Haggling, deadlines, ownership, payment terms: flagged to the desk. The first line does not take the last word.",
    },
  ];
  return (
    <section className="border-y border-line bg-paper-2/60">
      <div className="mx-auto grid max-w-6xl gap-px sm:grid-cols-3">
        {items.map((it) => (
          <div key={it.n} className="bg-paper px-5 py-10 sm:px-8">
            <p className="font-mono text-xs text-muted">{it.n}</p>
            <h3 className="mt-4 font-display text-2xl">{it.t}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{it.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function NotTrusted() {
  const no = [
    "A final naira quote",
    "A 2pm pickup promise",
    "Whether a phone is stolen",
    "Liquid-damage diagnosis",
    "Taking payment on chat",
    "Speaking for Tunde after the FAQ ends",
    "Training on private customer threads",
    "Running overnight with an empty handoff queue",
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="rounded-[1.5rem] bg-ink px-6 py-10 text-paper-3 sm:px-10">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-paper-3/50">
          What we will not trust it with
        </p>
        <h2 className="mt-3 max-w-xl font-display text-3xl font-medium sm:text-4xl">
          Pass mark is responsible use, not a viral product.
        </h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {no.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 border-t border-paper-3/10 pt-3 text-sm text-paper-3/80"
            >
              <span className="mt-1 block h-px w-6 shrink-0 bg-clay" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ShopCard() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      <div className="flex flex-col justify-between gap-6 rounded-[1.5rem] bg-paper-3 p-6 shadow-[var(--shadow-border)] sm:flex-row sm:items-center sm:p-8">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
            Demo shop
          </p>
          <h2 className="mt-1 font-display text-2xl sm:text-3xl">{SHOP.name}</h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
            A bounded stand-in for the Ilorin shops this is built for. Play the
            customer on the line. Play {SHOP.owner} on the desk. Send the question
            it must refuse.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2">
          <Button asChild>
            <Link to="/line">Try four WhatsApp turns</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/desk" search={{ tab: "inbox" }}>
              Watch the handoff queue
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line px-4 py-8 text-sm text-muted sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>3MTT × Meta AI Skills Development · Ilorin</p>
      </div>
    </footer>
  );
}
