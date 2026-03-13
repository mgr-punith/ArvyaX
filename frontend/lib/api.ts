import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  withCredentials: true,
});

export const register = (data: { email: string; username: string; password: string }) =>
  api.post("/api/auth/register", data);

export const login = (data: { email: string; password: string }) =>
  api.post("/api/auth/login", data);

export const logout = () => api.post("/api/auth/logout");

export const createJournal = (data: { userId: string; ambience: string; text: string }) =>
  api.post("/api/journal", data);

export const getJournals = (userId: number) =>
  api.get(`/api/journal/${userId}`);

export const analyzeText = (data: { text: string; entryId?: number }) =>
  api.post("/api/journal/analyze", data);

export const getInsights = (userId: number) =>
  api.get(`/api/journal/insights/${userId}`);

export default api;