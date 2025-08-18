import { Menu } from '@/types/Menu';
import { apiClient } from './apiClient';

export const getMenus = (mealType: 'LUNCH' | 'DINNER', date: string): Promise<Menu[]> =>
	apiClient.get(`/api/v1/menu?mealType=${mealType}&date=${date}`).then(response => response.data);

export const likeMenu = (menuId: string) =>
	apiClient.put(`/api/v1/menu/like?menuId=${menuId}`).then(response => response.data);

export const unlikeMenu = (menuId: string) =>
	apiClient.delete(`/api/v1/menu/like?menuId=${menuId}`).then(response => response.data);

export const getDates = (): Promise<string[]> =>
	apiClient.get(`/api/v1/menu/dates`).then(response => response.data);
