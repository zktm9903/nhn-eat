import { useState, useEffect } from 'react';

interface ImageWithPreviewProps extends React.ImgHTMLAttributes<HTMLImageElement> {
	placeholder: string;
	src: string;
	delay: number;
}

export const ImageWithPreview = ({ placeholder, src, delay, ...props }: ImageWithPreviewProps) => {
	const [mount, setMount] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			const image = new Image();
			image.src = src;
			image.onload = () => {
				setMount(true);
			};
		}, delay);
	}, [src]);

	return (
		<>
			{mount ? (
				<img {...props} id="real-image" src={src} alt="catOrDog" />
			) : (
				<img {...props} id="preview-image" src={placeholder} alt="catOrDog" />
			)}
		</>
	);
};
