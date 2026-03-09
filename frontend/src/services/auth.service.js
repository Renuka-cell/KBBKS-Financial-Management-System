import http from "./http";

export const loginUser = async (email, password) => {
  const response = await http.post("/auth/login", { email, password });
  return response.data;
};

export const registerUser = async (userData) => {
  const { name, email, password, role } = userData;
  const response = await http.post("/auth/register", { name, email, password, role });
  return response.data;
};
