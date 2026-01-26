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
										<div className="ml-4 text-white-400">ABOUT ME</div>
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
											<span className="text-blue-400 animate-blink">|</span>
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
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
						>
							<div className="flex items-center mb-6">
								<div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
								<h3 className="text-xl font-bold text-white">SHOOTING STYLES</h3>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="bg-gray-800 rounded-lg p-4 text-center hover:bg-purple-600 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
									<span className="text-gray-300 text-sm font-medium hover:text-white transition-colors duration-300">
										Landscape Photography
									</span>
								</div>
								<div className="bg-gray-800 rounded-lg p-4 text-center hover:bg-purple-600 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
									<span className="text-gray-300 text-sm font-medium hover:text-white transition-colors duration-300">
										Portrait Photography
									</span>
								</div>
								<div className="bg-gray-800 rounded-lg p-4 text-center hover:bg-purple-600 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
									<span className="text-gray-300 text-sm font-medium hover:text-white transition-colors duration-300">
										Astrophotography
									</span>
								</div>
								<div className="bg-gray-800 rounded-lg p-4 text-center hover:bg-purple-600 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
									<span className="text-gray-300 text-sm font-medium hover:text-white transition-colors duration-300">
										Aerial Photography
									</span>
								</div>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							viewport={{ once: true }}
						>
							<div className="flex items-center mb-6">
								<div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
								<h3 className="text-xl font-bold text-white">GEAR</h3>
							</div>
							<div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
								<div className="mb-8">
									<div className="flex items-center mb-4">
										<div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
										<h4 className="text-blue-400 font-mono text-sm font-medium">BODIES & LENSES</h4>
									</div>
									<div className="flex flex-wrap gap-3">
										<span className="bg-gray-700 border border-blue-500 text-blue-400 px-4 py-2 rounded-lg text-sm font-mono hover:bg-blue-500 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
											Canon 6D Mark II
										</span>
										<span className="bg-gray-700 border border-blue-500 text-blue-400 px-4 py-2 rounded-lg text-sm font-mono hover:bg-blue-500 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
											Canon 24-70mm f/2.8 II
										</span>
										<span className="bg-gray-700 border border-blue-500 text-blue-400 px-4 py-2 rounded-lg text-sm font-mono hover:bg-blue-500 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
											Canon 70-200mm f/2.8 II
										</span>
										<span className="bg-gray-700 border border-blue-500 text-blue-400 px-4 py-2 rounded-lg text-sm font-mono hover:bg-blue-500 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
											Sigma 50mm f1.4
										</span>
									</div>
								</div>

								<div className="mb-8">
									<div className="flex items-center mb-4">
										<div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
										<h4 className="text-purple-400 font-mono text-sm font-medium">
											EDITING SOFTWARE
										</h4>
									</div>
									<div className="flex flex-wrap gap-3">
										<span className="bg-gray-700 border border-purple-500 text-purple-400 px-4 py-2 rounded-lg text-sm font-mono hover:bg-purple-500 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
											Adobe Lightroom Classic
										</span>
										<span className="bg-gray-700 border border-purple-500 text-purple-400 px-4 py-2 rounded-lg text-sm font-mono hover:bg-purple-500 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
											Adobe Bridge
										</span>
										<span className="bg-gray-700 border border-purple-500 text-purple-400 px-4 py-2 rounded-lg text-sm font-mono hover:bg-purple-500 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
											Adobe Photoshop
										</span>
										<span className="bg-gray-700 border border-purple-500 text-purple-400 px-4 py-2 rounded-lg text-sm font-mono hover:bg-purple-500 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
											Davinci Resolve
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
											DJI Air 2s
										</span>
										<span className="bg-gray-700 border border-green-500 text-green-400 px-4 py-2 rounded-lg text-sm font-mono hover:bg-green-500 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300">
											GoPro Hero 8
										</span>
									</div>
								</div>
							</div>
						</motion.div>
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
							<div className="mt-2">beautiful</div>
						</motion.h2>

						<motion.p
							className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							viewport={{ once: true }}
						>
							Tell me what you have in mind
						</motion.p>

						<motion.div
							className="mb-12"
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
							className="flex justify-center items-center gap-12 mb-10"
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							transition={{ duration: 0.6, delay: 0.6 }}
							viewport={{ once: true }}
						>
							<a
								href="https://instagram.com/clicky_pete"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-500 hover:text-white transition-colors"
							>
								<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
								</svg>
							</a>
							<a
								href="https://www.youtube.com/@ptpeck357"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-500 hover:text-white transition-colors"
							>
								<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
									<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
								</svg>
							</a>
							<a
								href="https://www.instagram.com/portrait.pete/"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-500 hover:text-white transition-colors"
							>
								<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
								</svg>
							</a>
							<a
								href="https://www.linkedin.com/in/petertpeck/"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-500 hover:text-white transition-colors"
							>
								<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
									<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
								</svg>
							</a>
							<a
								href="https://www.instagram.com/perspective_pete/"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-500 hover:text-white transition-colors"
							>
								<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
								</svg>
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
								<span className="text-purple-500">1/1050</span>
								<span className="text-lime-500">f/2.4</span>
							</motion.div>

							<motion.div
								className="text-sm mt-4 sm:mt-0 order-last sm:order-none"
								initial={{ opacity: 0 }}
								whileInView={{ opacity: 1 }}
								transition={{ duration: 0.6, delay: 1.0 }}
								viewport={{ once: true }}
							>
								<span className="text-black-400">© 2026 Peter Peck Photography</span>
							</motion.div>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
};
