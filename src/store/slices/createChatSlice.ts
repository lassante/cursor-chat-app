import { StateCreator } from "zustand";
import { Message } from "@/types/chat";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { StoreState } from "../useStore";
import { toast } from "sonner";

export interface ChatSlice {
  selectedChatId: string | null;
  messages: Message[];
  pinnedChats: string[];
  activeChats: string[];
  unreadMessages: Record<string, number>;
  setSelectedChatId: (userId: string | null) => void;
  setMessages: (messages: Message[]) => void;
  subscribeToMessages: (
    currentUserId: string,
    selectedUserId: string
  ) => () => void;
  sendMessage: (
    senderId: string,
    receiverId: string,
    text: string
  ) => Promise<void>;
  togglePinnedChat: (chatId: string) => Promise<void>;
  subscribeToActiveChats: (userId: string) => () => void;
  addActiveChat: (chatId: string) => Promise<void>;
  removeChat: (chatId: string) => Promise<void>;
  markChatAsRead: (chatId: string) => void;
  subscribeToAllMessages: (currentUserId: string) => () => void;
}

export const createChatSlice: StateCreator<StoreState, [], [], ChatSlice> = (
  set,
  get
) => ({
  selectedChatId: null,
  messages: [],
  pinnedChats: [],
  activeChats: [],
  unreadMessages: {},
  setSelectedChatId: (userId) => {
    set({ selectedChatId: userId });
    if (userId) {
      get().markChatAsRead(userId);
    }
  },
  setMessages: (messages) => set({ messages }),
  subscribeToMessages: (currentUserId, selectedUserId) => {
    const chatId = [currentUserId, selectedUserId].sort().join("_");

    const q = query(
      collection(db, "messages"),
      where("chatId", "==", chatId),
      orderBy("timestamp", "asc")
    );

    // Subscribe to messages
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
      })) as Message[];
      set({ messages });
    });
  },
  subscribeToAllMessages: (currentUserId) => {
    // Subscribe to all messages where the user is the receiver
    const q = query(
      collection(db, "messages"),
      where("receiverId", "==", currentUserId),
      orderBy("timestamp", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          const message = change.doc.data() as Message;
          const { selectedChatId, unreadMessages, activeChats, addActiveChat } =
            get();

          // If the sender is not in active chats, add them
          if (!activeChats.includes(message.senderId)) {
            await addActiveChat(message.senderId);
          }

          // Only count as unread if it's a new message and not from the currently selected chat
          if (
            message.senderId !== currentUserId &&
            message.senderId !== selectedChatId &&
            change.doc.data().timestamp?.toDate() > new Date(Date.now() - 1000)
          ) {
            const senderId = message.senderId;
            const currentCount = unreadMessages[senderId] || 0;

            set({
              unreadMessages: {
                ...unreadMessages,
                [senderId]: currentCount + 1,
              },
            });

            // Show toast notification
            const sender = (get() as StoreState).users.find(
              (u) => u.id === senderId
            );
            if (sender) {
              toast(`New message from ${sender.name}`, {
                description: message.text,
                action: {
                  label: "View",
                  onClick: () => get().setSelectedChatId(senderId),
                },
              });
            }
          }
        }
      });
    });
  },
  subscribeToActiveChats: (userId: string) => {
    // Subscribe to user document to get active chats
    const unsubscribe = onSnapshot(doc(db, "users", userId), (doc) => {
      const data = doc.data();
      set({
        activeChats: data?.activeChats || [],
        pinnedChats: data?.pinnedChats || [],
      });
    });

    // Return unsubscribe function
    return unsubscribe;
  },
  markChatAsRead: (chatId: string) => {
    const { unreadMessages } = get();
    if (unreadMessages[chatId]) {
      set({
        unreadMessages: {
          ...unreadMessages,
          [chatId]: 0,
        },
      });
    }
  },
  addActiveChat: async (chatId: string) => {
    const { activeChats } = get();
    const user = (get() as StoreState).user;
    if (!user) return;

    if (!activeChats.includes(chatId)) {
      const newActiveChats = [...activeChats, chatId];

      await updateDoc(doc(db, "users", user.uid), {
        activeChats: newActiveChats,
      });

      set({ activeChats: newActiveChats });
    }
  },
  removeChat: async (chatId: string) => {
    const { activeChats, pinnedChats, selectedChatId, unreadMessages } = get();
    const user = (get() as StoreState).user;
    if (!user) return;

    const newActiveChats = activeChats.filter((id) => id !== chatId);
    const newPinnedChats = pinnedChats.filter((id) => id !== chatId);

    const newUnreadMessages = { ...unreadMessages };
    delete newUnreadMessages[chatId];

    await updateDoc(doc(db, "users", user.uid), {
      activeChats: newActiveChats,
      pinnedChats: newPinnedChats,
    });

    // If the removed chat was selected, clear the selection
    if (selectedChatId === chatId) {
      set({ selectedChatId: null });
    }

    set({
      activeChats: newActiveChats,
      pinnedChats: newPinnedChats,
      unreadMessages: newUnreadMessages,
    });
  },
  sendMessage: async (senderId, receiverId, text) => {
    const chatId = [senderId, receiverId].sort().join("_");
    await addDoc(collection(db, "messages"), {
      text,
      senderId,
      receiverId,
      chatId,
      timestamp: serverTimestamp(),
    });
  },
  togglePinnedChat: async (chatId: string) => {
    const { pinnedChats } = get();
    const user = (get() as StoreState).user;
    if (!user) return;

    const newPinnedChats = pinnedChats.includes(chatId)
      ? pinnedChats.filter((id) => id !== chatId)
      : [...pinnedChats, chatId];

    await updateDoc(doc(db, "users", user.uid), {
      pinnedChats: newPinnedChats,
    });

    set({ pinnedChats: newPinnedChats });
  },
});
