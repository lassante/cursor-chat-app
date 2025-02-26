"use client";

import { AuthTabs } from "@/components/auth/AuthTabs";
import { Card } from "@/components/ui/card";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { useStore } from "@/store/useStore";

export default function Home() {
  const { loading } = useStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-purple-950/50 dark:via-purple-900/30 dark:to-fuchsia-950/50">
      <Card className="w-full max-w-4xl bg-white/80 dark:bg-black/[0.96] backdrop-blur-xl relative overflow-hidden border-neutral-200/20">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="rgba(120, 119, 198, 0.3)"
          size={400}
        />

        <div className="flex flex-col md:flex-row min-h-[500px]">
          {/* Left content */}
          <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-950 to-neutral-600 dark:from-neutral-50 dark:to-neutral-400 mb-8">
              Welcome to Chatly
            </h1>
            <AuthTabs />
          </div>

          {/* Right content */}
          <div className="flex-1 relative hidden md:block">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
