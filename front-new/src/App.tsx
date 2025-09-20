import dayjs from 'dayjs';
import { FaHeart } from 'react-icons/fa';
import { Suspense, useRef } from 'react';
import { useDeleteLikeMutation, useGetTodayMenusQuery, usePostLikeMutation } from './hooks';
import type { Menu } from './types';
import { useSearchParams } from 'react-router';
import { Balloons } from './Balloons';

function App() {
	return (
		<>
			<Header />
			<Suspense
				fallback={
					<div className="flex flex-wrap gap-4 p-4">
						<Skeleton />
						<Skeleton />
						<Skeleton />
					</div>
				}
			>
				<Main />
			</Suspense>
		</>
	);
}

const Skeleton = () => {
	return (
		<div className="flex w-full flex-col gap-4 sm:w-96">
			<div className="skeleton h-60 w-full"></div>
			<div className="skeleton h-4 w-28"></div>
			<div className="skeleton h-4 w-full"></div>
			<div className="skeleton h-4 w-full"></div>
		</div>
	);
};

const Header = () => {
	// query string 변경
	const [searchParams, setSearchParams] = useSearchParams();
	const mealType = searchParams.get('mealType') ?? 'LUNCH';
	const handleMealType = (mealType: 'LUNCH' | 'DINNER') => {
		setSearchParams({ mealType });
	};

	return (
		<header className="navbar bg-base-100 shadow-sm">
			<div className="flex-1">
				<a className="btn btn-ghost text-xl">{dayjs().format('YYYY년 M월 D일')}</a>
			</div>
			<div role="tablist" className="tabs tabs-box">
				<a
					role="tab"
					className={mealType === 'LUNCH' ? 'tab tab-active' : 'tab'}
					onClick={() => handleMealType('LUNCH')}
				>
					점심
				</a>
				<a
					role="tab"
					className={mealType === 'DINNER' ? 'tab tab-active' : 'tab'}
					onClick={() => handleMealType('DINNER')}
				>
					저녁
				</a>
			</div>
		</header>
	);
};

const Main = () => {
	const [searchParams] = useSearchParams();
	const mealType = searchParams.get('mealType') ?? 'LUNCH';
	const { data: menus } = useGetTodayMenusQuery();

	return (
		<main className="flex flex-wrap gap-4 p-4">
			{menus.data.length === 0 && (
				<div className="flex w-full justify-center p-4">
					<p className="text-center text-[#555555]">데이터가 없습니다.</p>
				</div>
			)}
			{menus.data.length !== 0 &&
				menus.data.filter(menu => menu.mealType === mealType).map(menu => <MenuCard menu={menu} />)}
		</main>
	);
};

const MenuCard = ({ menu }: { menu: Menu }) => {
	const balloonsRef = useRef<{ launchAnimation: () => void } | null>(null);

	const handleLaunch = () => {
		if (balloonsRef.current) {
			balloonsRef.current.launchAnimation();
		}
	};

	const likeMutation = usePostLikeMutation();
	const unlikeMutation = useDeleteLikeMutation();

	const handleLike = () => {
		likeMutation.mutate(menu.id);
		handleLaunch();
	};

	const handleUnlike = () => {
		unlikeMutation.mutate(menu.id);
	};

	return (
		<div className="card bg-base-100 w-full shadow-sm sm:w-96">
			<figure>
				<img
					src={
						menu.imageUrl.length > 0
							? menu.imageUrl
							: 'https://cdn.shopify.com/s/files/1/0344/6469/files/cat-gif-loop-wheel_grande.gif?v=1523982721'
					}
					alt="Shoes"
					className="h-[250px] w-full object-cover"
				/>
			</figure>

			<div className="card-body">
				<h2 className="card-title">{menu.name}</h2>
				<p>{menu.description}</p>
				<div className="card-actions items-center justify-between">
					<div className="flex gap-2">
						{menu.calories !== 0 && (
							<div className="badge badge-soft badge-info">{menu.calories}kcal</div>
						)}
						{menu.lunchBox && <div className="badge badge-neutral">도시락</div>}
					</div>
					<button className="btn btn-ghost gap-2" onClick={menu.liked ? handleUnlike : handleLike}>
						<FaHeart className={menu.liked ? 'text-red-500' : 'text-red-200'} size={24} />
						{menu.likeCount}
					</button>
				</div>
			</div>
			<Balloons ref={balloonsRef} />
		</div>
	);
};

export default App;
