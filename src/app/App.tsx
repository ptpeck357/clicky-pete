import { BrowserRouter, useLocation } from 'react-router-dom';
import { Router } from './Router';
import { Header, Footer } from '../components/organisms';

function AppContent() {
	const location = useLocation();
	const isAboutPage = location.pathname === '/about';

	return (
		<div className="min-h-screen bg-gray-900">
			<Header />
			<main className="pt-16">
				<Router />
			</main>
			{!isAboutPage && <Footer />}
		</div>
	);
}

export default function App() {
	return (
		<BrowserRouter>
			<AppContent />
		</BrowserRouter>
	);
}
