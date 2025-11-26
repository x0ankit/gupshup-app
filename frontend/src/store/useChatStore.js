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
  unreadMessages: [], // ✅ ADDED: State for unread messages

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

    socket.on("newMessage", (newMessage) => {
      const { selectedUser } = get();
      
      // Check if the new message is from the user we are currently chatting with
      const isMessageSentFromSelectedUser = selectedUser?._id === newMessage.senderId;

      if (isMessageSentFromSelectedUser) {
        // 1. If chat is open, add it to the messages list
        set({
          messages: [...get().messages, newMessage],
        });

        // 2. Mark as read immediately since we are looking at it
        const currentUserId = useAuthStore.getState().authUser._id;
        socket.emit("markMessagesAsRead", {
          senderId: selectedUser._id,
          receiverId: currentUserId,
        });
      } else {
        // 3. ✅ If chat is closed, add to unread messages
        set({
          unreadMessages: [...get().unreadMessages, newMessage],
        });
      }
    });

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

    socket.on("messagesMarkedAsRead", ({ receiverId }) => {
      const { selectedUser } = get();
      if (selectedUser && selectedUser._id === receiverId) {
        set({
          messages: get().messages.map((message) => ({ ...message, isRead: true })),
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
    set({ selectedUser });
    
    // ✅ Updated: When opening a chat, clear unread messages for that user
    if (selectedUser) {
      const { unreadMessages } = get();
      
      // Keep only messages that are NOT from the selected user
      set({
        unreadMessages: unreadMessages.filter(
            (msg) => msg.senderId !== selectedUser._id
        )
      });

      // Mark messages as read in DB
      const socket = useAuthStore.getState().socket;
      const currentUserId = useAuthStore.getState().authUser._id;
      
      socket.emit("markMessagesAsRead", {
        senderId: selectedUser._id,
        receiverId: currentUserId,
      });
    }
  },
}));