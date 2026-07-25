import { NextRequest, NextResponse } from "next/server";
import logger from "@/lib/logger";

export async function GET(req: NextRequest) {
  logger.info({ url: req.url }, "Incoming request");

  const runId = req.nextUrl.searchParams.get("runId");

  if (!runId) {
    logger.error("Missing runId in query params");
    return NextResponse.json({ error: "Missing runId" }, { status: 400 });
  }

  logger.info({ runId }, "Fetching status for runId");

  const inngestUrl = `https://app.inngest.com/v1/events/${runId}/runs`;
  logger.info({ url: inngestUrl }, "Calling Inngest API");

  let res;
  try {
    res = await fetch(inngestUrl, {
      headers: {
        Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
      },
    });
  } catch (err) {
    logger.error({ err }, "Network error while calling Inngest");
    return NextResponse.json(
      { error: "Failed to reach Inngest API" },
      { status: 500 }
    );
  }

  logger.info({ status: res.status }, "Inngest response status");

  if (!res.ok) {
    const text = await res.text();
    logger.error({ status: res.status, body: text }, "Inngest API error body");

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
    logger.error({ err }, "Failed to parse Inngest JSON");
    return NextResponse.json(
      { error: "Invalid JSON from Inngest" },
      { status: 500 }
    );
  }

  logger.info("Successfully fetched run status");
  logger.debug({ payload: json }, "Run status payload");

  return NextResponse.json(json);
}
