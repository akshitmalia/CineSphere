import api from "./axios";

export const registerUser = (email, password) =>
  api.post("/api/auth/register", { email, password }).then((r) => r.data);

export const loginUser = (email, password) =>
  api.post("/api/auth/login", { email, password }).then((r) => r.data);

export const logoutUser = () =>
  api.post("/api/auth/logout").then((r) => r.data);

export const refreshSession = () =>
  api.post("/api/auth/refresh").then((r) => r.data);
