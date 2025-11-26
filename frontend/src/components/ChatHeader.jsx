import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useState } from "react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, isTyping } = useChatStore(); // 1. Get isTyping
  const { onlineUsers } = useAuthStore();
  const [selectedUserImg, setSelectedUserImg] = useState(null);

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img 
                src={selectedUser.profilePic || "/avatar.png"} 
                alt={selectedUser.fullName} 
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setSelectedUserImg(selectedUser.profilePic || "/avatar.png")}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {/* 2. Show Typing Indicator if active, otherwise show Online status */}
              {isTyping ? (
                <span className="text-emerald-500 font-medium animate-pulse">Typing...</span>
              ) : (
                onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"
              )}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>

      {/* FULL SCREEN PROFILE MODAL */}
      {selectedUserImg && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedUserImg(null)}
        >
          <div className="relative">
             {/* Close Button */}
             <button
              onClick={() => setSelectedUserImg(null)}
              className="absolute -top-12 right-0 text-white bg-black/40 rounded-full p-2 hover:bg-black/60 transition-colors z-50"
            >
              <X className="size-6" />
            </button>
            
            <img 
              src={selectedUserImg} 
              alt="Profile" 
              className="size-64 lg:size-80 rounded-full border-4 border-base-100 shadow-2xl object-cover transition-transform duration-300"
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatHeader;