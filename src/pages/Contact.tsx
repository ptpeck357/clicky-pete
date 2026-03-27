import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const Contact: React.FC = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		subject: '',
		message: '',
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		const apiUrl = import.meta.env.VITE_CONTACT_API_URL;

		try {
			if (apiUrl) {
				const response = await fetch(`${apiUrl}/contact`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(formData),
				});

				if (!response.ok) {
					throw new Error('Failed to send message');
				}
			} else {
				await new Promise((resolve) => setTimeout(resolve, 1500));
			}

			setIsSubmitted(true);
			setTimeout(() => {
				setIsSubmitted(false);
				setFormData({ name: '', email: '', subject: '', message: '' });
			}, 3000);
		} catch (error) {
			console.error('Contact form error:', error);
			alert('Failed to send message. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	};

	const inputClass =
		'w-full px-4 py-3 bg-gray-800 border border-gray-500 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors';

	const labelClass = 'block text-xs font-semibold tracking-wider text-gray-400 uppercase mb-2';

	return (
		<div className="min-h-screen bg-gray-900 flex flex-col">
			<div className="flex-1 flex items-center justify-center px-6 py-12 sm:py-16 md:py-14 lg:py-32">
				<div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 md:gap-14 lg:gap-24 items-center">
					{/* Left — headline + socials */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.7 }}
					>
						<div className="relative block py-8 px-8 mb-8">
							<div className="absolute top-0 left-0 w-10 h-10 border-l-2 border-t-2 border-gray-600" />
							<div className="absolute top-0 right-0 w-10 h-10 border-r-2 border-t-2 border-gray-600" />
							<div className="absolute bottom-0 left-0 w-10 h-10 border-l-2 border-b-2 border-gray-600" />
							<div className="absolute bottom-0 right-0 w-10 h-10 border-r-2 border-b-2 border-gray-600" />
							<h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-xs md:max-w-sm text-center mx-auto">
								Let's capture <span className="text-blue-400">something</span> neat
							</h1>
						</div>

						<p className="text-gray-400 text-lg leading-relaxed">
							Have a shoot in mind? Want to collaborate? Or just want to say hi? Fill out the form and
							I'll get back to you.
						</p>
					</motion.div>

					{/* Right — form */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.7, delay: 0.15 }}
					>
						<div className="bg-gray-800 border border-gray-600 rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg shadow-blue-950/20 ring-1 ring-white/5">
							{isSubmitted ? (
								<motion.div
									className="text-center py-12"
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
								>
									<div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
										<svg
											className="w-8 h-8 text-white"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
									</div>
									<h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
									<p className="text-gray-400">Thanks for reaching out. I'll get back to you soon!</p>
								</motion.div>
							) : (
								<form onSubmit={handleSubmit} className="space-y-5">
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
										<div>
											<label htmlFor="name" className={labelClass}>
												Name
											</label>
											<input
												type="text"
												id="name"
												name="name"
												value={formData.name}
												onChange={handleInputChange}
												required
												className={inputClass}
												placeholder="John Doe"
											/>
										</div>
										<div>
											<label htmlFor="email" className={labelClass}>
												Email
											</label>
											<input
												type="email"
												id="email"
												name="email"
												value={formData.email}
												onChange={handleInputChange}
												required
												className={inputClass}
												placeholder="you@example.com"
											/>
										</div>
									</div>

									<div>
										<label htmlFor="subject" className={labelClass}>
											Subject
										</label>
										<input
											type="text"
											id="subject"
											name="subject"
											value={formData.subject}
											onChange={handleInputChange}
											required
											className={inputClass}
											placeholder="Wedding shoot, landscape prints, etc."
										/>
									</div>

									<div>
										<label htmlFor="message" className={labelClass}>
											Message
										</label>
										<textarea
											id="message"
											name="message"
											value={formData.message}
											onChange={handleInputChange}
											required
											rows={6}
											className={`${inputClass} resize-none`}
											placeholder="Tell me about your project, location, date, or anything else on your mind..."
										/>
									</div>

									<button
										type="submit"
										disabled={isSubmitting}
										className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3 cursor-pointer font-medium text-base"
									>
										{isSubmitting ? (
											<>
												<svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
													<circle
														className="opacity-25"
														cx="12"
														cy="12"
														r="10"
														stroke="currentColor"
														strokeWidth="4"
													/>
													<path
														className="opacity-75"
														fill="currentColor"
														d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
													/>
												</svg>
												Sending...
											</>
										) : (
											<>
												Send Message
												<svg
													className="w-4 h-4"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
													/>
												</svg>
											</>
										)}
									</button>
								</form>
							)}
						</div>
					</motion.div>
				</div>
			</div>
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.3 }}
				className="flex items-center justify-center gap-4 pb-8"
			>
				<a
					href="https://instagram.com/clicky_pete"
					target="_blank"
					rel="noopener noreferrer"
					className="group"
					aria-label="Instagram"
				>
					<div className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center group-hover:border-pink-500 transition-colors text-gray-400 group-hover:text-pink-500">
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
						</svg>
					</div>
				</a>
				<a
					href="https://www.youtube.com/@ptpeck357"
					target="_blank"
					rel="noopener noreferrer"
					className="group"
					aria-label="YouTube"
				>
					<div className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center group-hover:border-red-500 transition-colors text-gray-400 group-hover:text-red-500">
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
						</svg>
					</div>
				</a>
				<a
					href="https://www.linkedin.com/in/petertpeck/"
					target="_blank"
					rel="noopener noreferrer"
					className="group"
					aria-label="LinkedIn"
				>
					<div className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center group-hover:border-blue-500 transition-colors text-gray-400 group-hover:text-blue-500">
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
						</svg>
					</div>
				</a>
			</motion.div>
		</div>
	);
};
