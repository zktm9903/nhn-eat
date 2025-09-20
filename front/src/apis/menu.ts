import { Menu } from '@/types/Menu';
import { apiClient, ResponseType } from './apiClient';

export const getMenus = (mealType: 'LUNCH' | 'DINNER', date: string) =>
	apiClient
		.get<ResponseType<Menu[]>>(`/api/v1/menu?mealType=${mealType}&date=${date}`)
		.then(response => response.data);

export const likeMenu = (menuId: string) =>
	apiClient
		.put<ResponseType<void>>(`/api/v1/menu/like?menuId=${menuId}`)
		.then(response => response.data);

export const unlikeMenu = (menuId: string) =>
	apiClient
		.delete<ResponseType<void>>(`/api/v1/menu/like?menuId=${menuId}`)
		.then(response => response.data);

export const getDates = () =>
	apiClient.get<ResponseType<string[]>>(`/api/v1/menu/dates`).then(response => response.data);
