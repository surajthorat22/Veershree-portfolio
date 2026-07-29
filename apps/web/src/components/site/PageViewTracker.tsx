import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import { apiClient } from "@/utils/ts-rest";

const VISITOR_KEY = "vs_visitor_id";

function getOrCreateVisitorId(): string {
  try {
    const existing = localStorage.getItem(VISITOR_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export function PageViewTracker() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const lastTracked = useRef<{ path: string; at: number } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!path || path.startsWith("/admin")) return;

    const now = Date.now();
    const previous = lastTracked.current;
    // Avoid duplicate hits from React Strict Mode remounts on the same path.
    if (previous && previous.path === path && now - previous.at < 1500) return;
    lastTracked.current = { path, at: now };

    const visitorId = getOrCreateVisitorId();
    void apiClient
      .trackPageView({
        body: {
          path,
          visitorId,
          referrer: document.referrer || undefined,
        },
      })
      .catch(() => {
        // Tracking should never interrupt browsing.
      });
  }, [path]);

  return null;
}
