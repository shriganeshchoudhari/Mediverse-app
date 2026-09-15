import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/vitals
 * Receives Core Web Vitals metrics from the client and logs them.
 * In production this should forward to your observability backend (Grafana, Loki, DataDog).
 */
export async function POST(request: NextRequest) {
  try {
    const metric = await request.json();
    // Log structured for Loki/Grafana ingestion
    console.log(
      JSON.stringify({
        level: "info",
        service: "mediverse-frontend",
        event: "web_vital",
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        id: metric.id,
        navigationType: metric.navigationType,
        timestamp: new Date().toISOString(),
      })
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
