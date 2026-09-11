import { useEffect } from "react";
import { useKofa } from "@/lib/kofa/store";

export function useHydrateKofa() {
  const setHydrated = useKofa((s) => s.setHydrated);
  const hydrated = useKofa((s) => s.hydrated);

  useEffect(() => {
    void Promise.resolve(useKofa.persist.rehydrate()).finally(() =>
      setHydrated(true),
    );
  }, [setHydrated]);

  return hydrated;
}
