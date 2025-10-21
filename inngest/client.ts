import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "AgriBoost",baseURL: 'http://172.19.90.74:8288' });