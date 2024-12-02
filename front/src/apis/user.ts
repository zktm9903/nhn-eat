import { apiClient } from "./apiClient";

export const signUp = () => apiClient.get("/api/v1/user/signup");
