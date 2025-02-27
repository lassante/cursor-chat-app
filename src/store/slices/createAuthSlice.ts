import { StateCreator } from "zustand";
import { User } from "firebase/auth";
import {
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  signInWithRedirect,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  AuthErrorCodes,
} from "firebase/auth";
import { FirebaseError } from "@firebase/app";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  doc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { ChatUser } from "@/types/chat";
import { StoreState } from "../useStore";

export interface AuthSlice {
  user: User | null;
  users: ChatUser[];
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => () => void;
  updateUserStatus: (user: User | null, isOnline: boolean) => Promise<void>;
  subscribeToUsers: (currentUser: User) => () => void;
}

export const createAuthSlice: StateCreator<StoreState, [], [], AuthSlice> = (
  set,
  get
) => ({
  user: null,
  users: [],
  loading: true,
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  updateUserStatus: async (user, isOnline) => {
    if (!user) return;

    await updateDoc(doc(db, "users", user.uid), {
      isOnline,
      lastSeen: serverTimestamp(),
    });
  },
  subscribeToUsers: (currentUser) => {
    const q = query(
      collection(db, "users"),
      where("email", "!=", currentUser.email)
    );

    return onSnapshot(q, (snapshot) => {
      const usersList = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || "Unknown",
          email: data.email || "",
          photoURL: data.photoURL || "",
          isOnline: data.isOnline || false,
          lastSeen: data.lastSeen?.toDate() || new Date(),
        } as ChatUser;
      });

      set({ users: usersList });
    });
  },
  signInWithGoogle: async () => {
    set({ error: null });
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === AuthErrorCodes.POPUP_BLOCKED) {
          try {
            await signInWithRedirect(auth, provider);
          } catch (redirectError) {
            set({
              error:
                "Failed to sign in. Please check your popup blocker settings.",
            });
            console.error("Error signing in with redirect:", redirectError);
          }
        } else {
          set({ error: "Failed to sign in. Please try again." });
          console.error("Error signing in:", error);
        }
      }
    }
  },
  signInWithEmail: async (email: string, password: string) => {
    set({ error: null });
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case AuthErrorCodes.USER_DELETED:
          case AuthErrorCodes.INVALID_PASSWORD:
            set({ error: "Invalid email or password" });
            break;
          default:
            set({ error: "Failed to sign in. Please try again." });
        }
        console.error("Error signing in with email:", error);
      }
    }
  },
  signUpWithEmail: async (email: string, password: string) => {
    set({ error: null });
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case AuthErrorCodes.EMAIL_EXISTS:
            set({ error: "Email already in use" });
            break;
          case AuthErrorCodes.WEAK_PASSWORD:
            set({ error: "Password should be at least 6 characters" });
            break;
          default:
            set({ error: "Failed to create account. Please try again." });
        }
        console.error("Error creating account:", error);
      }
    }
  },
  logout: async () => {
    const { user, updateUserStatus } = get();
    try {
      if (user) {
        await updateUserStatus(user, false);
      }
      await signOut(auth);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  },

  initialize: () => {
    const {
      updateUserStatus,
      subscribeToUsers,
      subscribeToActiveChats,
      subscribeToAllMessages,
    } = get();
    let userUnsubscribe: (() => void) | null = null;
    let messagesUnsubscribe: (() => void) | null = null;
    let activeChatsUnsubscribe: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      set({ user, loading: false });

      if (user) {
        await updateUserStatus(user, true);
        activeChatsUnsubscribe = subscribeToActiveChats(user.uid);
        userUnsubscribe = subscribeToUsers(user);
        messagesUnsubscribe = subscribeToAllMessages(user.uid);
      } else {
        if (userUnsubscribe) {
          userUnsubscribe();
          userUnsubscribe = null;
        }
        if (messagesUnsubscribe) {
          messagesUnsubscribe();
          messagesUnsubscribe = null;
        }
        if (activeChatsUnsubscribe) {
          activeChatsUnsubscribe();
          activeChatsUnsubscribe = null;
        }
      }
    });

    return () => {
      unsubscribe();
      if (userUnsubscribe) userUnsubscribe();
      if (messagesUnsubscribe) messagesUnsubscribe();
      if (activeChatsUnsubscribe) activeChatsUnsubscribe();
    };
  },
});
