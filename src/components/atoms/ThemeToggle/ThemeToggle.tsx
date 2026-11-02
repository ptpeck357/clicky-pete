import React from 'react';

interface ThemeToggleProps {
	className?: string;
}

// No React state: the theme lives on <html> (set before paint by public/theme-init.js), and the
// icon and label switch through the light: variant. Reading the theme during render would make
// the prerendered markup differ from the client's and break hydration.
export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
	const toggleTheme = () => {
		const isLight = document.documentElement.classList.toggle('light');
		try {
			localStorage.setItem('theme', isLight ? 'light' : 'dark');
		} catch {
			// Storage blocked: the switch still applies for this page load.
		}
	};

	return (
		<button
			type="button"
			onClick={toggleTheme}
			className={`p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 light:text-gray-700 light:hover:text-gray-900 light:hover:bg-gray-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 cursor-pointer ${className}`}
		>
			<span className="sr-only light:hidden">Switch to light mode</span>
			<span className="hidden light:inline sr-only">Switch to dark mode</span>

			{/* Sun, shown in dark mode */}
			<svg
				className="h-5 w-5 light:hidden"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={2}
				aria-hidden="true"
			>
				<circle cx="12" cy="12" r="4" />
				<path
					strokeLinecap="round"
					d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"
				/>
			</svg>

			{/* Moon, shown in light mode */}
			<svg
				className="h-5 w-5 hidden light:block"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={2}
				aria-hidden="true"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
				/>
			</svg>
		</button>
	);
};
