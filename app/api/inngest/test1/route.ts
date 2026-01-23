import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";

export async function GET() {
  // inngest.send returns an object containing the event 'ids'
  const result = await inngest.send({
    name: "test/hello.world",
    data: { email: "test1@example.com" },
  });

  return NextResponse.json({ 
    message: "Event sent to helloWorld", 
    eventId: result.ids[0] 
  });
}
