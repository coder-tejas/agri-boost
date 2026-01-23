export const RunStatus = async (runId: string) => {
  console.log("[InngestClient] Fetching run status", { runId });

  const res = await fetch(`/api/inngest/status?runId=${runId}`);

  if (!res.ok) {
    const text = await res.text();
    console.error("[InngestClient] Status API error", {
      runId,
      status: res.status,
      body: text,
    });
    throw new Error("Failed to fetch run status");
  }

  const json = await res.json();
  console.log("[InngestClient] Status API response received", {
    runId,
    runCount: json?.data?.length || 0,
  });

  return json?.data || [];
};

export async function getRunOutput(runId: string) {
  console.log("[InngestClient] Starting polling for run completion", { runId });

  let attempts = 0;
  let delay = 1000;
  const maxAttempts = 25;

  while (attempts < maxAttempts) {
    attempts++;

    console.log("[InngestClient] Poll attempt", {
      runId,
      attempt: attempts,
      delayMs: delay,
    });

    const runs = await RunStatus(runId);

    if (!runs.length) {
      console.log("[InngestClient] No runs found yet, retrying after delay");
      await new Promise((r) => setTimeout(r, delay));
      delay = Math.min(delay * 1.5, 8000);
      continue;
    }

    const run = runs[0];
    console.log("[InngestClient] Current run status", {
      runId,
      status: run.status,
    });

    if (run.status === "Completed") {
      console.log("[InngestClient] Run completed successfully", { runId });
      return run;
    }

    if (run.status === "Failed" || run.status === "Cancelled") {
      console.error("[InngestClient] Run failed", {
        runId,
        status: run.status,
        error: run.error,
      });
      throw new Error(run.error || "Inngest run failed");
    }

    await new Promise((r) => setTimeout(r, delay));
    delay = Math.min(delay * 1.5, 8000);
  }

  console.error("[InngestClient] Run polling timed out", { runId });
  throw new Error("Run timed out");
}
