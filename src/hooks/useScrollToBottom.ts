import { useRef } from "react";

export const useScrollToBottom = () => {
  const ref = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return { scrollToBottom, ref };
};
