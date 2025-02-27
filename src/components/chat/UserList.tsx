import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChatUser } from "@/types/chat";
import { NewChatDialog } from "./NewChatDialog";
import { useStore } from "@/store/useStore";
import { Pin, PinOff, Search, UserPlus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { getNameGradient } from "@/lib/helpers";
import { Skeleton } from "@/components/ui/skeleton";

export const UserList = () => {
  const { users, pinnedChats, activeChats, loading } = useStore();
  const [search, setSearch] = useState("");

  const filterUsers = (userList: ChatUser[]) => {
    return userList.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );
  };

  // Filter users to only show active chats
  const activeUsers = users.filter((u) => activeChats.includes(u.id));
  const pinnedUsers = filterUsers(
    activeUsers.filter((user) => pinnedChats.includes(user.id))
  );
  const unpinnedUsers = filterUsers(
    activeUsers.filter((user) => !pinnedChats.includes(user.id))
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">Messages</h2>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <NewChatDialog>
          <Button variant="ghost" size="icon" className="shrink-0">
            <UserPlus className="h-5 w-5" />
          </Button>
        </NewChatDialog>
      </div>

      {loading ? (
        <div className="space-y-3 mt-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <LoadingChatItem key={i} />
          ))}
        </div>
      ) : (
        <>
          {pinnedUsers.length > 0 && (
            <div className="space-y-2 mt-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Pinned Chats
              </h3>
              {pinnedUsers.map((user) => (
                <ChatItem key={user.id} user={user} isPinned={true} />
              ))}
            </div>
          )}

          <div className="space-y-2 mt-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              All Chats
            </h3>
            {unpinnedUsers.map((user) => (
              <ChatItem key={user.id} user={user} isPinned={false} />
            ))}
            {unpinnedUsers.length === 0 && activeUsers.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No chats yet. Start a new chat to begin messaging.
              </p>
            )}
            {unpinnedUsers.length === 0 && activeUsers.length > 0 && search && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No chats found
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const LoadingChatItem = () => {
  return (
    <div className="flex items-stretch rounded-md overflow-hidden group bg-secondary/50">
      <div className="flex-1 justify-start p-2 h-auto rounded-none">
        <div className="flex items-center space-x-3 w-full">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex flex-col items-start flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </div>
    </div>
  );
};

interface ChatItemProps {
  user: ChatUser;
  isPinned: boolean;
}

const ChatItem = ({ user, isPinned }: ChatItemProps) => {
  const {
    selectedChatId,
    setSelectedChatId,
    togglePinnedChat,
    removeChat,
    unreadMessages,
  } = useStore();

  const isSelected = selectedChatId === user.id;
  const unreadCount = unreadMessages[user.id] || 0;

  return (
    <div
      className={cn(
        "flex items-stretch rounded-md overflow-hidden group",
        isSelected ? "bg-secondary" : "hover:bg-secondary"
      )}
    >
      <Button
        variant={isSelected ? "secondary" : "ghost"}
        className="flex-1 justify-start p-2 h-auto rounded-none hover:bg-transparent"
        onClick={() => setSelectedChatId(user.id)}
      >
        <div className="flex items-center space-x-3 w-full">
          <Avatar>
            <AvatarImage src={user.photoURL} />
            <AvatarFallback
              className={cn(
                "bg-gradient-to-br text-white",
                getNameGradient(user.name)
              )}
            >
              {user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start flex-1">
            <span className="font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">
              {user.isOnline ? "Online" : "Offline"}
            </span>
          </div>
          {user.isOnline && (
            <div className="w-2 h-2 bg-green-500 rounded-full" />
          )}
          {unreadCount > 0 && (
            <div className="min-w-[1.5rem] h-6 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
              {unreadCount}
            </div>
          )}
        </div>
      </Button>

      <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant={isSelected ? "secondary" : "ghost"}
          size="icon"
          className="rounded-none h-auto px-2 hover:bg-transparent"
          onClick={() => togglePinnedChat(user.id)}
        >
          {isPinned ? (
            <PinOff className="h-4 w-4" />
          ) : (
            <Pin className="h-4 w-4" />
          )}
        </Button>

        <Button
          variant={isSelected ? "secondary" : "ghost"}
          size="icon"
          className="rounded-none h-auto px-2 text-destructive hover:text-destructive hover:bg-transparent"
          onClick={() => removeChat(user.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
