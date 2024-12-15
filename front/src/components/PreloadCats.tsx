import { CAT_GIF } from '@/consts/catGif';
import { useEffect } from 'react';

export default function PreloadCats() {
	useEffect(() => {
		CAT_GIF.forEach(cat => {
			const img = new Image();
			img.src = cat;
		});
	}, []);
	return <></>;
}
