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

	// Keyed on pathname, not the whole location: a query-string change is a filter or a sort
	// within the page you are already on, and yanking the viewport to the top mid-browse is not
	// what that click asked for. It also stops one pageview being sent per sort change.
	useEffect(() => {
		window.scrollTo(0, 0);
		if (GA_MEASUREMENT_ID) {
			ReactGA.send({ hitType: 'pageview', page: location.pathname });
		}
	}, [location.pathname]);

	return (
		<div className="min-h-screen bg-gray-900">
			<Header />
			<main className="pt-16">
				<Router />
			</main>
			<Footer />
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
