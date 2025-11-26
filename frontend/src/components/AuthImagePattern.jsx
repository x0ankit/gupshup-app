import { useEffect, useState } from "react";

const AuthImagePattern = ({ title, subtitle }) => {
  // Mock chat messages for visual effect
  const messages = [
    { id: 1, text: "Hey! How's the project going?", isSent: false },
    { id: 2, text: "Almost done! Just fixing the UI.", isSent: true },
    { id: 3, text: "GupShup looks amazing so far! 🚀", isSent: false },
    { id: 4, text: "Thanks! Can't wait to deploy it.", isSent: true },
  ];

  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        
        {/* Animated Chat Preview */}
        <div className="relative w-full h-80 mb-8 bg-base-100 rounded-3xl shadow-xl overflow-hidden border border-base-300 p-4 flex flex-col justify-center space-y-4">
            
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
          
          {messages.map((msg, idx) => (
            <div
              key={msg.id}
              className={`flex ${msg.isSent ? "justify-end" : "justify-start"} animate-fade-in-up`}
              style={{ animationDelay: `${idx * 0.5}s` }} // Staggered animation
            >
              <div
                className={`
                  max-w-[80%] px-4 py-3 rounded-2xl shadow-sm
                  ${msg.isSent 
                    ? "bg-primary text-primary-content rounded-br-none" 
                    : "bg-base-200 text-base-content rounded-bl-none"}
                `}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}

          {/* Typing Indicator Mockup */}
          <div className="flex justify-start animate-pulse delay-[2000ms]">
             <div className="bg-base-200 px-4 py-3 rounded-2xl rounded-bl-none flex gap-1">
                <div className="w-2 h-2 bg-base-content/30 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-base-content/30 rounded-full animate-bounce delay-75" />
                <div className="w-2 h-2 bg-base-content/30 rounded-full animate-bounce delay-150" />
             </div>
          </div>
        </div>

        {/* Text Content */}
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;