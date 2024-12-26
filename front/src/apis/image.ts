import { Animal } from '@/components/AnimalImageProvider';
import { apiClient } from './apiClient';

export const getImages = (type: Animal) =>
	apiClient.get(`/api/v1/images?type=${type}`).then(res => res.data);
