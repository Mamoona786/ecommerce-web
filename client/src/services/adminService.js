import api from "./api";

export const getAdminStats = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};

export const getAdminUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const getAdminUserById = async (id) => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data;
};

export const createAdminUser = async (userData) => {
  const response = await api.post("/admin/users", userData);
  return response.data;
};

export const updateAdminUser = async (id, userData) => {
  const response = await api.put(`/admin/users/${id}`, userData);
  return response.data;
};

export const deleteAdminUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

export const getAdminProducts = async () => {
  const response = await api.get("/admin/products");
  return response.data;
};

export const getAdminOrders = async () => {
  const response = await api.get("/admin/orders");
  return response.data;
};

export const getAdminOrderById = async (id) => {
  const response = await api.get(`/admin/orders/${id}`);
  return response.data;
};

export const updateAdminOrder = async (id, orderData) => {
  const response = await api.put(`/admin/orders/${id}`, orderData);
  return response.data;
};

export const deleteAdminOrder = async (id) => {
  const response = await api.delete(`/admin/orders/${id}`);
  return response.data;
};

export const getAdminCarts = async () => {
  const response = await api.get("/admin/carts");
  return response.data;
};

export const getAdminCartById = async (id) => {
  const response = await api.get(`/admin/carts/${id}`);
  return response.data;
};

export const updateAdminCart = async (id, cartData) => {
  const response = await api.put(`/admin/carts/${id}`, cartData);
  return response.data;
};

export const deleteAdminCart = async (id) => {
  const response = await api.delete(`/admin/carts/${id}`);
  return response.data;
};
