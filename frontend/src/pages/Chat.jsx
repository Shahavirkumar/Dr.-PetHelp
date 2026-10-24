import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Send, Trash2, AlertCircle } from "lucide-react";
import ChatBubble from "../components/ChatBubble";
import TypingIndicator from "../components/TypingIndicator";
import SuggestedQuestions from "../components/SuggestedQuestions";
import { useChat } from "../hooks/useChat";
import { useAutoScroll } from "../hooks/useAutoScroll";

export default function Chat() {
  const { id: routeConversationId } = useParams();
  const [input, setInput] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(Boolean(routeConversationId));

  const {
    messages,
    loading,
    error,
    sendMessage,
    openConversation,
    startNewConversation,
  } = useChat();

  const bottomRef = useAutoScroll([messages, loading]);

  // Load existing conversation if navigated to /chat/:id, otherwise start fresh
  useEffect(() => {
    (async () => {
      if (routeConversationId) {
        await openConversation(routeConversationId);
      } else {
        startNewConversation();
      }
      setLoadingHistory(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeConversationId]);

  const handleSend = (text) => {
    const content = text ?? input;
    if (!content.trim() || loading) return;
    setInput("");
    sendMessage(content /*, activePetId — wire up once a pet selector exists */);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loadingHistory) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] text-sm text-[#4A554E]">
        Loading conversation...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#FAF8F3]">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#2F6F5E]/10 bg-white">
        <h1 className="font-[Fraunces,serif] font-semibold text-lg">Chat with PetHelp AI</h1>
        <button
          onClick={startNewConversation}
          className="flex items-center gap-1.5 text-sm text-[#4A554E] hover:text-[#C05B2D]"
        >
          <Trash2 className="w-4 h-4" />
          Clear chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 max-w-3xl w-full mx-auto">
        {messages.length === 0 ? (
          <SuggestedQuestions onSelect={handleSend} />
        ) : (
          messages.map((m, i) => <ChatBubble key={i} message={m} />)
        )}
        {loading && <TypingIndicator />}
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mt-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-[#2F6F5E]/10 bg-white px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-end gap-3">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about diet, symptoms, grooming..."
            className="flex-1 resize-none border border-[#2F6F5E]/15 rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#2F6F5E] max-h-32"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="w-11 h-11 shrink-0 rounded-full bg-[#2F6F5E] text-white flex items-center justify-center hover:bg-[#255A4B] disabled:opacity-50"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}