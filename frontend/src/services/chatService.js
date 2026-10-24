import api from "./api";

const chatService = {
  /**
   * Send a message to PetHelp AI.
   * conversationId is optional — omit it to start a new conversation.
   */
  async sendMessage({ message, petId, conversationId }) {
    const { data } = await api.post("/chat", {
      message,
      pet_id: petId || null,
      conversation_id: conversationId || null,
    });
    return data; // { conversation_id, reply, is_emergency }
  },

  async getAllConversations() {
    const { data } = await api.get("/chats");
    return data;
  },

  async getConversationById(id) {
    const { data } = await api.get(`/chats/${id}`);
    return data;
  },

  async deleteConversation(id) {
    const { data } = await api.delete(`/chats/${id}`);
    return data;
  },

  async renameConversation(id, title) {
    const { data } = await api.put(`/chats/${id}`, { title });
    return data;
  },
};

export default chatService;