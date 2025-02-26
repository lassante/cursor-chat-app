import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ChatUser } from "@/types/chat";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { getNameGradient } from "@/lib/helpers";

interface NewChatDialogProps {
  children?: React.ReactNode;
}

export const NewChatDialog = ({ children }: NewChatDialogProps) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { users, setSelectedChatId, addActiveChat } = useStore();

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const startChat = async (user: ChatUser) => {
    await addActiveChat(user.id);
    setSelectedChatId(user.id);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="w-full">
            Start New Chat
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a New Chat</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {filteredUsers.map((user) => (
            <Button
              key={user.id}
              variant="ghost"
              className="w-full justify-start p-2 h-auto"
              onClick={() => startChat(user)}
            >
              <div className="flex items-center space-x-3">
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
                <div className="flex flex-col items-start">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
                {user.isOnline && (
                  <div className="w-2 h-2 bg-green-500 rounded-full ml-auto" />
                )}
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
