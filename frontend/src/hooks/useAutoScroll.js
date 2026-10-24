import { useRef, useEffect } from "react";

/**
 * Auto-scrolls a container to the bottom whenever any of the given
 * dependencies change (e.g. new messages arriving, typing indicator toggling).
 *
 * Usage:
 *   const bottomRef = useAutoScroll([messages, loading]);
 *   ...
 *   <div ref={bottomRef} />
 */
export function useAutoScroll(dependencies = []) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return bottomRef;
}