import { createContext, useContext, useState, useCallback } from "react";
import chatService from "../services/chatService";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [error, setError] = useState("");

  const loadConversations = useCallback(async () => {
    setLoadingConversations(true);
    setError("");
    try {
      const data = await chatService.getAllConversations();
      setConversations(data);
    } catch (err) {
      setError(err.friendlyMessage || "Could not load conversation history.");
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  const openConversation = useCallback(async (conversationId) => {
    setLoading(true);
    setError("");
    try {
      const data = await chatService.getConversationById(conversationId);
      setMessages(data.messages || []);
      setActiveConversationId(conversationId);
    } catch (err) {
      setError(err.friendlyMessage || "Could not load this conversation.");
    } finally {
      setLoading(false);
    }
  }, []);

  const startNewConversation = useCallback(() => {
    setActiveConversationId(null);
    setMessages([]);
    setError("");
  }, []);

  const sendMessage = useCallback(
    async (content, petId) => {
      if (!content.trim()) return;

      setError("");
      setMessages((prev) => [...prev, { role: "user", content }]);
      setLoading(true);

      try {
        const res = await chatService.sendMessage({
          message: content,
          petId,
          conversationId: activeConversationId,
        });

        if (!activeConversationId && res.conversation_id) {
          setActiveConversationId(res.conversation_id);
          loadConversations();
        }

        setMessages((prev) => [
          ...prev,
          { role: "ai", content: res.reply, isEmergency: res.is_emergency },
        ]);
      } catch (err) {
        setError(err.friendlyMessage || "Something went wrong while reaching PetHelp AI.");
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setLoading(false);
      }
    },
    [activeConversationId, loadConversations]
  );

  const deleteConversation = useCallback(
    async (conversationId) => {
      try {
        await chatService.deleteConversation(conversationId);
        setConversations((prev) => prev.filter((c) => c.id !== conversationId));
        if (activeConversationId === conversationId) {
          startNewConversation();
        }
      } catch (err) {
        setError(err.friendlyMessage || "Could not delete this conversation.");
      }
    },
    [activeConversationId, startNewConversation]
  );

  const renameConversation = useCallback(async (conversationId, title) => {
    try {
      await chatService.renameConversation(conversationId, title);
      setConversations((prev) =>
        prev.map((c) => (c.id === conversationId ? { ...c, title } : c))
      );
    } catch (err) {
      setError(err.friendlyMessage || "Could not rename this conversation.");
    }
  }, []);

  const clearChat = useCallback(() => {
    startNewConversation();
  }, [startNewConversation]);

  const value = {
    conversations,
    activeConversationId,
    messages,
    loading,
    loadingConversations,
    error,
    loadConversations,
    openConversation,
    startNewConversation,
    sendMessage,
    deleteConversation,
    renameConversation,
    clearChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}