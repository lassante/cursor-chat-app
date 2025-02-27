"use client";

import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.replace("/messages");
    }
  }, [user, loading, router]);

  // Don't render anything while loading or if user is authenticated
  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-purple-950/50 dark:via-purple-900/30 dark:to-fuchsia-950/50">
      {children}
    </div>
  );
}
