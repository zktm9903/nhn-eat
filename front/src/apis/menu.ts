import { apiClient } from "./apiClient";

export const todayMenus = () => apiClient.get("/api/v1/menu/today");
