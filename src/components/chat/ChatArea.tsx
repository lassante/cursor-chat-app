"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { format } from "date-fns";
import { ChatUser } from "@/types/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getNameGradient } from "@/lib/helpers";

export const ChatArea = () => {
  const {
    user,
    users,
    selectedChatId,
    messages,
    subscribeToMessages,
    sendMessage,
  } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedUser = users.find((u: ChatUser) => u.id === selectedChatId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!user || !selectedChatId) return;

    const unsubscribe = subscribeToMessages(user.uid, selectedChatId);
    return () => unsubscribe();
  }, [user, selectedChatId, subscribeToMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedChatId || !inputRef.current?.value.trim()) return;

    const messageText = inputRef.current.value.trim();

    try {
      await sendMessage(user.uid, selectedChatId, messageText);
      if (inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.focus();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!selectedUser) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md space-y-2">
          <h2 className="text-xl font-semibold">Welcome to Chatly</h2>
          <p className="text-muted-foreground">
            Select a chat from the right to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 max-w-screen-lg mx-auto pl-12 lg:pl-0">
          <Avatar>
            <AvatarImage src={selectedUser.photoURL} />
            <AvatarFallback
              className={cn(
                "bg-gradient-to-br text-white",
                getNameGradient(selectedUser.name)
              )}
            >
              {selectedUser.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{selectedUser.name}</h2>
            <p className="text-sm text-muted-foreground">
              {selectedUser.isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="max-w-screen-lg mx-auto space-y-4">
          {messages.map((message, index) => {
            const isOwn = message.senderId === user?.uid;
            const showAvatar =
              index === 0 || messages[index - 1]?.senderId !== message.senderId;

            return (
              <div
                key={message.id}
                className={cn(
                  "flex items-end gap-2",
                  isOwn ? "flex-row-reverse" : "flex-row",
                  "opacity-0 animate-message-appear",
                  `[animation-delay:${Math.min(index * 50, 500)}ms]`
                )}
              >
                {!isOwn && showAvatar && (
                  <Avatar className="mb-2">
                    <AvatarImage src={selectedUser.photoURL} />
                    <AvatarFallback
                      className={cn(
                        "bg-gradient-to-br text-white",
                        getNameGradient(selectedUser.name)
                      )}
                    >
                      {selectedUser.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "group relative max-w-[70%] rounded-2xl p-3 shadow-sm",
                    isOwn
                      ? "bg-gradient-to-r from-violet-600/90 to-indigo-600/90 dark:from-violet-500/90 dark:to-indigo-500/90 text-white rounded-br-sm"
                      : "bg-gradient-to-r from-emerald-600/90 to-teal-600/90 dark:from-emerald-500/90 dark:to-teal-500/90 text-white rounded-bl-sm"
                  )}
                >
                  <p className="break-words">{message.text}</p>
                  <div className="h-[20px] flex items-end">
                    {message.timestamp && (
                      <p className="text-xs opacity-80">
                        {format(message.timestamp, "HH:mm")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t bg-background/80 backdrop-blur-sm"
      >
        <div className="flex gap-2 max-w-screen-lg mx-auto">
          <Input
            ref={inputRef}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
