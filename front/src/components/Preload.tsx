import { CAT_GIF } from '@/consts/catGif';
import { useEffect } from 'react';

export default function PreLoad() {
	useEffect(() => {
		CAT_GIF.forEach(cat => {
			import(cat);
		});
	}, []);
	return <></>;
}
