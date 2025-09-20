import ky from 'ky';

export const http = ky.create({
	prefixUrl: import.meta.env.VITE_API_URL,
	credentials: 'include',
	hooks: {
		afterResponse: [
			(_request, _options, response) => {
				console.error('401 Unauthorized');
				if (response.status === 401) {
					window.location.href = '/auth';
				}
				return response;
			},
		],
	},
});
