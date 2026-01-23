import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("[InngestStatus] Incoming request:", req.url);

  const runId = req.nextUrl.searchParams.get("runId");

  if (!runId) {
    console.error("[InngestStatus] Missing runId in query params");
    return NextResponse.json({ error: "Missing runId" }, { status: 400 });
  }

  console.log("[InngestStatus] Fetching status for runId:", runId);

  const inngestUrl = `https://app.inngest.com/v1/events/${runId}/runs`;
  console.log("[InngestStatus] Calling Inngest API:", inngestUrl);

  let res;
  try {
    res = await fetch(inngestUrl, {
      headers: {
        Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
      },
    });
  } catch (err) {
    console.error("[InngestStatus] Network error while calling Inngest:", err);
    return NextResponse.json(
      { error: "Failed to reach Inngest API" },
      { status: 500 }
    );
  }

  console.log("[InngestStatus] Inngest response status:", res.status);

  if (!res.ok) {
    const text = await res.text();
    console.error("[InngestStatus] Inngest API error body:", text);

    return NextResponse.json(
      {
        error: "Inngest API returned error",
        status: res.status,
        details: text,
      },
      { status: res.status }
    );
  }

  let json;
  try {
    json = await res.json();
  } catch (err) {
    console.error("[InngestStatus] Failed to parse Inngest JSON:", err);
    return NextResponse.json(
      { error: "Invalid JSON from Inngest" },
      { status: 500 }
    );
  }

  console.log("[InngestStatus] Successfully fetched run status");
  console.log("[InngestStatus] Payload:", JSON.stringify(json, null, 2));

  return NextResponse.json(json);
}
