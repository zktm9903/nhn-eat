import axios from 'axios';

export const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
});

apiClient.defaults.withCredentials = true;

export type ResponseType<T> = {
	code: number;
	message: string;
	data: T;
};
