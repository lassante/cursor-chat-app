"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";

export const AuthInitializer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const initialize = useStore((state) => state.initialize);

  useEffect(() => {
    const unsubscribe = initialize();
    return () => unsubscribe();
  }, [initialize]);

  return <>{children}</>;
};
