import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Gallery } from '../pages/Gallery';
import { About } from '../pages/About';

export const Router: React.FC = () => {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/gallery" element={<Gallery />} />
			<Route path="/gallery/:collection" element={<Gallery />} />
			<Route path="/about" element={<About />} />
		</Routes>
	);
};
