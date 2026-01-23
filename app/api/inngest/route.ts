import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { GenerateCropYeild, helloWorld, helloWorldlonger } from "@/inngest/functions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    GenerateCropYeild,
    helloWorld,
    helloWorldlonger
  ],
  signingKey:process.env.INNGEST_SIGNING_KEY! 
  //^ Comment in dev ^^^^^^^
});