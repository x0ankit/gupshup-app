import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isTyping: false,
  unreadMessages: [],

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // Prevent duplicate listeners
    socket.off("newMessage");
    socket.off("typing");
    socket.off("stopTyping");
    socket.off("messagesMarkedAsRead");

    // 1. Listen for new messages
    socket.on("newMessage", (newMessage) => {
      const { selectedUser, messages, unreadMessages } = get();
      const isMessageForCurrentChat = selectedUser?._id === newMessage.senderId;

      if (isMessageForCurrentChat) {
        // If chat is open, add to message list
        set({
          messages: [...messages, newMessage],
        });
        
        // Mark as read immediately
        const currentUserId = useAuthStore.getState().authUser._id;
        socket.emit("markMessagesAsRead", {
          senderId: selectedUser._id,
          receiverId: currentUserId,
        });
      } else {
        // If chat is closed, add to unread count
        set({
          unreadMessages: [...unreadMessages, newMessage],
        });
        
        // Play sound
        try {
          const sound = new Audio("/notification.mp3");
          sound.play();
        } catch (error) {
          console.log("Sound error:", error);
        }
      }
    });

    // 2. Listen for Typing
    socket.on("typing", ({ senderId }) => {
      const { selectedUser } = get();
      if (selectedUser && selectedUser._id === senderId) {
        set({ isTyping: true });
      }
    });

    socket.on("stopTyping", ({ senderId }) => {
      const { selectedUser } = get();
      if (selectedUser && selectedUser._id === senderId) {
        set({ isTyping: false });
      }
    });

    // 3. Listen for Read Receipts
    socket.on("messagesMarkedAsRead", ({ receiverId }) => {
      const { selectedUser, messages } = get();
      if (selectedUser && selectedUser._id === receiverId) {
        set({
          messages: messages.map((message) => ({ ...message, isRead: true })),
        });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
    socket.off("typing");
    socket.off("stopTyping");
    socket.off("messagesMarkedAsRead");
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser, isTyping: false });
    
    // When opening a chat, clear unread messages
    if (selectedUser) {
      const { unreadMessages } = get();
      set({
        unreadMessages: unreadMessages.filter(
          (msg) => msg.senderId !== selectedUser._id
        ),
      });
    }
  },
}));