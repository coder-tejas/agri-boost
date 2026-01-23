"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import React, { useState, useRef, useEffect } from "react";
import { Send, Wheat } from "lucide-react";
import AppHeader from "@/app/_components/AppHeader";
import ReactMarkdown from "react-markdown";

export default function Page() {
  const [farmerData, setFarmerData] = useState<string>("");
  const [analysisData, setAnalysisData] = useState<string>("");
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [locale, setLocale] = useState<string>("en");
  useEffect(() => {
    const p = localStorage.getItem("USER_OTHER_DATA");
    const q = localStorage.getItem("ANALYSIS_RESULT");
    setFarmerData(p || "");
    setAnalysisData(q || "");
    setIsDataLoaded(true);
  }, []); // Empty dependency array - runs only once

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!farmerData || !analysisData) {
      alert("DO CROP ANALYSIS FIRST TO CONTINUE");
      return;
    }

    if (input.trim()) {
      sendMessage(
        { text: input },
        {
          body: {
            farmerData: farmerData,
            analysisData: analysisData,
          },
        },
      );
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Header - Using AppHeader component */}
      <AppHeader>
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Wheat className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                AgriBot Assistant
              </h1>
            </div>
          </div>
        </div>
      </AppHeader>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-block bg-primary-100 p-4 rounded-lg mb-4">
                <Wheat className="w-12 h-12 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-800 mb-2">
                Welcome to AgriBot
              </h2>
              <p className="text-neutral-600">
                Ask me anything about agriculture, crops, or farming techniques!
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 sm:px-5 py-3 shadow-sm ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-primary-600 to-primary-700 text-white"
                    : "bg-white border border-neutral-200 text-neutral-800"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-primary-100 p-1.5 rounded-lg">
                      <Wheat className="w-4 h-4 text-primary-600" />
                    </div>
                    <span className="text-xs font-semibold text-primary-700">
                      AgriBot
                    </span>
                  </div>
                )}
                <div className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                  {message.parts.map((part, index) =>
                    part.type === "text" ? (
                      <span key={index}>
                        <ReactMarkdown>{part.text}</ReactMarkdown>
                      </span>
                    ) : null,
                  )}
                </div>
              </div>
            </div>
          ))}

          {status === "streaming" && (
            <div className="flex justify-start">
              <div className="bg-white border border-neutral-200 rounded-2xl px-4 sm:px-5 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="bg-primary-100 p-1.5 rounded-lg">
                    <Wheat className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-neutral-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex gap-2 sm:gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={status === "streaming"}
              placeholder="Ask about crops, soil, weather..."
              className="flex-1 px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-neutral-200 rounded-full focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all disabled:bg-neutral-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSubmit}
              disabled={status === "streaming" || !input.trim()}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full hover:from-primary-700 hover:to-primary-800 disabled:from-neutral-300 disabled:to-neutral-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 font-medium text-sm sm:text-base"
            >
              {status === "streaming" ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Sending</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-neutral-500 text-center mt-3">
            AgriBot can provide information about agriculture and farming
            practices
          </p>
        </div>
      </div>
    </div>
  );
}
