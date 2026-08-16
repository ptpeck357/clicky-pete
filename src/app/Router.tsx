import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Gallery } from '../pages/Gallery';
import { About } from '../pages/About';
import { Contact } from '../pages/Contact';
import { NotFound } from '../pages/NotFound';

// import.meta.env.DEV is replaced with a literal at build time. The import() must sit
// inside the false branch, not merely be referenced from one: a module-scope
// lazy(() => import(...)) is still reachable code and Rollup emits its chunk.
const AdminPage = import.meta.env.DEV ? lazy(() => import('../pages/Admin/AdminPage')) : null;

export const Router: React.FC = () => {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/gallery" element={<Gallery />} />
			<Route path="/gallery/:collection" element={<Gallery />} />
			<Route path="/about" element={<About />} />
			<Route path="/contact" element={<Contact />} />
			{import.meta.env.DEV && AdminPage && (
				<Route
					path="/admin"
					element={
						<Suspense fallback={null}>
							<AdminPage />
						</Suspense>
					}
				/>
			)}
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
};
