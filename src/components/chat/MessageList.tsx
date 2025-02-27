import { ChatUser } from "@/types/chat";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useStore } from "@/store/useStore";
import { useScrollToBottom } from "@/hooks/useScrollToBottom";
import { useEffect } from "react";
import { UserAvatar } from "@/components/ui/user-avatar";

interface MessageListProps {
  selectedUser: ChatUser;
}

export const MessageList = ({ selectedUser }: MessageListProps) => {
  const { user, messages } = useStore();
  const { ref, scrollToBottom } = useScrollToBottom();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
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
                <UserAvatar user={selectedUser} className="mb-2" />
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
        <div ref={ref} />
      </div>
    </div>
  );
};
