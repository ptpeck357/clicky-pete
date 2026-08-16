import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';

// Home stays eager — it is the landing page, and deferring it would add a round trip
// before anything renders. The rest load when navigated to.
const Gallery = lazy(() => import('../pages/Gallery').then((m) => ({ default: m.Gallery })));
const About = lazy(() => import('../pages/About').then((m) => ({ default: m.About })));
const Contact = lazy(() => import('../pages/Contact').then((m) => ({ default: m.Contact })));
const NotFound = lazy(() => import('../pages/NotFound').then((m) => ({ default: m.NotFound })));

// import.meta.env.DEV is replaced with a literal at build time. The import() must sit
// inside the false branch, not merely be referenced from one: a module-scope
// lazy(() => import(...)) is still reachable code and Rollup emits its chunk.
const AdminPage = import.meta.env.DEV ? lazy(() => import('../pages/Admin/AdminPage')) : null;

export const Router: React.FC = () => {
	return (
		// One boundary around the whole switch: the lazy routes are full pages, so there is
		// nothing useful to show beneath them while a chunk loads.
		<Suspense fallback={null}>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/gallery" element={<Gallery />} />
				<Route path="/gallery/:collection" element={<Gallery />} />
				<Route path="/about" element={<About />} />
				<Route path="/contact" element={<Contact />} />
				{import.meta.env.DEV && AdminPage && <Route path="/admin" element={<AdminPage />} />}
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Suspense>
	);
};
