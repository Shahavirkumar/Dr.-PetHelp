import { PawPrint } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-4">
      <div className="w-8 h-8 shrink-0 rounded-full bg-[#2F6F5E] flex items-center justify-center">
        <PawPrint className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white border border-[#2F6F5E]/10 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-2">
        <span className="text-xs text-[#4A554E]">PetHelp AI is thinking</span>
        <span className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2F6F5E] animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#2F6F5E] animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#2F6F5E] animate-bounce" />
        </span>
      </div>
    </div>
  );
}