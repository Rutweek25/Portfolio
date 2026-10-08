"use client";

import { useEffect, useState } from "react";

// Returns true only if `src` actually loads. Lets the site ship without a
// photo and pick one up automatically the moment you drop a file into /public.
export default function useOptionalImage(src) {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;
    const img = new window.Image();
    img.onload = () => {
      if (!cancelled) setOk(true);
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  return ok;
}
