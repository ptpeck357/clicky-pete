import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface NavigationProps {
	className?: string;
	onItemClick?: () => void;
	isMobile?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ className = '', onItemClick, isMobile = false }) => {
	const location = useLocation();

	const isActive = (path: string) => {
		return location.pathname === path;
	};

	const handleItemClick = () => {
		onItemClick?.();
	};

	const navItems = [
		{ path: '/', label: 'Home' },
		{ path: '/gallery', label: 'Gallery' },
		{ path: '/about', label: 'About' },
	];

	const baseClasses = isMobile
		? 'block px-3 py-2 rounded-md text-base font-medium transition-colors w-full text-left'
		: 'px-3 py-2 rounded-md text-sm font-medium transition-colors';

	const containerClasses = isMobile
		? `flex flex-col space-y-2 ${className}`
		: `flex items-center space-x-8 ${className}`;

	return (
		<nav className={containerClasses}>
			{navItems.map((item) => (
				<motion.div key={item.path} whileTap={{ scale: 0.95 }}>
					<Link
						to={item.path}
						onClick={handleItemClick}
						className={`${baseClasses} ${
							isActive(item.path)
								? 'text-blue-400 bg-gray-800'
								: 'text-gray-300 hover:text-white hover:bg-gray-700'
						}`}
					>
						{item.label}
					</Link>
				</motion.div>
			))}
		</nav>
	);
};
