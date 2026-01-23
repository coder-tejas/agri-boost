"use client";

import { useEffect, useState } from "react";
import {
  Chat,
  Channel,
  Window,
  MessageList,
  MessageInput,
} from "stream-chat-react";
import { client } from "@/lib/stream";
import "stream-chat-react/dist/css/v2/index.css";
import AppHeader from "@/app/_components/AppHeader";
import { Wheat } from "lucide-react";

export default function ChatPage() {
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    async function init() {
      const userId = "user_" + Math.random().toString(36).slice(2);

      const res = await fetch("/api/token", {
        method: "POST",
        body: JSON.stringify({ userId }),
      });

      const { token } = await res.json();

      await client.connectUser({ id: userId, name: userId }, token);

      const globalChannel = client.channel("messaging", "global");
      await globalChannel.watch();

      setChannel(globalChannel);
    }

    init();

    return () => {
      client.disconnectUser();
    };
  }, []);

  if (!channel) return <p>Loading chat...</p>;

  return (
    <>
      <AppHeader>
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Wheat className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                COMMUNITY
              </h1>
            </div>
          </div>
        </div>
      </AppHeader>
      <div className="min-h-screen bg-background text-foregro und flex items-center justify-center p-6">
        <div className="w-full max-w-screen h-screen rounded-xl border border-border bg-card shadow-xl overflow-hidden">
          <Chat client={client}>
            <Channel channel={channel}>
              <Window>
                <div className="border-b border-border px-4 bg-muted">
                  <h2 className="text-lg font-semibold text-foreground"> </h2>
                </div>
                <MessageList />
                <div className="border-t border-border bg-card">
                  <MessageInput />
                </div>
              </Window>
            </Channel>
          </Chat>
        </div>
      </div>
    </>
  );
}
