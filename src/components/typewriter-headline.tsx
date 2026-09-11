import { useEffect, useState } from "react";

interface TypewriterHeadlineProps {
  line1?: string;
  line2?: string;
}

export function TypewriterHeadline({
  line1 = "The shop’s first line.",
  line2 = "A human still closes the door.",
}: TypewriterHeadlineProps) {
  const [displayedLine1, setDisplayedLine1] = useState("");
  const [displayedLine2, setDisplayedLine2] = useState("");
  const [phase, setPhase] = useState<"typing1" | "pause" | "typing2" | "done">("typing1");

  useEffect(() => {
    // Respect reduced-motion preference
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayedLine1(line1);
      setDisplayedLine2(line2);
      setPhase("done");
      return;
    }

    let currentIndex = 0;
    const speed = 42; // ms per char

    // Phase 1: Type line 1
    const interval1 = setInterval(() => {
      currentIndex++;
      setDisplayedLine1(line1.slice(0, currentIndex));
      if (currentIndex >= line1.length) {
        clearInterval(interval1);
        setPhase("pause");

        // Brief pause between line 1 and line 2
        setTimeout(() => {
          setPhase("typing2");
          let index2 = 0;
          const interval2 = setInterval(() => {
            index2++;
            setDisplayedLine2(line2.slice(0, index2));
            if (index2 >= line2.length) {
              clearInterval(interval2);
              setPhase("done");
            }
          }, 38);
        }, 280);
      }
    }, speed);

    return () => {
      clearInterval(interval1);
    };
  }, [line1, line2]);

  return (
    <h1
      id="hero-typewriter-headline"
      className="mt-4 max-w-xl font-display text-[2.6rem] font-medium leading-[1.05] tracking-[-0.03em] text-ink sm:text-6xl"
      aria-label={`${line1} ${line2}`}
    >
      <span className="block min-h-[1.1em]">
        {displayedLine1}
        {phase === "typing1" && (
          <span
            className="ml-1 inline-block h-[0.85em] w-[3px] animate-pulse bg-ink align-baseline"
            aria-hidden="true"
          />
        )}
      </span>
      <span className="mt-2 block min-h-[1.1em] text-forest">
        {displayedLine2}
        {(phase === "pause" || phase === "typing2") && (
          <span
            className="ml-1 inline-block h-[0.85em] w-[3px] animate-pulse bg-forest align-baseline"
            aria-hidden="true"
          />
        )}
      </span>
    </h1>
  );
}
