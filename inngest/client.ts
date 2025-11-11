import { Inngest } from "inngest";

// Create a client to send and receive events
console.log("inggest event key, ", process.env.INNGEST_EVENT_KEY!  );

export const inngest = new Inngest({ 
    id: "AgriBoost", 
    baseURL: 'https://app.inngest.com', 
    eventKey: process.env.INNGEST_EVENT_KEY! 
});