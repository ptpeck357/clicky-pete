import React from 'react';
import { motion } from 'framer-motion';

const SOCIALS = [
	{
		label: 'Instagram',
		href: 'https://instagram.com/clicky_pete',
		hoverClass: 'hover:text-pink-500',
		path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
	},
	{
		label: 'YouTube',
		href: 'https://www.youtube.com/@ptpeck357',
		hoverClass: 'hover:text-red-500',
		path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
	},
	{
		label: 'LinkedIn',
		href: 'https://www.linkedin.com/in/petertpeck/',
		hoverClass: 'hover:text-blue-500',
		path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
	},
];

export const Footer: React.FC = () => {
	return (
		<footer className="bg-gray-800 border-t border-gray-700">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
				{/* Three equal columns rather than justify-between, so the social icons sit on the
				    page's centre line instead of drifting with the width of the text either side. */}
				<div className="flex flex-col items-center gap-4 sm:grid sm:grid-cols-3 sm:gap-0">
					<motion.div
						className="flex items-center gap-6 text-sm sm:justify-self-start"
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
						className="flex items-center gap-5 sm:justify-self-center"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.9 }}
						viewport={{ once: true }}
					>
						{SOCIALS.map((social) => (
							<a
								key={social.label}
								href={social.href}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={social.label}
								className={`text-gray-400 transition-colors ${social.hoverClass}`}
							>
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d={social.path} />
								</svg>
							</a>
						))}
					</motion.div>

					<motion.div
						className="text-sm order-last sm:order-none sm:justify-self-end"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ duration: 0.6, delay: 1.0 }}
						viewport={{ once: true }}
					>
						<span className="text-gray-400">© 2026 Clicky Pete Photography</span>
					</motion.div>
				</div>
			</div>
		</footer>
	);
};
