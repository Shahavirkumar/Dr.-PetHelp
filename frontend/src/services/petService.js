import api from "./api";

const petService = {
  async getAllPets() {
    const { data } = await api.get("/pets");
    return data;
  },

  async getPetById(id) {
    const { data } = await api.get(`/pets/${id}`);
    return data;
  },

  async createPet(petData) {
    const { data } = await api.post("/pets", petData);
    return data;
  },

  async updatePet(id, petData) {
    const { data } = await api.put(`/pets/${id}`, petData);
    return data;
  },

  async deletePet(id) {
    const { data } = await api.delete(`/pets/${id}`);
    return data;
  },
};

export default petService;