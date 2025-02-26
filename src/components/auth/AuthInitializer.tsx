"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";

export const AuthInitializer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const initialize = useStore((state) => state.initialize);

  const { user, loading } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push("/messages");
    }

    if (!user && !loading) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const unsubscribe = initialize();
    return () => unsubscribe();
  }, [initialize]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return <>{children}</>;
};
