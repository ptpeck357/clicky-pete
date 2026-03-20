import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Gallery } from '../pages/Gallery';
import { About } from '../pages/About';
import { Contact } from '../pages/Contact';
import { Journal } from '../pages/Journal';
import { JournalDetail } from '../pages/JournalDetail';
import { NotFound } from '../pages/NotFound';

export const Router: React.FC = () => {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/gallery" element={<Gallery />} />
			<Route path="/gallery/:collection" element={<Gallery />} />
			<Route path="/about" element={<About />} />
			<Route path="/contact" element={<Contact />} />
			<Route path="/journal" element={<Journal />} />
			<Route path="/journal/:id" element={<JournalDetail />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
};
