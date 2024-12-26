import { Menu } from '@/types/Menu';
import { apiClient } from './apiClient';

export const getMenus = (mealType: 'lunch' | 'dinner', date: string): Promise<Menu[]> =>
	apiClient.get(`/api/v1/menu?mealType=${mealType}&date=${date}`).then(response => response.data);

export const likeMenu = (menuId: string) =>
	apiClient.post(`/api/v1/menu/${menuId}/like`).then(response => response.data);

export const disLikeMenu = (menuId: string) =>
	apiClient.post(`/api/v1/menu/${menuId}/dislike`).then(response => response.data);

export const getDates = (): Promise<string[]> =>
	apiClient.get(`/api/v1/menu/dates`).then(response => response.data);
