"use client";

import { useEffect, useState } from "react";
import type { Channel as StreamChannel } from "stream-chat";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Wheat, MessageCircle } from "lucide-react";
import { toast } from "sonner";

export default function ChatPage() {
  const [channel, setChannel] = useState<StreamChannel | null>(null);

  useEffect(() => {
    async function init() {
      try {
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
      } catch {
        toast.error("Failed to connect to chat. Please refresh.");
      }
    }

    init();

    return () => {
      client.disconnectUser();
    };
  }, []);

  if (!channel) {
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
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="w-full max-w-screen h-screen rounded-xl border border-border bg-card shadow-xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-3/4 rounded-lg" />
            <Skeleton className="h-16 w-5/6 rounded-lg" />
            <Skeleton className="h-16 w-2/3 rounded-lg" />
            <div className="flex items-center justify-center pt-8">
              <MessageCircle className="w-5 h-5 text-muted-foreground animate-pulse mr-2" />
              <span className="text-sm text-muted-foreground">Connecting to chat...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

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
