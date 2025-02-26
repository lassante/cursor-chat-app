export interface ChatUser {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  isOnline: boolean;
  lastSeen: Date;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
}
