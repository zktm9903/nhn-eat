import { apiClient } from './apiClient';

export const signUp = () => apiClient.post('/api/v1/user/signup').then(res => res.data);
