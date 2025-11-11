
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ runId: string }> }
) {
  try {
    const { runId } = await context.params;
    
    const response = await fetch(
      `https://api.inngest.com/v1/events/${runId}/runs`,
      {
        headers: {
          "Authorization": `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Inngest API error: ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data);
    
  } catch (error: any) {
    console.error("Error fetching run status:", error);
    return Response.json(
      { error: error.message }, 
      { status: 500 }
    );
  }
}
