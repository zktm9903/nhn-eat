export const CAT_GIF = [
	'https://www.catster.com/wp-content/uploads/2024/04/cat-high-five-gif.gif',
	'https://www.catster.com/wp-content/uploads/2024/04/cat-high-five-1.gif',
	'https://www.catster.com/wp-content/uploads/2024/04/high-five-cat.gif',
	'https://www.catster.com/wp-content/uploads/2024/04/high-five-fail-youre-down.gif',
	'https://www.catster.com/wp-content/uploads/2024/04/undefined-Imgur.gif',
	'https://www.catster.com/wp-content/uploads/2024/04/drive-by-high-five.gif',
	'https://www.catster.com/wp-content/uploads/2024/04/cat-high-fives-team.gif',
];

export function getRandomCatGif() {
	const randomIndex = Math.floor(Math.random() * CAT_GIF.length);
	return CAT_GIF[randomIndex];
}
