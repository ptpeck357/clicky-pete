import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../../hooks/useAuth';

interface NavigationProps {
	className?: string;
	onItemClick?: () => void;
	isMobile?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ className = '', onItemClick, isMobile = false }) => {
	const location = useLocation();
	const { isAdmin, logout } = useAuth();

	const isActive = (path: string) => {
		return location.pathname === path;
	};

	const handleItemClick = () => {
		onItemClick?.();
	};

	const handleLogout = () => {
		logout();
		onItemClick?.();
	};

	const publicNavItems = [
		{ path: '/', label: 'Home' },
		{ path: '/gallery', label: 'Gallery' },
		{ path: '/about', label: 'About' },
	];

	const adminNavItems = [{ path: '/upload', label: 'Upload' }];

	const baseClasses = isMobile
		? 'block px-3 py-2 rounded-md text-base font-medium transition-colors w-full text-left'
		: 'px-3 py-2 rounded-md text-sm font-medium transition-colors';

	const containerClasses = isMobile
		? `flex flex-col space-y-2 ${className}`
		: `flex items-center space-x-8 ${className}`;

	return (
		<nav className={containerClasses}>
			{publicNavItems.map((item) => (
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

			{isAdmin && (
				<>
					{adminNavItems.map((item) => (
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
					<motion.button
						onClick={handleLogout}
						className={`${baseClasses} text-gray-300 hover:text-white hover:bg-gray-700`}
						whileTap={{ scale: 0.95 }}
					>
						Logout
					</motion.button>
				</>
			)}

			{!isAdmin && (
				<motion.div whileTap={{ scale: 0.95 }}>
					<Link
						to="/admin"
						onClick={handleItemClick}
						className={`${baseClasses} text-gray-300 hover:text-white hover:bg-gray-700`}
					>
						{/* Admin */}
					</Link>
				</motion.div>
			)}
		</nav>
	);
};
