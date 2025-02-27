import { ChatUser } from "@/types/chat";
import { UserAvatar } from "@/components/ui/user-avatar";

interface ChatHeaderProps {
  user: ChatUser;
}

export const ChatHeader = ({ user }: ChatHeaderProps) => {
  return (
    <div className="p-4 border-b bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-3 max-w-screen-lg mx-auto pl-12 lg:pl-0">
        <UserAvatar user={user} />
        <div>
          <h2 className="font-semibold">{user.name}</h2>
          <p className="text-sm text-muted-foreground">
            {user.isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>
    </div>
  );
};
