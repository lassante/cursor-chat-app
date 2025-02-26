import { create } from "zustand";
import { createAuthSlice, AuthSlice } from "./slices/createAuthSlice";
import { createChatSlice, ChatSlice } from "./slices/createChatSlice";

export type StoreState = AuthSlice & ChatSlice;

export const useStore = create<StoreState>()((...a) => ({
  ...createAuthSlice(...a),
  ...createChatSlice(...a),
}));
