import { Animal } from '@/components/AnimalImageProvider';
import { apiClient, ResponseType } from './apiClient';

export const getImages = (type: Animal) =>
	apiClient.get<ResponseType<string[]>>(`/api/v1/images?type=${type}`).then(res => res.data);
