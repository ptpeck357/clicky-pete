import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '../Navigation';

export const Header: React.FC = () => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	return (
		<header className="bg-gray-800 border-b border-gray-700 fixed w-full top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<Link to="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
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

					<Navigation className="hidden md:flex" />

					<div className="md:hidden">
						<motion.button
							className="text-gray-300 hover:text-white focus:outline-none focus:text-white p-2"
							onClick={toggleMobileMenu}
							whileTap={{ scale: 0.95 }}
						>
							<motion.svg
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
								transition={{ duration: 0.2 }}
							>
								{isMobileMenuOpen ? (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								) : (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16M4 18h16"
									/>
								)}
							</motion.svg>
						</motion.button>
					</div>
				</div>

				<AnimatePresence>
					{isMobileMenuOpen && (
						<motion.div
							className="md:hidden"
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3 }}
						>
							<div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-800">
								<Navigation
									className="flex flex-col space-y-2"
									onItemClick={() => setIsMobileMenuOpen(false)}
									isMobile={true}
								/>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</header>
	);
};
