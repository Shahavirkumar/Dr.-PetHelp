import api from "./api";

const TOKEN_KEY = "petHelpToken";

const authService = {
  async register({ name, email, password }) {
    const { data } = await api.post("/auth/register", { name, email, password });
    if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
    return data;
  },

  async login({ email, password }) {
    const { data } = await api.post("/auth/login", { email, password });
    if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
    return data;
  },

  async getCurrentUser() {
    const { data } = await api.get("/auth/me");
    return data;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
  },

  isAuthenticated() {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  },
};

export default authService;