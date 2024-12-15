import { useEffect, useState } from 'react';

import { getRandomCatGif } from './consts/catGif';
import { CACHE_KEY } from './consts/cacheKey';
import { Menu, MenuChartData } from './types/Menu';
import { disLikeMenu, likeMenu, todayMenus } from './apis/menu';
import { ImageWithPreview } from './components/ImageWithPreview';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarIcon, Loader2, RefreshCw } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';
import { Bounce, toast } from 'react-toastify';
import { FaCheckCircle } from 'react-icons/fa';
import { cn } from './lib/utils';

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from './components/ui/chart';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './components/ui/select';

const chartConfig = {
	desktop: {
		label: 'Desktop',
		// color: 'hsl(var(--chart-5))',
		color: '#18181B',
	},
	mobile: {
		label: 'Mobile',
		color: 'hsl(var(--chart-2))',
	},
	label: {
		color: 'hsl(var(--background))',
	},
} satisfies ChartConfig;

type MealType = 'lunch' | 'dinner';

export default function Home() {
	const queryClient = useQueryClient();
	const [mealType, setMealType] = useState<MealType>(
		new Date().getHours() < 15 ? 'lunch' : 'dinner',
	);

	// ------------------------------ 메뉴, 차트데이터 ------------------------------
	const menuQuery = useQuery<Menu[]>({
		queryKey: [CACHE_KEY.TODAY_MENUS, mealType],
		queryFn: () => todayMenus(mealType),
	});
	const [chartData, setChartData] = useState<MenuChartData[]>();

	useEffect(() => {
		if (!menuQuery.data) return;
		setChartData(
			menuQuery.data.map(menu => ({
				menu: menu.name,
				pick: menu.stats.liked,
			})),
		);
	}, [menuQuery.data, menuQuery.isFetching]);

	useEffect(() => {
		if (menuQuery.isFetching) return;
		toast.success('데이터를 불러왔습니다.', {
			icon: <img src="pop-cat.webp" className="h-auto w-6" />,
			position: 'bottom-right',
			autoClose: 800,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: 'colored',
			transition: Bounce,
		});
	}, [menuQuery.isFetching]);

	const reFetch = () => {
		queryClient.invalidateQueries({ queryKey: [CACHE_KEY.TODAY_MENUS, mealType] });
	};

	// ------------------------------ 이 사람은 투표를 했을까 ------------------------------
	const [block, setBlock] = useState(false);

	useEffect(() => {
		if (!menuQuery.data) return;
		const picked = menuQuery.data?.every(menu => menu.user.liked === false);
		setBlock(picked);
	}, [menuQuery.data]);

	return (
		<div className="relative flex h-[620px] w-full flex-col scrollbar-hide">
			<Tabs defaultValue="menu" className="flex h-full w-full flex-col">
				<header className="flex w-full items-center justify-between p-2">
					<div className="flex items-center gap-2">
						<NowDate />
						<TabsList>
							<TabsTrigger value="menu">메뉴</TabsTrigger>
							<TabsTrigger value="statistics">통계</TabsTrigger>
						</TabsList>
						<Select value={mealType} onValueChange={v => setMealType(v as MealType)}>
							<SelectTrigger className="w-[80px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="lunch">점심</SelectItem>
								<SelectItem value="dinner">저녁</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<Button size="icon" onClick={reFetch}>
						{menuQuery.isFetching ? <Loader2 className="animate-spin" /> : <RefreshCw />}
					</Button>
				</header>
				<main className="flex-grow px-2 pb-2">
					<TabsContent value="menu" className="mt-0 grid grid-cols-2 gap-2">
						{menuQuery.data &&
							menuQuery.data?.map(menu => <MenuCard key={menu.id} menu={menu} reFetch={reFetch} />)}
					</TabsContent>
					<TabsContent value="statistics" className="mt-0">
						<MenuChartCard menuChartData={chartData} block={block} mealType={mealType} />
					</TabsContent>
				</main>
			</Tabs>
		</div>
	);
}

function MenuCard({ menu, reFetch }: { menu: Menu; reFetch: () => void }) {
	const [cat, setCat] = useState('');

	const [liked, setLiked] = useState(menu.user.liked);

	useEffect(() => {
		setCat(getRandomCatGif());
	}, []);

	const likeMenuMutation = useMutation({
		mutationFn: likeMenu,
		onSuccess: reFetch,
	});

	const disLikeMenuMutation = useMutation({
		mutationFn: disLikeMenu,
		onSuccess: reFetch,
	});

	const likeOrDisLike = () => {
		if (liked) {
			disLikeMenuMutation.mutate(menu.id + '');
			setLiked(false);
			return;
		}
		likeMenuMutation.mutate(menu.id + '');
		setLiked(true);
	};

	return (
		<Card key={menu.id} onClick={likeOrDisLike} className="flex w-full flex-col hover:bg-zinc-100">
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<div className="flex items-center">
					<CardTitle className="mr-2 text-[1rem]">{menu.name}</CardTitle>
					<CardDescription>{menu.calories}kcal</CardDescription>
				</div>
				{liked && <FaCheckCircle className="relative top-[-2px] text-green-700" />}
			</CardHeader>
			<CardContent className="pb-6">
				<CardDescription className="mb-2 h-10">{menu.description}</CardDescription>
				{menu.imageUrl ? (
					<img src={menu.imageUrl} className="h-[140px] w-full rounded-sm object-cover" />
				) : (
					<ImageWithPreview
						delay={3000}
						placeholder="/no-image.webp"
						src={cat}
						className="h-[140px] w-full rounded-sm object-cover"
					/>
				)}
			</CardContent>
		</Card>
	);
}

function MenuChartCard({
	menuChartData,
	block,
	mealType,
}: {
	menuChartData?: MenuChartData[];
	block?: boolean;
	mealType: MealType;
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-[1rem]">{`오늘의 ${mealType === 'lunch' ? '점심' : '저녁'} 메뉴`}</CardTitle>
				<CardDescription>현재 투표 수</CardDescription>
			</CardHeader>
			<CardContent className="relative">
				{block && (
					<div className="absolute bottom-0 left-0 right-0 top-[-20px] z-10 flex justify-end backdrop-blur">
						<CardTitle className="black relative top-[-44px] mr-6 text-right text-[1rem] text-red-700">
							메뉴를 골라주세요.
						</CardTitle>
					</div>
				)}
				<ChartContainer config={chartConfig} className="h-[200px] w-full">
					<BarChart
						accessibilityLayer
						data={menuChartData}
						layout="vertical"
						margin={{
							right: 16,
						}}
					>
						<CartesianGrid horizontal={false} />
						<YAxis
							dataKey="menu"
							type="category"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={value => value.slice(0, 3)}
							hide
						/>
						<XAxis dataKey="pick" type="number" hide />
						<ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
						<Bar dataKey="pick" layout="vertical" fill="var(--color-desktop)" radius={4}>
							<LabelList
								dataKey="menu"
								position="insideLeft"
								offset={8}
								className="fill-[--color-label]"
								fontSize={12}
							/>
							<LabelList
								dataKey="pick"
								position="right"
								offset={8}
								className="fill-foreground"
								fontSize={12}
							/>
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

function NowDate() {
	return (
		<Button variant={'outline'} className={cn('w-auto justify-start text-left font-normal')}>
			<CalendarIcon />
			{format(new Date(), 'yyyy년 MM월 dd일 eeee', { locale: ko })}
		</Button>
	);
}
