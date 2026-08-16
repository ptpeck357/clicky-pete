import React from 'react';

interface PageLayoutProps {
	children: React.ReactNode;
	className?: string;
	maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
	padding?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
	children,
	className = '',
	maxWidth = 'xl',
	padding = true,
}) => {
	const maxWidthClasses = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-4xl',
		xl: 'max-w-7xl',
		'2xl': 'max-w-screen-2xl',
		full: 'max-w-none',
	};

	const paddingClasses = padding ? 'px-4 sm:px-6 lg:px-8' : '';

	return <div className={`${maxWidthClasses[maxWidth]} mx-auto ${paddingClasses} ${className}`}>{children}</div>;
};
