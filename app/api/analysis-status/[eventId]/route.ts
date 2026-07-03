import { NextRequest } from "next/server";
import { db } from "@/configs/db";
import { userSoilAnalysis } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      let attempts = 0;
      let delay = 1000;
      const maxAttempts = 60;

      while (attempts < maxAttempts) {
        attempts++;

        try {
          const rows = await db
            .select()
            .from(userSoilAnalysis)
            .where(eq(userSoilAnalysis.eventId, eventId))
            .limit(1);

          if (rows.length > 0) {
            const row = rows[0];
            sendEvent({
              status: "completed",
              message: "Analysis complete",
              output: { analysis: row.analysis },
            });
            controller.close();
            return;
          }

          sendEvent({ status: "pending", message: "Waiting for analysis to complete" });
        } catch {
          sendEvent({ status: "error", message: "Failed to check analysis status" });
          controller.close();
          return;
        }

        await new Promise((r) => setTimeout(r, delay));
        delay = Math.min(delay * 2, 10000);
      }

      if (attempts >= maxAttempts) {
        sendEvent({ status: "timeout", message: "Analysis timed out" });
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
