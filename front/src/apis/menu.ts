import { Menu } from '@/types/Menu';
import { apiClient } from './apiClient';

export const todayMenus = (): Promise<Menu[]> =>
	apiClient.get('/api/v1/menu/today').then(response => response.data);
