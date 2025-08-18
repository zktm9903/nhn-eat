import { ReactNode, useEffect, useState } from 'react';
import { apiClient } from '../apis/apiClient';
import { signUp } from '../apis/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CACHE_KEY } from '@/consts/cacheKey';

export function AuthGuard({ children }: { children: ReactNode }) {
	const [guard, setGuard] = useState(false);

	return (
		<SetInterceptor setGuard={setGuard}>
			{guard ? <SignUp setGuard={setGuard} /> : children}
		</SetInterceptor>
	);
}

const SetInterceptor = ({
	children,
	setGuard,
}: {
	children: ReactNode;
	setGuard: (guard: boolean) => void;
}) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		apiClient.interceptors.request.use(
			function (config) {
				config.headers.Authorization = 'Bearer ' + localStorage.getItem('nhn-eat-uid');
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
				if (error.response.status === 401) {
					setGuard(true);
				}
				return Promise.reject(error);
			},
		);
		setMounted(true);
	}, []);

	return <>{mounted && children}</>;
};

const SignUp = ({ setGuard }: { setGuard: (guard: boolean) => void }) => {
	const queryClient = useQueryClient();
	const signUpMutation = useMutation({
		mutationFn: signUp,
		onSuccess: data => {
			localStorage.setItem('nhn-eat-uid', data);
			queryClient.invalidateQueries({ queryKey: [CACHE_KEY.TODAY_MENUS] });
			setGuard(false);
		},
	});

	useEffect(() => {
		signUpMutation.mutate();
	}, []);

	return <p>👮‍♀️ Signing up... </p>;
};
