import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { CalendarIcon, Flag, Loader2, RefreshCw } from 'lucide-react';
import { cn } from './lib/utils';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { todayMenus } from './apis/menu';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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

const chartConfig = {
	desktop: {
		label: 'Desktop',
		color: 'hsl(var(--chart-2))',
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
		setChartData(
			menuQuery.data?.map(menu => ({
				menu: menu.name,
				pick: menu.stats.likes,
			})),
		);
	}, [menuQuery.data]);

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
		<div className="scrollbar-hide flex h-[600px] w-full flex-col">
			<header className="flex justify-between px-2 py-2">
				<NowDate />
				<Button size="icon" onClick={reFresh} disabled={!canRefresh || menuQuery.isFetching}>
					{menuQuery.isFetching ? <Loader2 className="animate-spin" /> : <RefreshCw />}
				</Button>
			</header>
			<div className="scrollbar-hide w-full flex-grow overflow-auto px-2 pb-4">
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
									{menuQuery.data?.slice(1).map(menu => <MenuCard key={menu.id} menu={menu} />)}
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
	return (
		<Card className="flex w-full flex-col hover:bg-zinc-100" key={menu.id}>
			<CardHeader className="relative flex flex-row items-center justify-between pb-2">
				<div className="flex">
					<CardTitle className="mr-2">{menu.name}</CardTitle>
					<CardDescription className="relative top-[-2px]">{menu.calories}kcal</CardDescription>
				</div>
				<FaCheckCircle className="relative top-[-2px] text-green-700" />
			</CardHeader>
			<CardContent className="pb-6">
				<CardDescription className="mb-2 h-10">{menu.description}</CardDescription>
				<img src={menu.imageUrl ?? ''} className="h-[140px] w-full rounded-sm object-cover" />
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
				<CardTitle>오늘의 메뉴</CardTitle>
				<CardDescription>현재 투표 수</CardDescription>
			</CardHeader>
			<CardContent className="relative">
				{block && (
					<div className="absolute bottom-0 left-0 right-0 top-[-20px] z-10 flex items-center justify-center backdrop-blur">
						<CardTitle className="relative top-[-10px] text-center">메뉴를 골라주세요.</CardTitle>
					</div>
				)}
				<ChartContainer config={chartConfig}>
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
