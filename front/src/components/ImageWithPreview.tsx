import { useState, useEffect } from 'react';

interface ImageWithPreviewProps extends React.ImgHTMLAttributes<HTMLImageElement> {
	placeholder: string;
	src: string;
	delay: number;
}

export const ImageWithPreview = ({ placeholder, src, delay, ...props }: ImageWithPreviewProps) => {
	const [currentSrc, setCurrentSrc] = useState(placeholder);

	useEffect(() => {
		setTimeout(() => {
			const image = new Image();
			image.src = src;
			console.log(src);
			image.onload = () => {
				setCurrentSrc(src);
			};
		}, delay);
	}, [src]);

	return <img {...props} id="preview-image" src={currentSrc} alt="cat" />;
};
