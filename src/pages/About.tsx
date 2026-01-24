import React from 'react';

export const About: React.FC = () => {
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Hero Section */}
			<section className="bg-white py-16">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-6 overflow-hidden">
							{/* Replace with actual profile photo */}
							<div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
								<svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
						</div>
						<h1 className="text-4xl font-bold text-gray-900 mb-4">About Me</h1>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto">
							Passionate photographer capturing life's beautiful moments through my lens
						</p>
					</div>
				</div>
			</section>

			{/* Story Section */}
			<section className="py-16">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="prose prose-lg mx-auto">
						<h2 className="text-3xl font-bold text-gray-900 mb-6">My Story</h2>
						<p className="text-gray-600 mb-6">
							Photography has been my passion for over a decade. What started as a hobby during college
							has evolved into a way of seeing and interpreting the world around me. I believe that every
							moment has a story to tell, and through my camera, I aim to capture those fleeting instances
							that might otherwise be forgotten.
						</p>
						<p className="text-gray-600 mb-6">
							My work spans various genres - from the grandeur of landscapes to the intimacy of portraits,
							from the energy of street photography to the delicate beauty of macro shots. Each category
							represents a different aspect of my photographic journey and my continuous quest to improve
							my craft.
						</p>
						<p className="text-gray-600 mb-8">
							This portfolio showcases my work organized by categories, locations, and the equipment used.
							It's built with modern web technologies including React, .NET, and AWS S3, allowing for
							efficient organization and presentation of my photographic collection.
						</p>
					</div>
				</div>
			</section>

			{/* Skills & Equipment */}
			<section className="bg-white py-16">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
						{/* Photography Styles */}
						<div>
							<h3 className="text-2xl font-bold text-gray-900 mb-6">Photography Styles</h3>
							<div className="space-y-4">
								<div className="flex items-center">
									<div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
									<span className="text-gray-700">Landscape Photography</span>
								</div>
								<div className="flex items-center">
									<div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
									<span className="text-gray-700">Portrait Photography</span>
								</div>
								<div className="flex items-center">
									<div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
									<span className="text-gray-700">Street Photography</span>
								</div>
								<div className="flex items-center">
									<div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
									<span className="text-gray-700">Macro Photography</span>
								</div>
								<div className="flex items-center">
									<div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
									<span className="text-gray-700">Wildlife Photography</span>
								</div>
								<div className="flex items-center">
									<div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
									<span className="text-gray-700">Architecture Photography</span>
								</div>
							</div>
						</div>

						{/* Equipment */}
						<div>
							<h3 className="text-2xl font-bold text-gray-900 mb-6">Equipment</h3>
							<div className="space-y-4">
								<div>
									<h4 className="font-medium text-gray-900">Cameras</h4>
									<p className="text-gray-600">Canon EOS 5D Mark IV, Sony α7R IV</p>
								</div>
								<div>
									<h4 className="font-medium text-gray-900">Lenses</h4>
									<p className="text-gray-600">24-70mm f/2.8, 70-200mm f/2.8, 16-35mm f/2.8</p>
								</div>
								<div>
									<h4 className="font-medium text-gray-900">Accessories</h4>
									<p className="text-gray-600">Tripods, Filters, External Flash, Drone</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};
