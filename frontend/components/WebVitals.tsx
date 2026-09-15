"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
  useReportWebVitals((metric) => {
    try {
      const body = JSON.stringify({
        id: metric.id,
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        navigationType: (metric as unknown as { navigationType?: string }).navigationType || "unknown",
      });
      const url = "/api/vitals";

      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        navigator.sendBeacon(url, body);
      } else {
        fetch(url, {
          body,
          method: "POST",
          headers: { "Content-Type": "application/json" },
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Non-critical telemetry failure
    }
  });

  return null;
}

export default WebVitals;
