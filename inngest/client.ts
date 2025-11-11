import { Inngest } from "inngest";

export const inngest = new Inngest({ 
    id: "AgriBoost", 
    // baseURL: 'https://app.inngest.com', 
    eventKey: process.env.INNGEST_EVENT_KEY! 
});