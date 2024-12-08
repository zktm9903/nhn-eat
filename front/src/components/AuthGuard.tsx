import { ReactNode, useEffect, useState } from 'react';
import { apiClient } from '../apis/apiClient';
import { signUp } from '../apis/user';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CACHE_KEY } from '@/consts/cacheKey';

export function AuthGuard({ children }: { children: ReactNode }) {
	const [guard, setGuard] = useState(false);

	apiClient.interceptors.request.use(
		function (config) {
			config.headers.Authorization = localStorage.getItem('nhn-eat-uid');
			return config;
		},
		function (error) {
			return Promise.reject(error);
		},
	);

	apiClient.interceptors.response.use(
		response => {
			return response;
		},
		error => {
			if (error.response.status === 401) setGuard(true);
			return Promise.reject(error);
		},
	);

	return <>{guard ? <SignUpPage setGuard={setGuard} /> : children}</>;
}

function SignUpPage({ setGuard }: { setGuard: React.Dispatch<React.SetStateAction<boolean>> }) {
	const signUpQuery = useQuery({ queryKey: [], queryFn: signUp });
	const queryClient = useQueryClient();

	const reStart = async () => {
		localStorage.setItem('nhn-eat-uid', signUpQuery.data);
		await queryClient.invalidateQueries({ queryKey: [CACHE_KEY.TODAY_MENUS] });
		setGuard(false);
	};

	useEffect(() => {
		if (!signUpQuery.isSuccess) return;
		reStart();
	}, [signUpQuery.isSuccess]);

	return <p>👮‍♀️ Signing up... </p>;
}
