import { useEffect, useState } from "react";

/**
 * Hook to check if the component is loaded
 */
export function useLoaded() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => setLoaded(true), []);

  return loaded;
}
