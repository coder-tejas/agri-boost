import { NextRequest } from "next/server";

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

      const inngestUrl = `https://app.inngest.com/v1/events/${eventId}/runs`;

      let attempts = 0;
      let delay = 1000;
      const maxAttempts = 60;

      while (attempts < maxAttempts) {
        attempts++;

        try {
          const res = await fetch(inngestUrl, {
            headers: {
              Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
            },
          });

          if (!res.ok) {
            sendEvent({ status: "error", message: "Inngest API error" });
            break;
          }

          const json = await res.json();
          const runs = json?.data || [];

          if (runs.length === 0) {
            sendEvent({ status: "pending", message: "Waiting for job to start" });
          } else {
            const run = runs[0];

            switch (run.status) {
              case "Running":
                sendEvent({ status: "running", message: "Analysis in progress" });
                break;
              case "Completed":
                sendEvent({
                  status: "completed",
                  message: "Analysis complete",
                  output: run.output,
                });
                controller.close();
                return;
              case "Failed":
              case "Cancelled":
                sendEvent({
                  status: "failed",
                  message: run.error || "Analysis failed",
                });
                controller.close();
                return;
              default:
                sendEvent({ status: "unknown", message: `Status: ${run.status}` });
            }
          }
        } catch {
          sendEvent({ status: "error", message: "Failed to check status" });
          break;
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
