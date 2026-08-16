import React from 'react';

interface TagProps {
	children: React.ReactNode;
	variant?: 'default' | 'blue' | 'green' | 'purple' | 'yellow' | 'red';
	size?: 'sm' | 'md';
	removable?: boolean;
	onRemove?: () => void;
}

export const Tag: React.FC<TagProps> = ({
	children,
	variant = 'default',
	size = 'sm',
	removable = false,
	onRemove,
}) => {
	const baseClasses = 'inline-flex items-center font-medium rounded-full';

	const variantClasses = {
		default: 'bg-gray-700 text-gray-200',
		blue: 'bg-blue-600 text-blue-100',
		green: 'bg-green-600 text-green-100',
		purple: 'bg-purple-600 text-purple-100',
		yellow: 'bg-yellow-600 text-yellow-100',
		red: 'bg-red-600 text-red-100',
	};

	const sizeClasses = {
		sm: 'px-1.5 py-0.5 text-[10px] md:px-2 md:py-1 md:text-xs',
		md: 'px-2 py-0.5 text-xs md:px-3 md:py-1 md:text-sm',
	};

	const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`;

	return (
		<span className={classes}>
			{children}
			{removable && onRemove && (
				<button onClick={onRemove} className="ml-2 text-current hover:text-white focus:outline-none">
					<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
						<path
							fillRule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clipRule="evenodd"
						/>
					</svg>
				</button>
			)}
		</span>
	);
};
