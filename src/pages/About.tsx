import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ContactModal } from '../components/organisms/ContactModal';
import { photoService } from '../services/photoService';

const HERO_IMAGES = ['canyon_land.webp', 'motorcycle.webp', 'northern_lights.webp', 'cover_photo.webp', 'moab.webp'];

export const About: React.FC = () => {
	const [isContactModalOpen, setIsContactModalOpen] = useState(false);
	const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
	const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

	// Parallax effect for hero background
	const { scrollY } = useScroll();
	const backgroundY = useTransform(scrollY, [0, 800], [0, -350]);
	const textY = useTransform(scrollY, [0, 500], [0, -150]);
	const textOpacity = useTransform(scrollY, [0, 400], [1, 0]);

	useEffect(() => {
		if (HERO_IMAGES.length <= 1) return;

		const interval = setInterval(() => {
			setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
		}, 2500);
		window.scrollTo(0, 0);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const loadProfileImage = async () => {
			try {
				const photos = await photoService.getPhotos();
				const profilePhoto = photos.find((photo) => photo.file === 'profile.webp');
				if (profilePhoto) {
					const cloudFrontUrl = import.meta.env.VITE_CLOUDFRONT_URL;
					if (cloudFrontUrl) {
						setProfileImageUrl(`${cloudFrontUrl}/photos/800/${profilePhoto.file}`);
					}
				}
			} catch (error) {
				console.error('Failed to load profile image:', error);
			}
		};

		loadProfileImage();
	}, []);

	return (
		<div className="min-h-screen bg-gray-900">
			{HERO_IMAGES.length > 0 && (
				<section className="relative w-full h-screen -mt-16 flex items-center justify-center overflow-hidden bg-black">
					<motion.div
						className="absolute inset-0 z-0 -top-[350px] -bottom-[350px]"
						style={{ y: backgroundY }}
					>
						{HERO_IMAGES.map((image, index) => (
							<div
								key={image}
								className="absolute inset-x-0 top-[350px] bottom-[350px] transition-opacity duration-1000 ease-in-out flex items-center justify-center"
								style={{ opacity: index === currentHeroIndex ? 1 : 0 }}
							>
								<img
									src={`/photos/aboutme/hero/800/${image}`}
									srcSet={`
										/photos/aboutme/hero/400/${image} 400w,
										/photos/aboutme/hero/800/${image} 800w,
										/photos/aboutme/hero/2000/${image} 2000w
									`}
									sizes="100vw"
									alt="Hero"
									className="w-full h-full object-contain sm:object-cover"
								/>
							</div>
						))}
					</motion.div>

					<div className="absolute inset-0 bg-gradient-to-b from-transparent from-70% to-gray-900 pointer-events-none" />

					<motion.div
						className="relative z-10 text-center"
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: 'easeOut' }}
						style={{ y: textY, opacity: textOpacity }}
					>
						<h1 className="text-2xl sm:text-5xl md:text-7xl font-bold leading-tight">
							Get to Know <span className="text-blue-400">Me</span>
						</h1>
					</motion.div>

					<div
						className="absolute bottom-[12%] left-1/2 -translate-x-1/2 z-10 cursor-pointer"
						onClick={() => document.getElementById('about-content')?.scrollIntoView({ behavior: 'smooth' })}
						aria-label="Scroll down"
					>
						<div className="scroll-arrow" />
					</div>

					{HERO_IMAGES.length > 1 && (
						<div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
							{HERO_IMAGES.map((_, index) => (
								<button
									key={index}
									onClick={() => setCurrentHeroIndex(index)}
									className={`w-2 h-2 rounded-full transition-all duration-300 ${
										index === currentHeroIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'
									}`}
									aria-label={`Go to image ${index + 1}`}
								/>
							))}
						</div>
					)}
				</section>
			)}

			<section id="about-content" className="bg-gray-900 py-4 sm:py-8 lg:py-12">
				<div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 md:items-stretch">
						<motion.div
							className="flex justify-center w-full md:h-full"
							initial={{ opacity: 0, x: 50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
						>
							<div className="relative w-full max-w-md md:max-w-2xl md:h-full my-4 md:my-0">
								<div className="w-full aspect-[3/4] md:aspect-auto md:h-full md:min-h-80 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg overflow-hidden flex items-center justify-center">
									{profileImageUrl ? (
										<img
											src={profileImageUrl}
											alt="Photographer with camera"
											className="w-full h-full object-cover"
										/>
									) : (
										<span className="text-white text-lg">Can't load image</span>
									)}
								</div>

								<div className="absolute bottom-4 left-4 text-left">
									<div className="text-white text-xl font-bold mb-1">Peter Peck</div>
									<div className="text-white-300 text-md">Bozeman, MT</div>
								</div>
							</div>
						</motion.div>

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
								<div className="mt-2">
									<div className="text-blue-400">
										<span className="text-purple-400">let</span> passion ={' '}
										<span className="text-green-400">'the_outdoors'</span>;
									</div>
									<div className="text-blue-400">
										<span className="text-purple-400">let</span> profession ={' '}
										<span className="text-green-400">'software_developer'</span>;
									</div>
								</div>

								<div className="mt-2">
									<div>
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
											For my 12th birthday, I received a digital Kodak camera which then sat on
											top of dresser for a year... The following summer, I felt guilty not putting
											my camera to use. So that’s when I started taking hundreds of bad photos —
											perhaps even millions. You could say I got a little “clicky-happy” with the
											shutter release. How can you not when you grew up in Montana???
											<br />
											<br />
											Outside of work and photography, I enjoy spending time with people and
											learning what makes them tick. Beyond that, I enjoy hunting, archery,
											fishing, camping, hiking, dirt biking, skiing, or playing pickup sports like
											ultimate frisbee, volleyball, and spikeball. Since I was always touching
											grass, I figured I might as well capture the scenery!
											<span className="text-blue-400 animate-blink">|</span>
										</div>
										<div className="text-gray-300">
											&lt;/<span className="text-red-400">Bio</span>&gt;
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			<div className="bg-gray-900 py-7 sm:py-12">
				<div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
					<div className="relative flex justify-center">
						<div className="bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 h-0.5 w-full rounded-full"></div>
					</div>
				</div>
			</div>

			<section className="bg-gray-900 py-7 sm:py-16">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
						>
							<div className="flex items-center mb-6">
								<svg
									className="w-5 h-5 text-blue-400 mr-3"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<h3 className="text-xl font-bold text-white">THE JOURNEY</h3>
							</div>

							<div className="relative">
								<div className="absolute left-3 top-0 h-full w-0.5 bg-gray-700" />

								<div className="space-y-7">
									<div className="relative flex items-start pl-10">
										<div className="absolute left-0 w-6 h-6 bg-gray-800 border-2 border-blue-500 rounded-full flex items-center justify-center z-10">
											<svg
												className="w-3 h-3 text-blue-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
												/>
											</svg>
										</div>
										<div>
											<h4 className="text-base font-bold text-white">2009</h4>
											<p className="text-gray-400 text-sm">
												First camera, received as a birthday gift
											</p>
										</div>
									</div>

									<div className="relative flex items-start pl-10">
										<div className="absolute left-0 w-6 h-6 bg-gray-800 border-2 border-green-500 rounded-full flex items-center justify-center z-10">
											<svg
												className="w-3 h-3 text-green-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
												/>
											</svg>
										</div>
										<div>
											<h4 className="text-base font-bold text-white">2010</h4>
											<p className="text-gray-400 text-sm">Beginning of landscape photography</p>
										</div>
									</div>

									<div className="relative flex items-start pl-10">
										<div className="absolute left-0 w-6 h-6 bg-gray-800 border-2 border-purple-500 rounded-full flex items-center justify-center z-10">
											<svg
												className="w-3 h-3 text-purple-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
												/>
											</svg>
										</div>
										<div>
											<h4 className="text-base font-bold text-white">2013</h4>
											<p className="text-gray-400 text-sm">Canon T3i enters the journey</p>
										</div>
									</div>

									<div className="relative flex items-start pl-10">
										<div className="absolute left-0 w-6 h-6 bg-gray-800 border-2 border-blue-500 rounded-full flex items-center justify-center z-10">
											<svg
												className="w-3 h-3 text-blue-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
												/>
											</svg>
										</div>
										<div>
											<h4 className="text-base font-bold text-white">2016</h4>
											<p className="text-gray-400 text-sm">
												Discovering astrophotography and long exposures
											</p>
										</div>
									</div>

									<div className="relative flex items-start pl-10">
										<div className="absolute left-0 w-6 h-6 bg-gray-800 border-2 border-green-500 rounded-full flex items-center justify-center z-10">
											<svg
												className="w-3 h-3 text-green-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 10l7-7m0 0l7 7m-7-7v18"
												/>
											</svg>
										</div>
										<div>
											<h4 className="text-base font-bold text-white">2020</h4>
											<p className="text-gray-400 text-sm">Upgraded to full-frame DLSR camera</p>
										</div>
									</div>

									<div className="relative flex items-start pl-10">
										<div className="absolute left-0 w-6 h-6 bg-gray-800 border-2 border-purple-500 rounded-full flex items-center justify-center z-10">
											<svg
												className="w-3 h-3 text-purple-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
												/>
											</svg>
										</div>
										<div>
											<h4 className="text-base font-bold text-white">2020</h4>
											<p className="text-gray-400 text-sm">
												First engagement, wedding, and graduation shoots
											</p>
										</div>
									</div>

									<div className="relative flex items-start pl-10">
										<div className="absolute left-0 w-6 h-6 bg-gray-800 border-2 border-blue-500 rounded-full flex items-center justify-center z-10">
											<svg
												className="w-3 h-3 text-blue-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
												/>
											</svg>
										</div>
										<div>
											<h4 className="text-base font-bold text-white">2021</h4>
											<p className="text-gray-400 text-sm">Introducing aerial photography</p>
										</div>
									</div>
								</div>
							</div>
						</motion.div>

						{/* Mobile divider - only shows when stacked */}
						<div className="lg:hidden flex justify-center py-7">
							<div className="bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 h-0.5 w-full max-w-4xl rounded-full"></div>
						</div>

						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							viewport={{ once: true }}
						>
							<div className="flex items-center mb-6">
								<svg
									className="w-5 h-5 text-blue-400 mr-3"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
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
											Adobe Lightroom
										</span>
										<span className="bg-gray-700 border border-purple-500 text-purple-400 px-4 py-2 rounded-lg text-sm font-mono hover:bg-purple-500 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
											Adobe Bridge
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

			<div className="bg-gray-900 py-7">
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

			<section className="bg-gray-900 py-7 sm:py-16">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					<motion.div
						className="text-center"
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
					>
						<h3 className="text-2xl sm:text-3xl font-bold text-white mb-8">Gear in Motion</h3>
						<div className="space-y-8">
							<div className="relative w-full max-w-4xl mx-auto">
								<div className="aspect-video bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
									<iframe
										width="100%"
										height="100%"
										src="https://www.youtube.com/embed/GQ17DyRhXBA?si=dAvh8Mes2DBW6-3P"
										title="YouTube video player"
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
										referrerPolicy="strict-origin-when-cross-origin"
										allowFullScreen
										className="w-full h-full"
									></iframe>
								</div>
							</div>
							<div className="relative w-full max-w-4xl mx-auto">
								<div className="aspect-video bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
									<iframe
										width="100%"
										height="100%"
										src="https://www.youtube.com/embed/hTJs0CMkr-M?si=uM65YvjelRPPKEC9"
										title="YouTube video player"
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
										referrerPolicy="strict-origin-when-cross-origin"
										allowFullScreen
										className="w-full h-full"
									></iframe>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</section>

			<footer className="bg-gray-800 py-8">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
					<div className="relative text-center py-8 px-8">
						<div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-gray-600" />
						<div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-gray-600" />
						<div className="absolute bottom-0 left-0 w-12 h-12 border-l-2 border-b-2 border-gray-600" />
						<div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-gray-600" />
						<motion.h2
							className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
						>
							Let's capture <span className="text-blue-400">something</span>
							<br />
							<div className="mt-2">neat</div>
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
							<button
								onClick={() => setIsContactModalOpen(true)}
								className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-medium transition-colors duration-200 text-lg cursor-pointer"
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M7 6h10M7 10h10M7 14h6"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 10H5m1 4H5m1-8H5"
									/>
								</svg>
								GET IN TOUCH
							</button>
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
							{/* <a
								href="https://www.instagram.com/portrait.pete/"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-500 hover:text-white transition-colors"
							>
								<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
								</svg>
							</a> */}
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
							{/* <af
								href="https://www.instagram.com/perspective_pete/"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-500 hover:text-white transition-colors"
							>
								<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
								</svg>
							</af> */}
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
								<span className="text-black-400">© 2026 Clicky Pete Photography</span>
							</motion.div>
						</div>
					</div>
				</div>
			</footer>

			<ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
		</div>
	);
};
