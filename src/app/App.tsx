import { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { Router } from './Router';
import { Header, Footer } from '../components/organisms';

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

if (GA_MEASUREMENT_ID) {
	ReactGA.initialize(GA_MEASUREMENT_ID);
}

function AppContent() {
	const location = useLocation();
	const isAboutPage = location.pathname === '/about';

	useEffect(() => {
		if (GA_MEASUREMENT_ID) {
			ReactGA.send({ hitType: 'pageview', page: location.pathname });
		}
	}, [location]);

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
