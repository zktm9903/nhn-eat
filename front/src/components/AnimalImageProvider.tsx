import { getImages } from '@/apis/image';
import { CACHE_KEY } from '@/consts/cacheKey';
import { useQuery } from '@tanstack/react-query';
import { ReactNode, createContext, useEffect, useState } from 'react';

export type Animal = 'cat' | 'dog' | 'capybara' | 'hyrax';

export const AnimalContext = createContext<{
	animal: Animal;
	setAnimal: React.Dispatch<React.SetStateAction<Animal>>;
	animalImages: string[] | undefined;
}>({
	animal: 'cat',
	setAnimal: () => {},
	animalImages: undefined,
});

export const AnimalImageProvider = ({ children }: { children: ReactNode }) => {
	const [animal, setAnimal] = useState<Animal>((localStorage.getItem('animal') as Animal) ?? 'cat');

	const imagesQuery = useQuery<string[]>({
		queryKey: [CACHE_KEY.IMAGE, animal],
		queryFn: () => getImages(animal ?? 'cat'),
		enabled: !!animal,
	});

	useEffect(() => {
		imagesQuery.data?.forEach(imageUrl => {
			const img = new Image();
			img.src = imageUrl;
		});
	}, [imagesQuery.data]);

	useEffect(() => {
		const preAnimal = localStorage.getItem('animal');
		if (
			preAnimal === 'cat' ||
			preAnimal === 'dog' ||
			preAnimal === 'capybara' ||
			preAnimal === 'hyrax'
		)
			setAnimal(preAnimal as Animal);
		else setAnimal('cat');
	}, []);

	useEffect(() => {
		if (!animal) return;
		localStorage.setItem('animal', animal);
	}, [animal]);

	return (
		<AnimalContext.Provider value={{ animal, setAnimal, animalImages: imagesQuery.data }}>
			{animal && children}
		</AnimalContext.Provider>
	);
};
