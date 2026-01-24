import React from 'react';

export const About: React.FC = () => {
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Hero Section */}
			<section className="bg-white py-12 sm:py-16">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-8 sm:mb-12">
						<div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-300 rounded-full mx-auto mb-6 overflow-hidden">
							{/* Replace with actual profile photo */}
							<div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
								<svg
									className="w-12 h-12 sm:w-16 sm:h-16 text-white"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
						</div>
						<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">About Me</h1>
						<p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
							Passionate photographer capturing life's beautiful moments through my lens
						</p>

						{/* Social Media Links */}
						<div className="flex items-center justify-center space-x-6 mt-8">
							{/* LinkedIn */}
							<a
								href="https://linkedin.com/in/clickypete"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
								aria-label="LinkedIn Profile"
							>
								<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
									<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
								</svg>
							</a>

							{/* GitHub */}
							<a
								href="https://github.com/clickypete"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-400 hover:text-gray-900 transition-colors duration-200"
								aria-label="GitHub Profile"
							>
								<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
								</svg>
							</a>

							{/* Instagram Account 1 - Main Photography */}
							<a
								href="https://instagram.com/clickypete_photography"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-400 hover:text-pink-500 transition-colors duration-200"
								aria-label="Main Photography Instagram"
							>
								<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
								</svg>
							</a>

							{/* Instagram Account 2 - Landscapes */}
							<a
								href="https://instagram.com/clickypete_landscapes"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-400 hover:text-pink-500 transition-colors duration-200"
								aria-label="Landscape Photography Instagram"
							>
								<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
								</svg>
							</a>

							{/* Instagram Account 3 - Street Photography */}
							<a
								href="https://instagram.com/clickypete_street"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-400 hover:text-pink-500 transition-colors duration-200"
								aria-label="Street Photography Instagram"
							>
								<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
								</svg>
							</a>
						</div>
					</div>
				</div>
			</section>

			{/* Story Section */}
			<section className="py-12 sm:py-16">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="prose prose-lg mx-auto max-w-none">
						<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">My Story</h2>
						<div className="space-y-6 text-gray-600 leading-relaxed">
							<p>
								I got into photography when I was 12 years old. For my 11th birthday, I received a
								digital Kodak camera which then sat in my dresser... A year later, around June 2010, I
								decided to put my camera to use and start snapping landscape photos because how can you
								not when you grew up in Montana?
							</p>
							<p>
								Over the years since then, I've expanded out in my photography niches. Even though I've
								been doing photography for 16 plus years, there's always something new and exciting to
								learn; whether it's new editing tricks or different techniques while I'm out in the
								field!
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Skills & Equipment */}
			<section className="bg-white py-12 sm:py-16">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
						{/* Photography Styles */}
						<div>
							<h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Photography Styles</h3>
							<div className="space-y-3 sm:space-y-4">
								<div className="flex items-center">
									<div className="w-2 h-2 bg-blue-600 rounded-full mr-3 flex-shrink-0"></div>
									<span className="text-gray-700">Landscape Photography</span>
								</div>
								<div className="flex items-center">
									<div className="w-2 h-2 bg-blue-600 rounded-full mr-3 flex-shrink-0"></div>
									<span className="text-gray-700">Portrait Photography</span>
								</div>
								<div className="flex items-center">
									<div className="w-2 h-2 bg-blue-600 rounded-full mr-3 flex-shrink-0"></div>
									<span className="text-gray-700">Night Photography</span>
								</div>
								<div className="flex items-center">
									<div className="w-2 h-2 bg-blue-600 rounded-full mr-3 flex-shrink-0"></div>
									<span className="text-gray-700">Wildlife Photography</span>
								</div>
							</div>
						</div>

						{/* Equipment */}
						<div>
							<h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Equipment</h3>
							<div className="space-y-4">
								<div>
									<h4 className="font-medium text-gray-900 mb-1">Cameras</h4>
									<p className="text-gray-600 text-sm sm:text-base">Canon EOS 6D Mark II</p>
								</div>
								<div>
									<h4 className="font-medium text-gray-900 mb-1">Lenses</h4>
									<p className="text-gray-600 text-sm sm:text-base">
										24-70mm f/2.8, 70-200mm f/2.8, 50mm f/1.4
									</p>
								</div>
								<div>
									<h4 className="font-medium text-gray-900 mb-1">Accessories</h4>
									<p className="text-gray-600 text-sm sm:text-base">
										Drone, GoPro, Tripod, Len Filters
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};
