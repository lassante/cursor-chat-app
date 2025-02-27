import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatUser } from "@/types/chat";
import { cn } from "@/lib/utils";
import { getNameGradient } from "@/lib/helpers";

interface UserAvatarProps {
  user: ChatUser;
  className?: string;
}

export const UserAvatar = ({ user, className }: UserAvatarProps) => {
  return (
    <Avatar className={className}>
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
  );
};
