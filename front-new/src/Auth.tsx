import { usePostSignUpMutation } from './hooks';
import { useEffect } from 'react';

export function Auth() {
	const { mutate: signUp } = usePostSignUpMutation();

	useEffect(() => {
		signUp();
	}, []);

	return <div>인증 중...</div>;
}
