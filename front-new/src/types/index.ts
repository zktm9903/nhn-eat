export type ApiResponse<T> = {
	code: number;
	message: string;
	data: T;
};

export type Menu = {
	id: number;
	name: string;
	description: string;
	calories: number;
	mealType: 'DINNER' | 'LUNCH';
	imageUrl: string;
	date: string;
	likeCount: number;
	lunchBox: boolean;
	liked: boolean;
};
