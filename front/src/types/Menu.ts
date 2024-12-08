export interface Menu {
	id: number;
	name: string;
	description: string;
	calories: number;
	mealType: string;
	imageUrl: string | null;
	isLunchBox: boolean;
	date: string;
	stats: {
		id: number;
		liked: number;
	};
	user: {
		id: number;
		liked: boolean;
	};
}

export interface MenuChartData {
	menu: string;
	pick: number;
}
