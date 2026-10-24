import { PawPrint, User, AlertTriangle } from "lucide-react";

/**
 * message = { role: "user" | "ai", content: string, isEmergency?: boolean }
 */
export default function ChatBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${
          isUser ? "bg-[#3A6EA5]" : "bg-[#2F6F5E]"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <PawPrint className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-[#3A6EA5] text-white rounded-tr-sm"
            : "bg-white text-[#1F2A24] border border-[#2F6F5E]/10 rounded-tl-sm shadow-sm"
        }`}
      >
        {message.isEmergency && !isUser && (
          <div className="flex items-center gap-2 mb-2 text-[#C05B2D] font-semibold text-xs">
            <AlertTriangle className="w-4 h-4" />
            Seek immediate veterinary care
          </div>
        )}
        {message.content}
      </div>
    </div>
  );
}