"use client";

import { useEffect } from "react";

export function ReloadScrollReset() {
  useEffect(() => {
    if (!("scrollRestoration" in window.history)) return;

    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const resetScroll = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    resetScroll();
    window.addEventListener("beforeunload", resetScroll);
    window.addEventListener("pageshow", resetScroll);

    return () => {
      window.history.scrollRestoration = previous;
      window.removeEventListener("beforeunload", resetScroll);
      window.removeEventListener("pageshow", resetScroll);
    };
  }, []);

  return null;
}
