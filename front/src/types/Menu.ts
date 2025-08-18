export interface Menu {
	id: number;
	name: string;
	description: string;
	calories: number;
	mealType: string;
	imageUrl: string | null;
	lunchBox: boolean;
	date: string;
	likeCount: number;
	liked: boolean;
}

export interface MenuChartData {
	menu: string;
	pick: number;
}
