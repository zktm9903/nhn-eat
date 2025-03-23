import { Smartphone } from 'lucide-react';
import { Button } from './ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog';

export default function MobileStore() {
	return (
		<Dialog>
			<DialogTrigger>
				<Button variant="outline" className="w-[20px]">
					<Smartphone />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>모바일 앱 다운로드</DialogTitle>
					<DialogDescription>아이폰 앱 스토어만 나와있슴니다..</DialogDescription>
					<div className="flex justify-center">
						<img src="/iphone-qr.png" alt="mobile-store" />
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
