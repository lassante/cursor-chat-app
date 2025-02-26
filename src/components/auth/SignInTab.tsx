"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/store/useStore";
import { useState } from "react";

export const SignInTab = () => {
  const { signInWithEmail } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await signInWithEmail(email, password);
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="grid gap-2">
        <div className="grid gap-1">
          <Label
            htmlFor="email"
            className="text-neutral-800 dark:text-neutral-300"
          >
            Email
          </Label>
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            name="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            className="bg-white border-neutral-200 focus-visible:ring-neutral-400 dark:bg-background/60 dark:hover:bg-background/80 dark:border-white/10 dark:focus-visible:ring-primary/50"
          />
        </div>

        <div className="grid gap-1">
          <Label
            htmlFor="password"
            className="text-neutral-800 dark:text-neutral-300"
          >
            Password
          </Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            name="password"
            disabled={isLoading}
            className="bg-white border-neutral-200 focus-visible:ring-neutral-400 dark:bg-background/60 dark:hover:bg-background/80 dark:border-white/10 dark:focus-visible:ring-primary/50"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="bg-primary/10 hover:bg-primary/20 text-primary dark:bg-primary/20 dark:hover:bg-primary/30 dark:text-primary-foreground"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </div>
    </form>
  );
};
