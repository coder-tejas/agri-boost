export const RunStatus = async (eventId: string) => {
  try {
    console.log("🔍 Starting RunStatus request for runId:", eventId);

    if (!eventId || eventId.trim() === "") {
      throw new Error("Invalid eventId provided");
    }

    const url = `https://api.inngest.com/v1/events/${eventId}/runs`;
    console.log("📡 Making request to:", url);

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${process.env.NEXT_PUBLIC_INNGEST_SIGNING_KEY!}`);

    const requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow" as RequestRedirect,
    };

    const response = await fetch(url, requestOptions);

    console.log("📊 Response status:", response.status);
    console.log("📊 Response ok:", response.ok);

    const responseJson = await response.json();
    console.log("📄 Raw response json:", responseJson);

    return responseJson?.data || [];
  } catch (error: any) {
    console.error("❌ RunStatus error:", error.message);
    return [];
  }
};

export async function getRunOutput(eventId: string) {
  if (!eventId || eventId.trim() === "") {
    throw new Error("Invalid eventId provided to getRunOutput");
  }

  console.log("🔄 Starting to poll for job completion:", eventId);

  let attempts = 0;
  const maxAttempts = 80; // 🔥 Poll for ~10 seconds
  const delay = 1000; // 1 second between attempts

  while (attempts < maxAttempts) {
    attempts++;
    console.log(`🔄 Polling attempt ${attempts}/${maxAttempts} for eventId:`, eventId);

    const runs = await RunStatus(eventId);

    if (!Array.isArray(runs) || runs.length === 0) {
      console.warn(`⚠️ No runs found (attempt ${attempts})`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      continue;
    }

    const runStatus = runs[0].status;
    console.log(`📊 Current status: ${runStatus} (attempt ${attempts})`);

    if (runStatus === "Completed") {
      console.log("✅ Job completed successfully:", runs[0]);
      return runs[0];
    }

    if (runStatus === "Failed" || runStatus === "Cancelled") {
      console.error(`❌ Job ${runStatus}:`, runs[0]);
      throw new Error(
        `Function run ${runStatus}: ${runs[0].error || "No error details"}`
      );
    }

    // Still running, wait and try again
    console.log(`⏳ Job still ${runStatus}, waiting 1 second...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  throw new Error(`Job polling timeout after ${maxAttempts} attempts (~10s)`);
}
