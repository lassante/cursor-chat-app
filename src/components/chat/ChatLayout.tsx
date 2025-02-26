import { useStore } from "@/store/useStore";
import { MessagesPanel } from "./MessagesPanel";
import { ChatArea } from "./ChatArea";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const ChatLayout = () => {
  const { user } = useStore();
  const [showPanel, setShowPanel] = useState(false);

  if (!user) return null;

  return (
    <div className="flex h-full relative">
      {/* Main Chat Area */}
      <div className="flex-1 min-w-0 relative">
        <ChatArea />

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 lg:hidden z-50"
          onClick={() => setShowPanel(!showPanel)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages Panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 lg:relative w-full max-w-sm lg:max-w-[320px] transform transition-transform duration-200 ease-in-out bg-background/80 backdrop-blur-xl lg:translate-x-0 z-40 border-l border-border/40",
          showPanel ? "translate-x-0" : "translate-x-full"
        )}
      >
        <MessagesPanel />
      </div>

      {/* Backdrop for mobile */}
      {showPanel && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setShowPanel(false)}
        />
      )}
    </div>
  );
};
