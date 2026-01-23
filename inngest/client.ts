import { Inngest } from "inngest";

// console.log("process.env.INNGEST_EVENT_KEY->  ",process.env.INNGEST_EVENT_KEY);

export const inngest = new Inngest({ 
    id: "AgriBoost", 
    baseURL: 'https://app.inngest.com', 
    eventKey: process.env.INNGEST_EVENT_KEY! 
});