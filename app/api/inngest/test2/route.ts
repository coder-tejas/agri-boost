import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";

export async function GET() {
    const result = await inngest.send({
        name: "test/hello.worldlonger", // Ensure this matches your function trigger
        data: { email: "test2@example.com" },
    });

    return NextResponse.json({
        message: "Event sent to helloWorldLonger",
        eventId: result.ids[0]
    });
}
