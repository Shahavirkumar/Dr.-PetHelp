import api from "./api";

const recommendationService = {
  async getAll() {
    const { data } = await api.get("/recommendations");
    return data;
  },

  async save({ title, content, category, petId }) {
    const { data } = await api.post("/recommendations", {
      title,
      content,
      category,
      pet_id: petId || null,
    });
    return data;
  },

  async delete(id) {
    const { data } = await api.delete(`/recommendations/${id}`);
    return data;
  },
};

export default recommendationService;