"use client";

import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  // Don't render anything while loading or if user is not authenticated
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return <MainLayout>{children}</MainLayout>;
}
