import React from 'react';

interface CardProps {
	children: React.ReactNode;
	className?: string;
	hover?: boolean;
	onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false, onClick }) => {
	const baseClasses = 'bg-white rounded-lg shadow-md overflow-hidden';
	const hoverClasses = hover ? 'hover:shadow-lg transition-shadow duration-200' : '';
	const clickableClasses = onClick ? 'cursor-pointer' : '';

	return (
		<div className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`} onClick={onClick}>
			{children}
		</div>
	);
};

interface CardHeaderProps {
	children: React.ReactNode;
	className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
	return <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>{children}</div>;
};

interface CardContentProps {
	children: React.ReactNode;
	className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
	return <div className={`px-6 py-4 ${className}`}>{children}</div>;
};

interface CardFooterProps {
	children: React.ReactNode;
	className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
	return <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50 ${className}`}>{children}</div>;
};
