import React from 'react';

export const Footer: React.FC = () => {
	return (
		<footer className="bg-gray-800 border-t border-gray-700">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
				<div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
					<div className="flex items-center space-x-2">
						<div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
							<svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<span className="text-white font-medium">Clicky Pete</span>
					</div>

					<div className="text-sm text-gray-400">
						<span>© 2026 Clicky Pete</span>
					</div>
				</div>
			</div>
		</footer>
	);
};
