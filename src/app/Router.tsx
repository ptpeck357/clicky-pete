import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Gallery } from '../pages/Gallery';
import { About } from '../pages/About';
import { Contact } from '../pages/Contact';
import { Journal } from '../pages/Journal';
import { JournalDetail } from '../pages/JournalDetail';
import { NotFound } from '../pages/NotFound';

const isDev = import.meta.env.VITE_ENVIRONMENT === 'dev';

export const Router: React.FC = () => {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/gallery" element={<Gallery />} />
			<Route path="/gallery/:collection" element={<Gallery />} />
			<Route path="/about" element={<About />} />
			<Route path="/contact" element={<Contact />} />
			<Route path="/journal" element={isDev ? <Journal /> : <Navigate to="/404" replace />} />
			<Route path="/journal/:id" element={isDev ? <JournalDetail /> : <Navigate to="/404" replace />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
};
