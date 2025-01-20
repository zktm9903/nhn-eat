import { useContext, useEffect, useState } from 'react';

import { CACHE_KEY } from './consts/cacheKey';
import { Menu, MenuChartData } from './types/Menu';
import { disLikeMenu, likeMenu, getMenus, getDates } from './apis/menu';
import { ImageWithPreview } from './components/ImageWithPreview';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarIcon, Loader2, RefreshCw } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';
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
import { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover';
import { Calendar } from './components/ui/calendar';
import { Badge } from './components/ui/badge';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from './components/ui/drawer';
import { AnimalContext } from './components/AnimalImageProvider';

const chartConfig = {
	desktop: {
		label: 'Desktop',
		color: '#18181B',
	},
	label: {
		color: 'hsl(var(--background))',
	},
} satisfies ChartConfig;

type MealType = 'lunch' | 'dinner';

export default function Home() {
	const queryClient = useQueryClient();

	const [date, setDate] = useState<Date | undefined>(new Date()); // date : 2024-12-26
	const [mealType, setMealType] = useState<MealType>(
		new Date().getHours() < 15 ? 'lunch' : 'dinner',
	);

	// ------------------------------ 메뉴, 차트데이터 ------------------------------
	const menuQuery = useQuery<Menu[]>({
		queryKey: [CACHE_KEY.TODAY_MENUS, mealType, date],
		queryFn: () => getMenus(mealType, format(date ?? '', 'yyyy-MM-dd')),
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

	const reFetch = () => {
		queryClient.invalidateQueries({ queryKey: [CACHE_KEY.TODAY_MENUS, mealType, date] });
	};

	// ------------------------------ 이 사람은 투표를 했을까 ------------------------------
	const [block, setBlock] = useState(false);

	useEffect(() => {
		if (!menuQuery.data) return;
		const picked = menuQuery.data?.every(menu => menu.user.liked === false);
		setBlock(picked);
	}, [menuQuery.data]);

	// ------------------------------ 좋아요는 오직 하나 ------------------------------

	const likeMenuMutation = useMutation({
		mutationFn: likeMenu,
	});

	const disLikeMenuMutation = useMutation({
		mutationFn: disLikeMenu,
	});

	const like = async (menuId: string) => {
		if (!menuQuery.data) return;
		try {
			await likeMenuMutation.mutateAsync(menuId);
			for (const menu of menuQuery.data) {
				if (menu.id + '' === menuId) continue;
				if (menu.user.liked) {
					await disLikeMenuMutation.mutateAsync(menu.id + '');
				}
			}
		} catch (err) {
			console.log(err);
		} finally {
			await queryClient.invalidateQueries({ queryKey: [CACHE_KEY.TODAY_MENUS, mealType, date] });
		}
	};

	const dislike = async (menuId: string) => {
		try {
			await disLikeMenuMutation.mutateAsync(menuId);
			await queryClient.invalidateQueries({ queryKey: [CACHE_KEY.TODAY_MENUS, mealType, date] });
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="relative flex h-screen w-screen flex-col scrollbar-hide" id="test">
			<Tabs defaultValue="menu" className="flex h-full w-full flex-col">
				<header className="flex w-full items-start justify-between p-2">
					<div className="flex flex-grow flex-wrap items-center gap-2">
						<DateBox date={date} setDate={setDate} />
						<Select value={mealType} onValueChange={v => setMealType(v as MealType)}>
							<SelectTrigger className="w-[80px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="lunch">점심</SelectItem>
								<SelectItem value="dinner">저녁</SelectItem>
							</SelectContent>
						</Select>
						<TabsList>
							<TabsTrigger value="menu">메뉴</TabsTrigger>
							<TabsTrigger value="statistics">통계</TabsTrigger>
						</TabsList>
						<AnimalBox />
					</div>

					<Button size="icon" onClick={reFetch} className="flex-shrink-0">
						{menuQuery.isFetching ? <Loader2 className="animate-spin" /> : <RefreshCw />}
					</Button>
				</header>
				<main className="flex-grow overflow-auto px-2 pb-2">
					{menuQuery.data && menuQuery.data.length === 0 ? (
						<p className="mt-[50px] text-center text-[#555555]">데이터가 없습니다.</p>
					) : (
						<>
							<TabsContent value="menu" className="mt-0">
								<div className="mb-2 mt-0 grid grid-cols-2 gap-2 mobile:grid-cols-1">
									{menuQuery.data &&
										menuQuery.data
											?.filter(menu => !menu.isLunchBox)
											.map(menu => (
												<MenuCard key={menu.id} menu={menu} like={like} dislike={dislike} />
											))}
								</div>
								<div className="mb-[100px] flex flex-col gap-2">
									{menuQuery.data &&
										menuQuery.data
											?.filter(menu => menu.isLunchBox)
											.map(menu => (
												<MenuCard key={menu.id} menu={menu} like={like} dislike={dislike} />
											))}
								</div>
							</TabsContent>
							<TabsContent value="statistics" className="mt-0">
								<MenuChartCard menuChartData={chartData} block={block} mealType={mealType} />
							</TabsContent>
						</>
					)}
				</main>
			</Tabs>
		</div>
	);
}

function DateBox({
	date,
	setDate,
}: {
	date: Date | undefined;
	setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}) {
	const [isOpen, setIsOpen] = useState(false);

	const handleDateChange = (selectedDate: Date | undefined) => {
		setDate(selectedDate);
		setIsOpen(false);
	};

	const datesQuery = useQuery({ queryKey: [CACHE_KEY.DATES], queryFn: () => getDates() });

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button
					variant={'outline'}
					className={cn(
						'w-[210px] justify-start text-left font-normal',
						!date && 'text-muted-foreground',
					)}
				>
					<CalendarIcon />
					{date ? format(date, 'yyyy년 MM월 dd일 eeee', { locale: ko }) : '날짜를 선택하세요'}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={date}
					onSelect={handleDateChange}
					initialFocus
					disabled={{ dayOfWeek: [0, 6] }}
					modifiers={{
						selectable: datesQuery.data ? datesQuery.data.map(date => new Date(date)) : [],
					}}
					modifiersStyles={{
						selectable: {
							fontWeight: 'bold',

							border: 'solid 1px rgb(228 228 231 / var(--tw-bg-opacity, 1)',
						},
					}}
				/>
			</PopoverContent>
		</Popover>
	);
}

function AnimalBox() {
	const { animal, setAnimal } = useContext(AnimalContext);
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant="outline">{animal === 'cat' ? '고양이' : '강아지'}</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>정말 바꾸십니까 신중히 골라주세요.</DrawerTitle>
					<DrawerDescription>동물 사진 제보 받습니다.</DrawerDescription>
				</DrawerHeader>
				<DrawerClose className="mb-[32px] flex justify-center">
					<div className="mx-6 flex w-full max-w-[500px] justify-center gap-3">
						<img
							src={
								'https://velog.velcdn.com/images/looksgood99/post/33d5bc4d-ddf0-4d38-8883-78f5756c1708/image.png'
							}
							className="aspect-square h-auto w-[50%] cursor-pointer rounded-lg object-cover duration-200 hover:scale-105"
							onClick={() => setAnimal('cat')}
						/>
						<img
							src={
								'https://velog.velcdn.com/images/looksgood99/post/dda487f2-6fd0-4417-81a2-89b73c140bc3/image.png'
							}
							className="aspect-square h-auto w-[50%] cursor-pointer rounded-lg object-cover duration-200 hover:scale-105"
							onClick={() => setAnimal('dog')}
						/>
					</div>
				</DrawerClose>
			</DrawerContent>
		</Drawer>
	);
}

function MenuCard({
	menu,
	like,
	dislike,
}: {
	menu: Menu;
	like: (menuId: string) => Promise<void>;
	dislike: (menuId: string) => Promise<void>;
}) {
	const { animal, animalImages } = useContext(AnimalContext);
	const [block, setBlock] = useState(false);

	const likeOrDislike = async () => {
		setBlock(true);
		if (menu.user.liked) {
			await dislike(menu.id + '');
		} else {
			await like(menu.id + '');
		}
		setBlock(false);
	};

	return (
		<Card
			key={menu.id}
			onClick={
				block
					? () => {
							console.log('갈기지 마세요');
						}
					: likeOrDislike
			}
			className={`flex w-full flex-col hover:bg-zinc-100 ${menu.user.liked && 'border-[2px] border-zinc-800'}`}
		>
			<CardHeader
				className={`flex flex-row items-center justify-between pb-2 ${menu.isLunchBox && 'pb-6'}`}
			>
				<div className="w-full">
					<CardTitle className="mb-1 text-[1rem]">{menu.name}</CardTitle>
					<div className="flex w-full justify-between">
						<CardDescription>{menu.calories}kcal</CardDescription>
						{menu.isLunchBox && <Badge>도시락</Badge>}
					</div>

					{!menu.isLunchBox && (
						<CardDescription className="mb-2 mt-1 h-10">{menu.description}</CardDescription>
					)}
				</div>
			</CardHeader>
			{!menu.isLunchBox && (
				<CardContent className="pb-6">
					{menu.imageUrl ? (
						<img
							src={menu.imageUrl}
							className="aspect-[3/2] h-auto w-full rounded-sm object-cover"
						/>
					) : (
						<ImageWithPreview
							delay={3000}
							placeholder={`/no-image-${animal}.webp`}
							src={
								animalImages ? animalImages[Math.floor(Math.random() * animalImages.length)] : ''
							}
							className="aspect-[3/2] h-auto w-full rounded-sm object-cover"
						/>
					)}
				</CardContent>
			)}
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
					<div className="absolute bottom-0 left-0 right-0 top-[-20px] z-10 flex items-center justify-center bg-white">
						<CardTitle className="text-center text-[1rem] text-red-700">
							메뉴를 골라주세요
						</CardTitle>
					</div>
				)}
				<ChartContainer config={chartConfig} className="h-[350px] w-full">
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
