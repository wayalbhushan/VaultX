import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop({ smooth = true }) {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If navigating to an in-page anchor (#section), let the browser handle it
    if (hash) return;

    const opts = smooth
      ? { top: 0, left: 0, behavior: "smooth" }
      : { top: 0, left: 0 };

    // Defer until after layout so heights are correct
    requestAnimationFrame(() => window.scrollTo(opts));
  }, [pathname, hash, smooth]);

  return null;
}
