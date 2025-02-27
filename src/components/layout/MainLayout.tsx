"use client";

import { MessageSquare, LogOut, Menu } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useStore();
  const pathname = usePathname();
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="flex h-screen bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-950/50 dark:via-purple-900/30 dark:to-fuchsia-950/50">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 lg:hidden z-50"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 lg:relative w-[280px] bg-background/60 dark:bg-background/40 backdrop-blur-xl border-r border-border/40 p-4 flex flex-col transform transition-transform duration-200 ease-in-out lg:translate-x-0 z-40",
          showSidebar ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between mb-8 pl-10 lg:pl-0">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-semibold">AI</span>
            </div>
            <span className="font-semibold text-xl">Chatly</span>
          </div>
          <ThemeToggle />
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <Link
            href="/messages"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              pathname === "/messages"
                ? "bg-primary/10 text-primary hover:bg-primary/15"
                : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
            }`}
            onClick={() => setShowSidebar(false)}
          >
            <MessageSquare className="h-5 w-5" />
            <span>Messages</span>
          </Link>
        </nav>

        {/* User Profile */}
        <div className="border-t border-border/40 pt-4 mt-4">
          <div className="flex items-center gap-3 px-3">
            <Avatar>
              <AvatarImage src={user?.photoURL || undefined} />
              <AvatarFallback>
                {user?.displayName?.charAt(0) || user?.email?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.displayName || user?.email?.split("@")[0]}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 relative lg:ml-0">{children}</div>

      {/* Backdrop for mobile */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
};
