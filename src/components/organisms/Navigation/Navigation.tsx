import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

interface NavigationProps {
	className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
	const location = useLocation();
	const { isAdmin, logout } = useAuth();

	const isActive = (path: string) => {
		return location.pathname === path;
	};

	const publicNavItems = [
		{ path: '/', label: 'Home' },
		{ path: '/gallery', label: 'Gallery' },
		{ path: '/about', label: 'About' },
	];

	const adminNavItems = [{ path: '/upload', label: 'Upload' }];

	return (
		<nav className={`flex items-center space-x-8 ${className}`}>
			{publicNavItems.map((item) => (
				<Link
					key={item.path}
					to={item.path}
					className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
						isActive(item.path) ? 'text-blue-400' : 'text-gray-300 hover:text-white'
					}`}
				>
					{item.label}
				</Link>
			))}

			{isAdmin && (
				<>
					{adminNavItems.map((item) => (
						<Link
							key={item.path}
							to={item.path}
							className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
								isActive(item.path) ? 'text-blue-400' : 'text-gray-300 hover:text-white'
							}`}
						>
							{item.label}
						</Link>
					))}
					<button
						onClick={logout}
						className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white transition-colors"
					>
						Logout
					</button>
				</>
			)}

			{!isAdmin && (
				<Link
					to="/admin"
					className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white transition-colors"
				>
					Admin
				</Link>
			)}
		</nav>
	);
};
