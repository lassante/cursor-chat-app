"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { ChatUser } from "@/types/chat";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { EmptyChat } from "./EmptyChat";

export const ChatArea = () => {
  const { user, users, selectedChatId, subscribeToMessages } = useStore();

  const selectedUser = users.find((u: ChatUser) => u.id === selectedChatId);

  useEffect(() => {
    if (!user || !selectedChatId) return;

    const unsubscribe = subscribeToMessages(user.uid, selectedChatId);
    return () => unsubscribe();
  }, [user, selectedChatId, subscribeToMessages]);

  if (!selectedUser) {
    return <EmptyChat />;
  }

  return (
    <div className="h-full flex flex-col">
      <ChatHeader user={selectedUser} />
      <MessageList selectedUser={selectedUser} />
      <MessageInput />
    </div>
  );
};
