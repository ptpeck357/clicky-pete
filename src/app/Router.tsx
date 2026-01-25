import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Gallery } from '../pages/Gallery';
import { Upload } from '../pages/Upload';
import { About } from '../pages/About';
import { AdminLogin } from '../components/auth/AdminLogin';

export const Router: React.FC = () => {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/gallery" element={<Gallery />} />
			<Route path="/gallery/:collection" element={<Gallery />} />
			<Route path="/upload" element={<Upload />} />
			<Route path="/about" element={<About />} />
			<Route path="/admin" element={<AdminLogin />} />
		</Routes>
	);
};
