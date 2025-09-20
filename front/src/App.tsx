import { useContext, useEffect, useState } from 'react';

import { CACHE_KEY } from './consts/cacheKey';
import { Menu } from './types/Menu';
import { getMenus, getDates, likeMenu, unlikeMenu } from './apis/menu';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarIcon } from 'lucide-react';
import { cn } from './lib/utils';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
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
import { Animal, AnimalContext } from './components/AnimalImageProvider';
import MobileStore from './components/MobileStore';
import NotificationBox from './components/NotificationBox';
import { GoHeart, GoHeartFill } from 'react-icons/go';

type MealType = 'LUNCH' | 'DINNER';

export default function Home() {
	const [date, setDate] = useState<Date | undefined>(new Date());
	const dateString = format(date ?? '', 'yyyy-MM-dd');
	const [mealType, setMealType] = useState<MealType>(
		new Date().getHours() < 15 ? 'LUNCH' : 'DINNER',
	);

	// ------------------------------ 메뉴 ------------------------------
	const menuQuery = useQuery<Menu[]>({
		queryKey: [CACHE_KEY.TODAY_MENUS, mealType, dateString],
		queryFn: () => getMenus(mealType, dateString),
		select: data => data,
	});

	useEffect(() => {
		if (!menuQuery.data) return;
	}, [menuQuery.data, menuQuery.isFetching]);

	return (
		<div className="relative flex h-screen w-screen flex-col scrollbar-hide" id="test">
			<header className="flex w-full items-start justify-between p-2">
				<div className="flex flex-grow flex-wrap items-center gap-2">
					<DateBox date={date} setDate={setDate} />
					<Select value={mealType} onValueChange={v => setMealType(v as MealType)}>
						<SelectTrigger className="w-[80px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="LUNCH">점심</SelectItem>
							<SelectItem value="DINNER">저녁</SelectItem>
						</SelectContent>
					</Select>
					<AnimalBox />
					<MobileStore />
				</div>
			</header>
			<main className="flex-grow overflow-auto px-2 pb-2">
				{menuQuery.data && menuQuery.data.length === 0 ? (
					<p className="mt-[50px] text-center text-[#555555]">데이터가 없습니다.</p>
				) : (
					<>
						<div className="mb-2 mt-0 grid grid-cols-2 gap-2 mobile:grid-cols-1">
							{menuQuery.data &&
								menuQuery.data
									?.filter(menu => !menu.lunchBox)
									.map(menu => (
										<MenuCard menu={menu} mealType={mealType} dateString={dateString} />
									))}
						</div>
						<div className="mb-[100px] flex flex-col gap-2">
							{menuQuery.data &&
								menuQuery.data
									?.filter(menu => menu.lunchBox)
									.map(menu => (
										<MenuCard menu={menu} mealType={mealType} dateString={dateString} />
									))}
						</div>
					</>
				)}
			</main>
			<NotificationBox />
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

const ANIMAL_LABEL: Record<Animal, string> = {
	cat: '고양이',
	dog: '강아지',
	capybara: '카피바라',
	hyrax: '바위너구리',
};

function AnimalBox() {
	const { animal, setAnimal } = useContext(AnimalContext);

	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant="outline" className="px-2">
					{ANIMAL_LABEL[animal ?? 'cat']}
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>정말 바꾸십니까 신중히 골라주세요.</DrawerTitle>
					<DrawerDescription>지정된 동물의 짤이 보여집니다.</DrawerDescription>
				</DrawerHeader>
				<DrawerClose className="mb-[32px] flex justify-center">
					<div className="mx-6 flex w-full max-w-[500px] flex-wrap justify-center gap-3">
						<img
							src={'/cat.webp'}
							className="aspect-square h-auto w-[40%] cursor-pointer rounded-lg object-cover duration-200 hover:scale-105 mobile:w-[40%]"
							onClick={() => setAnimal('cat')}
						/>
						<img
							src={'/dog.webp'}
							className="aspect-square h-auto w-[40%] cursor-pointer rounded-lg object-cover duration-200 hover:scale-105 mobile:w-[40%]"
							onClick={() => setAnimal('dog')}
						/>
						<img
							src={'/capybara.webp'}
							className="aspect-square h-auto w-[40%] cursor-pointer rounded-lg object-cover duration-200 hover:scale-105 mobile:w-[40%]"
							onClick={() => setAnimal('capybara')}
						/>
						<img
							src={'/hyrax.webp'}
							className="aspect-square h-auto w-[40%] cursor-pointer rounded-lg object-cover duration-200 hover:scale-105 mobile:w-[40%]"
							onClick={() => setAnimal('hyrax')}
						/>
					</div>
				</DrawerClose>
			</DrawerContent>
		</Drawer>
	);
}

function MenuCard({
	menu,
	mealType,
	dateString,
}: {
	menu: Menu;
	mealType: MealType;
	dateString: string;
}) {
	const likeMutation = useMutation({
		mutationFn: () => likeMenu(menu.id.toString()),
	});
	const unlikeMutation = useMutation({
		mutationFn: () => unlikeMenu(menu.id.toString()),
	});

	const queryClient = useQueryClient();
	const handleLike = () => {
		likeMutation.mutate();
		queryClient.invalidateQueries({
			queryKey: [CACHE_KEY.TODAY_MENUS, mealType, dateString],
		});
	};
	const handleUnlike = () => {
		unlikeMutation.mutate();
		queryClient.invalidateQueries({
			queryKey: [CACHE_KEY.TODAY_MENUS, mealType, dateString],
		});
	};

	return (
		<Card
			className="overflow-hidden p-0 duration-200 hover:scale-[1.02]"
			onClick={menu.liked ? handleUnlike : handleLike}
		>
			{!menu.lunchBox && (
				<div className="relative">
					<img
						src={menu.imageUrl || ''}
						alt={menu.name}
						className="h-[250px] w-full object-cover"
					/>
					{menu.calories !== 0 && (
						<Badge className="absolute bottom-2 left-2 px-2">{menu.calories}kcal</Badge>
					)}
					<Badge className="absolute bottom-2 right-2 flex items-center gap-1 bg-white px-2 text-black hover:scale-110 hover:bg-white">
						{menu.liked ? (
							<GoHeartFill className="size-4" fill="red" />
						) : (
							<GoHeart className="size-4" />
						)}
						{menu.likeCount}
					</Badge>
				</div>
			)}

			<div className="p-3">
				<div className="flex justify-between">
					<CardTitle className="text-base">{menu.name}</CardTitle>
					{menu.lunchBox && (
						<div className="flex gap-2">
							<Badge className="flex items-center gap-1 bg-white px-2 text-black hover:scale-110 hover:bg-white">
								{menu.liked ? (
									<GoHeartFill className="size-4" fill="red" />
								) : (
									<GoHeart className="size-4" />
								)}
								{menu.likeCount}
							</Badge>
							{menu.calories !== 0 && <Badge className="px-2">{menu.calories}kcal</Badge>}
							<Badge className="px-2">도시락</Badge>
						</div>
					)}
				</div>
				<CardDescription className="text-sm">{menu.description}</CardDescription>
			</div>
		</Card>
	);
}
