import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { CalendarIcon, Loader2, RefreshCw } from 'lucide-react';
import { cn } from './lib/utils';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { disLikeMenu, likeMenu, todayMenus } from './apis/menu';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Menu, MenuChartData } from './types/Menu';
import { CACHE_KEY } from './consts/cacheKey';
import { FaCheckCircle } from 'react-icons/fa';
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from './components/ui/chart';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';
import { Skeleton } from './components/ui/skeleton';
import { Bounce, toast } from 'react-toastify';
import { getRandomCatGif } from './consts/catGif';

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

export default function Home() {
	const queryClient = useQueryClient();

	// ------------------------------ 메뉴, 차트데이터 ------------------------------
	const menuQuery = useQuery<Menu[]>({ queryKey: [CACHE_KEY.TODAY_MENUS], queryFn: todayMenus });
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
			icon: <>🐷</>,
			position: 'bottom-right',
			autoClose: 1000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: 'colored',
			transition: Bounce,
		});
	}, [menuQuery.isFetching]);

	// ------------------------------ 메뉴 재요청 ------------------------------
	const [canRefresh, setCanRefresh] = useState(true);

	const reFresh = () => {
		setCanRefresh(false);
		queryClient.invalidateQueries({ queryKey: [CACHE_KEY.TODAY_MENUS] });
		setTimeout(() => {
			setCanRefresh(true);
		}, 3000);
	};

	// ------------------------------ 이 사람은 투표를 했을까 ------------------------------
	const [block, setBlock] = useState(false);

	useEffect(() => {
		if (!menuQuery.data) return;
		const picked = menuQuery.data?.every(menu => menu.user.liked === false);
		setBlock(picked);
	}, [menuQuery.data]);

	return (
		<div className="relative flex h-[600px] w-full flex-col scrollbar-hide">
			<header className="flex justify-between px-2 py-2">
				<NowDate />
				<Button size="icon" onClick={reFresh} disabled={!canRefresh || menuQuery.isFetching}>
					{menuQuery.isFetching ? <Loader2 className="animate-spin" /> : <RefreshCw />}
				</Button>
			</header>
			<div className="w-full flex-grow overflow-auto px-2 pb-4 scrollbar-hide">
				{menuQuery.isFetching ? (
					<>
						<div className="mb-2 flex gap-2">
							<Skeleton className="h-[240px] flex-grow rounded-xl" />
							<Skeleton className="h-[240px] flex-grow rounded-xl" />
						</div>

						<Skeleton className="h-[240px] w-full rounded-xl" />
					</>
				) : (
					<>
						{menuQuery.data?.length ? (
							<>
								<div className="mb-2 grid grid-cols-2 gap-2">
									{menuQuery.data?.map(menu => <MenuCard key={menu.id} menu={menu} />)}
								</div>
								<MenuChartCard menuChartData={chartData} block={block} />
							</>
						) : (
							<CardDescription className="mt-10 text-center">데이터가 없습니다.</CardDescription>
						)}
					</>
				)}
			</div>
		</div>
	);
}

function MenuCard({ menu }: { menu: Menu }) {
	const queryClient = useQueryClient();
	const [cat, setCat] = useState('');

	useEffect(() => {
		setCat(getRandomCatGif());
	}, []);

	const likeMenuMutation = useMutation({
		mutationFn: likeMenu,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [CACHE_KEY.TODAY_MENUS] });
		},
	});

	const disLikeMenuMutation = useMutation({
		mutationFn: disLikeMenu,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [CACHE_KEY.TODAY_MENUS] });
		},
	});

	const likeOrDisLike = () => {
		if (menu.user.liked) {
			disLikeMenuMutation.mutate(menu.id + '');
			return;
		}
		likeMenuMutation.mutate(menu.id + '');
	};

	return (
		<Card key={menu.id} onClick={likeOrDisLike} className="flex w-full flex-col hover:bg-zinc-100">
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<div className="flex items-center">
					<CardTitle className="mr-2 text-[1rem]">{menu.name}</CardTitle>
					<CardDescription>{menu.calories}kcal</CardDescription>
				</div>
				{menu.user.liked && <FaCheckCircle className="relative top-[-2px] text-green-700" />}
			</CardHeader>
			<CardContent className="pb-6">
				<CardDescription className="mb-2 h-10">{menu.description}</CardDescription>
				{menu.imageUrl ? (
					<img src={menu.imageUrl} className="h-[140px] w-full rounded-sm object-cover" />
				) : (
					<img src={cat} className="h-[140px] w-full rounded-sm object-cover" />
				)}
			</CardContent>
		</Card>
	);
}

function MenuChartCard({
	menuChartData,
	block,
}: {
	menuChartData?: MenuChartData[];
	block?: boolean;
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-[1rem]">오늘의 메뉴</CardTitle>
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
				<ChartContainer config={chartConfig} className="h-[200px]">
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
