import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const HERO_IMAGES = [
	'mountain_landscape.webp',
	'canyon_land.webp',
	'motorcycle.webp',
	'northern_lights.webp',
	'cover_photo.webp',
];
const PROFILE_BASE = '/photos/aboutme/profile/web';
const PROFILE_FILE = 'IMG_2993.webp';

export const About: React.FC = () => {
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

	return (
		<div className="min-h-screen bg-gray-900">
			{HERO_IMAGES.length > 0 && (
				<section className="relative w-full h-screen -mt-16 flex items-center justify-center overflow-hidden bg-gray-900">
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
									alt=""
									aria-hidden="true"
									className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 sm:hidden"
								/>
								<img
									src={`/photos/aboutme/hero/800/${image}`}
									srcSet={`
										/photos/aboutme/hero/400/${image} 400w,
										/photos/aboutme/hero/800/${image} 800w,
										/photos/aboutme/hero/2000/${image} 2000w
									`}
									sizes="100vw"
									alt="Hero"
									className="relative w-full h-full object-contain sm:object-cover"
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
						<h1 className="text-2xl sm:text-5xl md:text-7xl font-bold leading-tight [text-shadow:0_2px_20px_rgba(0,0,0,0.8),0_4px_40px_rgba(0,0,0,0.5)]">
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
						<>
							<div className="hidden sm:flex absolute bottom-6 left-1/2 transform -translate-x-1/2 gap-2 z-10">
								{HERO_IMAGES.map((_, index) => (
									<button
										key={index}
										onClick={() => setCurrentHeroIndex(index)}
										className={`w-2 h-2 rounded-full transition-all duration-300 ${
											index === currentHeroIndex
												? 'bg-white w-6'
												: 'bg-white/50 hover:bg-white/75'
										}`}
										aria-label={`Go to image ${index + 1}`}
									/>
								))}
							</div>
							<div className="flex sm:hidden absolute top-[calc(50%+34vw+2rem)] left-1/2 transform -translate-x-1/2 gap-2 z-10">
								{HERO_IMAGES.map((_, index) => (
									<button
										key={index}
										onClick={() => setCurrentHeroIndex(index)}
										className={`w-2 h-2 rounded-full transition-all duration-300 ${
											index === currentHeroIndex
												? 'bg-white w-6'
												: 'bg-white/50 hover:bg-white/75'
										}`}
										aria-label={`Go to image ${index + 1}`}
									/>
								))}
							</div>
						</>
					)}
				</section>
			)}

			<div className="bg-[linear-gradient(to_bottom,#111827_0%,#0f172a_15%,#1e293b_30%,#1e2a4a_50%,#1e3a5f_70%,#243b5e_80%,#1e293b_90%,#111827_100%)]">
				<section id="about-content" className="pt-4 sm:pt-8 lg:pt-12 pb-12 sm:pb-16 lg:pb-20">
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
										<img
											src={`${PROFILE_BASE}/800/${PROFILE_FILE}`}
											srcSet={`
											${PROFILE_BASE}/400/${PROFILE_FILE} 400w,
											${PROFILE_BASE}/800/${PROFILE_FILE} 800w,
											${PROFILE_BASE}/2000/${PROFILE_FILE} 2000w
										`}
											sizes="(max-width: 768px) 100vw, 50vw"
											alt="Photographer with camera"
											className="w-full h-full object-cover"
										/>
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
									<div className="flex space-x-2">
										<div className="w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center text-black/70">
											<svg
												viewBox="0 0 10 10"
												className="w-2 h-2"
												stroke="currentColor"
												strokeWidth="1.5"
												strokeLinecap="round"
												fill="none"
											>
												<path d="M2,2 L8,8 M8,2 L2,8" />
											</svg>
										</div>
										<div className="w-3.5 h-3.5 bg-yellow-500 rounded-full flex items-center justify-center text-black/70">
											<svg
												viewBox="0 0 10 10"
												className="w-2 h-2"
												stroke="currentColor"
												strokeWidth="1.5"
												strokeLinecap="round"
												fill="none"
											>
												<path d="M2,5 L8,5" />
											</svg>
										</div>
										<div className="w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center text-black/70">
											<svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="currentColor">
												<path d="M1.5,1.5 L6.5,1.5 L1.5,6.5 Z M8.5,8.5 L3.5,8.5 L8.5,3.5 Z" />
											</svg>
										</div>
									</div>
									<span className="text-gray-300 text-sm font-mono">about_me.tsx</span>
								</div>

								<div className="p-4 sm:p-6 font-mono text-xs sm:text-sm">
									<div className="mt-2">
										<div className="text-blue-400">
											<span className="text-purple-400">const</span> name ={' '}
											<span className="text-green-400">'Peter Peck'</span>;
										</div>
										<div className="text-blue-400">
											<span className="text-purple-400">let</span> location ={' '}
											<span className="text-green-400">'Bozeman, MT'</span>;
										</div>
										<br />
										<div className="text-blue-400">
											<span className="text-purple-400">let</span> profession ={' '}
											<span className="text-green-400">'software_developer'</span>;
										</div>
										<br />
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
												For my 12th birthday, I received a digital Kodak camera which then sat
												on top of dresser for a year... The following summer, I felt guilty not
												putting my camera to use. So that's when I started taking hundreds of
												bad photos — perhaps even millions. You could say I got a little
												"clicky-happy" with the shutter release. How can you not when you grew
												up in Montana?
												<br />
												<br />
												Outside of work and photography, I enjoy spending time with people and
												learning what makes them tick. Beyond that, I enjoy hunting, fishing,
												camping, hiking, dirt biking, skiing, or playing pickup sports like
												ultimate frisbee, volleyball, and spikeball. Since I was always touching
												grass, I figured I might as well photograph the scenery!
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

				<div className="flex justify-center px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 lg:pb-20">
					<motion.div
						className="w-full max-w-lg bg-gray-800 rounded-2xl px-10 py-12 text-center"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
					>
						<motion.blockquote
							className="text-lg md:text-xl font-light text-gray-300 leading-relaxed"
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							viewport={{ once: true }}
						>
							Climb mountains not so the world can see you, but so you can see the world.
						</motion.blockquote>
						<motion.cite
							className="block mt-6 text-gray-500"
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							transition={{ duration: 0.6, delay: 0.5 }}
							viewport={{ once: true }}
						>
							— David McCullough Jr.
						</motion.cite>
					</motion.div>
				</div>
			</div>
		</div>
	);
};
