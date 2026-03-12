import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { photoService } from '../services/photoService';

const HERO_IMAGES = ['canyon_land.webp', 'motorcycle.webp', 'northern_lights.webp', 'cover_photo.webp', 'moab.webp'];

export const About: React.FC = () => {
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
										<svg
											className="w-2/3 h-2/3 text-gray-400"
											viewBox="0 0 24 24"
											fill="currentColor"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
										</svg>
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
											my camera to use. So that's when I started taking hundreds of bad photos —
											perhaps even millions. You could say I got a little "clicky-happy" with the
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

			<div className="flex justify-center px-4 sm:px-6 lg:px-8 mb-16">
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
	);
};
