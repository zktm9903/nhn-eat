import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useState } from 'react';

type Notification = {
	id: number;
	message: string;
};

const NOTI: Notification[] = [
	{
		id: 1,
		message: '더 많은 짤, 카피바라 추가하였슴니다.',
	},
	{
		id: 2,
		message: '아이폰 앱 출시했슴니다. ㅇㅅㅇ 상단 메뉴에서 확인해주세요.',
	},
];

export default function NotificationBox() {
	const [notifications, setNotifications] = useState<Notification[]>([]);

	useEffect(() => {
		const notReadNoti = [];
		for (const notification of NOTI) {
			if (!localStorage.getItem(`notification-${notification.id}`)) {
				notReadNoti.push(notification);
			}
		}
		setNotifications(notReadNoti);
	}, []);

	const read = (id: number) => {
		localStorage.setItem(`notification-${id}`, 'true');
		setNotifications(notifications.filter(notification => notification.id !== id));
	};

	return (
		<div className="fixed bottom-2 right-2 z-50 flex flex-col items-end gap-2">
			{notifications.map(notification => (
				<Notification key={notification.id} notification={notification} read={read} />
			))}
		</div>
	);
}

function Notification({
	notification,
	read,
}: {
	notification: Notification;
	read: (id: number) => void;
}) {
	return (
		<div className="flex items-center gap-2 rounded-2xl bg-black py-2 pl-4 pr-2 text-white duration-200 hover:scale-[1.02]">
			<p>{notification.message}</p>
			<X size={20} onClick={() => read(notification.id)} className="cursor-pointer" />
		</div>
	);
}
