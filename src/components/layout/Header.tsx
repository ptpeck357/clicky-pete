import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../organisms/Navigation';

export const Header: React.FC = () => {
	return (
		<header className="bg-gray-900 border-b border-gray-800 fixed w-full top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<Link to="/" className="flex items-center space-x-2">
						<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
							<svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<span className="text-xl font-bold text-white">Clicky Pete</span>
					</Link>

					{/* Navigation */}
					<Navigation className="hidden md:flex" />

					{/* Mobile menu button */}
					<div className="md:hidden">
						<button className="text-gray-300 hover:text-white focus:outline-none focus:text-white">
							<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</header>
	);
};
