import { Menu } from '@/types/Menu';
import { apiClient } from './apiClient';

export const todayMenus = (mealType: 'lunch' | 'dinner'): Promise<Menu[]> =>
	apiClient.get(`/api/v1/menu/today?mealType=${mealType}`).then(response => response.data);

export const likeMenu = (menuId: string) =>
	apiClient.post(`/api/v1/menu/${menuId}/like`).then(response => response.data);

export const disLikeMenu = (menuId: string) =>
	apiClient.post(`/api/v1/menu/${menuId}/dislike`).then(response => response.data);
