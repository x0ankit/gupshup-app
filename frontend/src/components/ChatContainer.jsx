import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto relative">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>

            <div className="chat-header mb-1">
              {/* Header empty */}
            </div>

            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] md:max-w-[300px] rounded-md mb-2 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedImg(message.image)}
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>

            {/* ✅ FIXED: Single Footer for Time AND Status */}
            <div className="chat-footer mb-1">
                <span className="text-xs opacity-50 text-base-content/70 mr-1">
                    {formatMessageTime(message.createdAt)}
                </span>

                {/* Status Logic */}
                {index === messages.length - 1 && message.senderId === authUser._id && (
                    <span className="text-xs">
                        {message.isRead ? (
                        <span className="text-blue-500 font-medium">Seen</span>
                        ) : (
                        <span className="text-zinc-500">Delivered</span>
                        )}
                    </span>
                )}
            </div>
            
          </div>
        ))}
      </div>

      <MessageInput />

      {selectedImg && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImg(null)}
        >
          <button
            className="absolute top-5 right-5 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
            onClick={() => setSelectedImg(null)}
          >
            <X size={30} />
          </button>

          <img
            src={selectedImg}
            alt="Full screen view"
            className="max-w-full max-h-full rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
export default ChatContainer;