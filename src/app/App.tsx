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
			{/* First Tab stop on every page, so a keyboard or screen-reader user can jump past the
			    nav. Above the fixed header's z-50, or it would appear underneath it. tabIndex on
			    <main> lets focus land there, not just the scroll position. */}
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-md focus:bg-gray-800 focus:text-white focus:ring-2 focus:ring-blue-400"
			>
				Skip to content
			</a>
			<Header />
			<main id="main-content" tabIndex={-1} className="pt-16 focus:outline-none">
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
