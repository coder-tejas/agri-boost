import { convertToModelMessages, createUIMessageStreamResponse, type ModelMessage, streamText, type UIMessage } from "ai";
import { NextRequest } from "next/server";
import { google } from "@ai-sdk/google"
import { currentUser } from "@clerk/nextjs/server";
import { checkAndIncrement, type Plan } from "@/lib/plan-limits";
import { db } from "@/configs/db";
import { subscriptions } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest): Promise<Response> {
  const user = await currentUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const email = user.primaryEmailAddress?.emailAddress;
  if (!email) {
    return new Response("User has no email", { status: 400 });
  }

  const existingSub = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userEmail, email));
  const plan: Plan = (existingSub.length > 0 ? existingSub[0].plan : "free") as Plan;

  const { allowed } = await checkAndIncrement(email, "chat", plan);
  if (!allowed) {
    return new Response("Monthly chat limit reached", { status: 403 });
  }

  const body = await req.json();

  const messages: UIMessage[] = body.messages;
  const soilData = body.farmerData;
  const analysisData = body.analysisData;
  const locale = req.cookies.get('NEXT_LOCALE')?.value || 'en';
  const modelMessages: ModelMessage[] = convertToModelMessages(messages);
  const streamTextResult = streamText({
    model: google('gemini-2.5-flash'),
    messages: modelMessages,
    system: `You are KrishiSahayak, an AI agriculture assistant for farmers. 
Use the farmer's soil, crop, and field data to give practical, data-driven advice on improving yield, soil health, and sustainability. 
Be clear, concise, and farmer-friendly. 
If data is missing, ask for it before answering. 
Never hallucinate or give unsafe chemical suggestions.
Farmer's soil and crop data : ${soilData}
Farmer's soil and crop analysis report : ${analysisData}
Answer in Language : ${locale}
`
  })
  const stream = streamTextResult.toUIMessageStream();
  return createUIMessageStreamResponse({
    stream
  })
}
