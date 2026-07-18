import api from "./api";

const CHAT_BASE = "/chat";

const chatServices = {
  searchUsers: async (query) => {
    const { data } = await api.get(`${CHAT_BASE}/search/`, {
      params: { q: query },
    });
    return data;
  },

  getConversationList: async () => {
    const { data } = await api.get(`${CHAT_BASE}/conversations/`);
    return data;
  },

  startConversation: async (mobileNumber) => {
    const { data } = await api.post(`${CHAT_BASE}/conversations/`, {
      mobile_number: mobileNumber,
    });
    return data;
  },

  getMessages: async (conversationId) => {
    const { data } = await api.get(
      `${CHAT_BASE}/conversations/${conversationId}/messages/`
    );
    return data;
  },

  // --- NEW: Backend Full History Message Search Endpoint ---
  searchMessages: async (conversationId, textQuery, dateQuery) => {
    const params = {};
    if (textQuery) params.q = textQuery;
    if (dateQuery) params.date = dateQuery;

    const { data } = await api.get(
      `${CHAT_BASE}/conversations/${conversationId}/search_messages/`,
      { params }
    );
    return data;
  },
};

export default chatServices;