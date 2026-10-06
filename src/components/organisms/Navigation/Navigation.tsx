import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

// The tap animation sits on the link itself. On a wrapping motion.div, Framer Motion gives the
// div tabIndex=0 so the gesture is keyboard-reachable, and every item became two Tab stops.
const MotionLink = motion.create(Link);

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
		{ path: '/contact', label: 'Contact' },
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
				<MotionLink
					key={item.path}
					to={item.path}
					onClick={handleItemClick}
					whileTap={{ scale: 0.95 }}
					className={`${baseClasses} ${
						isActive(item.path)
							? 'text-blue-400 bg-gray-800'
							: 'text-gray-300 hover:text-white hover:bg-gray-700'
					}`}
				>
					{item.label}
				</MotionLink>
			))}
		</nav>
	);
};
