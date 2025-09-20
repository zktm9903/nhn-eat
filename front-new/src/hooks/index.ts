import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { http } from '../lib/http';
import type { ApiResponse, Menu } from '../types';

export const usePostSignUpMutation = () => {
	return useMutation({
		mutationFn: () => http.post('api/v1/user/signup'),
		onSuccess: () => {
			window.location.href = '/';
		},
	});
};

export const useGetTodayMenusQuery = () => {
	const date = '2025-09-19';
	return useSuspenseQuery<ApiResponse<Menu[]>>({
		queryKey: ['menus'],
		queryFn: () => {
			return http
				.get<ApiResponse<Menu[]>>(`api/v1/menu?date=${date}`)
				.then(response => response.json());
		},
	});
};

export const usePostLikeMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (menuId: Menu['id']) => http.post(`api/v1/menu/like?menuId=${menuId}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['menus'] });
		},
	});
};

export const useDeleteLikeMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (menuId: Menu['id']) => http.delete(`api/v1/menu/like?menuId=${menuId}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['menus'] });
		},
	});
};
