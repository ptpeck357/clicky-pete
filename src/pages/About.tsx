import React from 'react';
import { motion } from 'framer-motion';

export const About: React.FC = () => {
	return (
		<div className="min-h-screen bg-gray-900">
			<section className="bg-gray-900 py-4 sm:py-8 lg:py-12">
				<div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
						<motion.div
							className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden w-full max-w-2xl"
							initial={{ opacity: 0, x: -50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}
						>
							<div className="bg-gray-700 px-4 py-2 flex items-center space-x-2">
								<div className="flex space-x-1">
									<div className="w-3 h-3 bg-red-500 rounded-full"></div>
									<div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
									<div className="w-3 h-3 bg-green-500 rounded-full"></div>
								</div>
								<span className="text-gray-300 text-sm font-mono">about_me.tsx</span>
							</div>

							<div className="p-4 sm:p-6 font-mono text-xs sm:text-sm">
								<div className="text-blue-400">
									<span className="text-purple-400">const</span> Photographer = () =&gt; &#123;
								</div>
								<div className="ml-2 sm:ml-4 mt-2">
									<div className="text-blue-400">
										<span className="text-purple-400">const</span> passion ={' '}
										<span className="text-green-400">'photography'</span>;
									</div>
									<div className="text-blue-400">
										<span className="text-purple-400">const</span> focus ={' '}
										<span className="text-green-400">'software_developer'</span>;
									</div>
								</div>

								<div className="ml-2 sm:ml-4 mt-4 text-blue-400">
									<span className="text-purple-400">return</span> (
								</div>

								<div className="ml-8 mt-2">
									<div className="text-gray-300">
										&lt;<span className="text-red-400">Container</span>&gt;
									</div>
									<div className="ml-4">
										<div className="text-gray-300">
											&lt;<span className="text-red-400">Title</span>&gt;
										</div>
										<div className="ml-4 text-green-400">
											"Developing perspective,
											<br />
											&nbsp;capturing timeless moments."
										</div>
										<div className="text-gray-300">
											&lt;/<span className="text-red-400">Title</span>&gt;
										</div>

										<div className="mt-2 text-gray-300">
											&lt;<span className="text-red-400">Bio</span>&gt;
										</div>
										<div className="ml-4 text-gray-300 leading-relaxed text-xs sm:text-sm">
											I got into photography when I was 12 years old. For my 11th birthday, I
											received a digital Kodak camera which then sat in my dresser...
											<br />
											<br />
											A year later, around June 2010, I decided to put my camera to use and start
											snapping landscape photos because how can you not when you grew up in
											Montana?
											<br />
											<br />
											Over the years since then, I've expanded out in my photography niches. Even
											though I've been doing photography for 16 plus years, there's always
											something new and exciting to learn!
										</div>
										<div className="text-gray-300">
											&lt;/<span className="text-red-400">Bio</span>&gt;
										</div>
									</div>
									<div className="text-gray-300">
										&lt;/<span className="text-red-400">Container</span>&gt;
									</div>
								</div>

								<div className="ml-4 mt-2 text-blue-400">);</div>
								<div className="text-blue-400">&#125;;</div>
							</div>
						</motion.div>

						<motion.div
							className="flex justify-center w-full"
							initial={{ opacity: 0, x: 50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
						>
							<div className="relative inline-block">
								<div className="w-64 h-80 sm:w-80 sm:h-96 lg:w-96 lg:h-[32rem] bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg overflow-hidden">
									<img
										src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=480&h=640&fit=crop&crop=face"
										alt="Photographer with camera"
										className="w-full h-full object-cover"
									/>
								</div>

								<div className="absolute bottom-4 left-4 text-left">
									<div className="text-white text-xl font-bold mb-1">Peter Peck</div>
									<div className="text-gray-300 text-sm">Bozeman, MT</div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			<div className="bg-gray-900 py-12">
				<div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
						</div>
						<div className="relative flex justify-center">
							<div className="bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 h-0.5 w-full max-w-4xl rounded-full"></div>
						</div>
					</div>
				</div>
			</div>

			<section className="bg-gray-900 py-12 sm:py-16">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
						<div>
							<div className="flex items-center mb-6">
								<div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
								<h3 className="text-xl font-bold text-white">PHOTOGRAPHY STYLES</h3>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="bg-gray-800 rounded-lg p-4 text-center hover:bg-purple-600 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
									<span className="text-gray-300 text-sm font-medium hover:text-white transition-colors duration-300">
										ARCHITECTURAL
									</span>
								</div>
								<div className="bg-gray-800 rounded-lg p-4 text-center hover:bg-purple-600 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
									<span className="text-gray-300 text-sm font-medium hover:text-white transition-colors duration-300">
										FINE ART PORTRAIT
									</span>
								</div>
								<div className="bg-gray-800 rounded-lg p-4 text-center hover:bg-purple-600 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
									<span className="text-gray-300 text-sm font-medium hover:text-white transition-colors duration-300">
										EDITORIAL
									</span>
								</div>
								<div className="bg-gray-800 rounded-lg p-4 text-center hover:bg-purple-600 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
									<span className="text-gray-300 text-sm font-medium hover:text-white transition-colors duration-300">
										DOCUMENTARY
									</span>
								</div>
							</div>
						</div>

						<div>
							<div className="flex items-center mb-6">
								<div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
								<h3 className="text-xl font-bold text-white">GEAR SYNTAX</h3>
							</div>
							<div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
								<div className="mb-8">
									<div className="flex items-center mb-4">
										<div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
										<h4 className="text-blue-400 font-mono text-sm font-medium">BODIES & LENSES</h4>
									</div>
									<div className="flex flex-wrap gap-3">
										<span className="bg-gray-700 border border-blue-500 text-blue-400 px-4 py-2 rounded-lg text-sm font-mono hover:bg-blue-500 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
											Sony A7R V
										</span>
										<span className="bg-gray-700 border border-blue-500 text-blue-400 px-4 py-2 rounded-lg text-sm font-mono hover:bg-blue-500 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
											35mm f/1.4 GM
										</span>
										<span className="bg-gray-700 border border-blue-500 text-blue-400 px-4 py-2 rounded-lg text-sm font-mono hover:bg-blue-500 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
											85mm f/1.2 L
										</span>
										<span className="bg-gray-700 border border-blue-500 text-blue-400 px-4 py-2 rounded-lg text-sm font-mono hover:bg-blue-500 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
											24-70mm f/2.8 II
										</span>
									</div>
								</div>

								<div className="mb-8">
									<div className="flex items-center mb-4">
										<div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
										<h4 className="text-purple-400 font-mono text-sm font-medium">
											DIGITAL WORKFLOW
										</h4>
									</div>
									<div className="flex flex-wrap gap-3">
										<span className="bg-gray-700 border border-purple-500 text-purple-400 px-4 py-2 rounded-lg text-sm font-mono hover:bg-purple-500 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
											Adobe Lightroom
										</span>
										<span className="bg-gray-700 border border-purple-500 text-purple-400 px-4 py-2 rounded-lg text-sm font-mono hover:bg-purple-500 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
											Capture One Pro
										</span>
										<span className="bg-gray-700 border border-purple-500 text-purple-400 px-4 py-2 rounded-lg text-sm font-mono hover:bg-purple-500 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
											Wacom Intuos
										</span>
									</div>
								</div>

								<div>
									<div className="flex items-center mb-4">
										<div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
										<h4 className="text-green-400 font-mono text-sm font-medium">
											AERIAL & MOTION
										</h4>
									</div>
									<div className="flex flex-wrap gap-3">
										<span className="bg-gray-700 border border-green-500 text-green-400 px-4 py-2 rounded-lg text-sm font-mono hover:bg-green-500 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300">
											DJI Mavic 3 Pro
										</span>
										<span className="bg-gray-700 border border-green-500 text-green-400 px-4 py-2 rounded-lg text-sm font-mono hover:bg-green-500 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300">
											Ronin RS3
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<footer className="bg-gray-800 py-8">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
					<div className="text-center">
						<motion.h2
							className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
						>
							Let's capture <span className="text-blue-400">something</span>
							<br />
							beautiful.
						</motion.h2>

						<motion.p
							className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							viewport={{ once: true }}
						>
							Ready to frame your story? Whether it's a creative editorial or a<br />
							high-end commercial project, I'm here to bring your vision to life.
						</motion.p>

						<motion.div
							className="mb-16"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}
							viewport={{ once: true }}
						>
							<a
								href="mailto:hello@clickypete.com"
								className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-medium transition-colors duration-200 text-lg"
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
								GET IN TOUCH
							</a>
						</motion.div>

						<motion.div
							className="flex justify-center items-center gap-12 mb-12"
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							transition={{ duration: 0.6, delay: 0.6 }}
							viewport={{ once: true }}
						>
							<a
								href="https://instagram.com/clickypete_photography"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-500 hover:text-white transition-colors text-sm font-medium"
							>
								INSTAGRAM
							</a>
							<a
								href="https://behance.net/clickypete"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-500 hover:text-white transition-colors text-sm font-medium"
							>
								BEHANCE
							</a>
							<a
								href="https://linkedin.com/in/clickypete"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-500 hover:text-white transition-colors text-sm font-medium"
							>
								LINKEDIN
							</a>
						</motion.div>

						<div className="flex flex-col sm:flex-row justify-between items-center">
							<motion.div
								className="flex items-center gap-6 text-sm mb-4 sm:mb-0"
								initial={{ opacity: 0 }}
								whileInView={{ opacity: 1 }}
								transition={{ duration: 0.6, delay: 0.8 }}
								viewport={{ once: true }}
							>
								<span className="text-blue-400">ISO 100</span>
								<span className="text-gray-500">1/750</span>
								<span className="text-gray-500">f/1.4</span>
							</motion.div>

							<motion.div
								className="text-sm mt-4 sm:mt-0 order-last sm:order-none"
								initial={{ opacity: 0 }}
								whileInView={{ opacity: 1 }}
								transition={{ duration: 0.6, delay: 1.0 }}
								viewport={{ once: true }}
							>
								<span className="text-green-400">© 2026 PETER PECK PHOTOGRAPHY.</span>
							</motion.div>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
};
