import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './assets/PretendardVariable.woff2';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthGuard } from './components/AuthGuard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import PreLoad from './components/Preload';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Infinity,
			retry: 0,
		},
	},
});

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<AuthGuard>
				<PreLoad />
				<App />
				<ToastContainer limit={1} />
			</AuthGuard>
		</QueryClientProvider>
	</StrictMode>,
);
