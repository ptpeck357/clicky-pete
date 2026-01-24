import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className = '', ...props }) => {
	const baseClasses =
		'w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors';
	const errorClasses = error ? 'border-red-500 focus:ring-red-500' : '';

	return (
		<div className="space-y-1">
			{label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
			<div className="relative">
				{icon && (
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
						{icon}
					</div>
				)}
				<input className={`${baseClasses} ${errorClasses} ${icon ? 'pl-10' : ''} ${className}`} {...props} />
			</div>
			{error && <p className="text-sm text-red-400">{error}</p>}
		</div>
	);
};
