import { useRef } from "react";
import { useStore } from "@/store/useStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export const MessageInput = () => {
  const { user, selectedChatId, sendMessage } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
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
  );
};
