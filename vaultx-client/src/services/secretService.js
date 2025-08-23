// src/services/secretService.js
import API from "../utils/api";

export const listSecrets = async () => {
  const res = await API.get("/secrets");
  return res.data;
};

export const createSecret = async (title, data) => {
  const res = await API.post("/secrets", { title, data });
  return res.data;
};

export const updateSecret = async (id, title, data) => {
  const res = await API.put(`/secrets/${id}`, { title, data });
  return res.data;
};

export const deleteSecret = async (id) => {
  const res = await API.delete(`/secrets/${id}`);
  return res.data;
};
