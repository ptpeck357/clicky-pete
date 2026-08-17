import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// `prompts` become the blank lines the message field is pre-filled with, so they only ask
// what actually varies for that shoot — headcount matters for a family, not for a headshot.
const PACKAGES = [
	{
		name: 'Portrait',
		price: 225,
		blurb: 'Headshots, seniors, solo sessions.',
		details: ['1 hour', '1 location', '25+ edited photos'],
		prompts: ['Preferred date(s)', 'Location ideas', 'What the photos are for', 'Anything else'],
		icon: (
			<>
				<circle cx="12" cy="8" r="3.5" />
				<path d="M5 20a7 7 0 0 1 14 0" />
			</>
		),
	},
	{
		name: 'Graduation',
		price: 250,
		blurb: 'Cap and gown, campus, or somewhere with a view.',
		details: ['1 hour', '2 locations', '30+ edited photos'],
		prompts: ['Preferred date(s)', 'Location ideas', 'School', 'Anything else'],
		icon: (
			<>
				<path d="M2 9l10-5 10 5-10 5z" />
				<path d="M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5" />
			</>
		),
	},
	{
		name: 'Family',
		price: 300,
		blurb: 'Up to 6 people, kids welcome.',
		details: ['1.5 hours', '1 location', '40+ edited photos'],
		prompts: [
			'Preferred date(s)',
			'Location ideas',
			"Who's coming (how many, and ages if there are kids)",
			'Anything else',
		],
		icon: (
			<>
				<circle cx="8" cy="8" r="3" />
				<circle cx="16.5" cy="9.5" r="2.5" />
				<path d="M2.5 20a5.5 5.5 0 0 1 11 0" />
				<path d="M15 20a4.5 4.5 0 0 1 6.5-4" />
			</>
		),
	},
	{
		name: 'Engagement',
		price: 375,
		blurb: 'Golden hour, wherever suits the two of you.',
		details: ['1.5 hours', '2 locations', '50+ edited photos'],
		prompts: ['Preferred date(s)', 'Location ideas', 'Wedding date, if you have one', 'Anything else'],
		icon: <path d="M12 20.5S4.5 15.6 4.5 10.2A3.7 3.7 0 0 1 12 8a3.7 3.7 0 0 1 7.5 2.2c0 5.4-7.5 10.3-7.5 10.3z" />,
	},
];

const CUSTOM_PROMPTS = ['What I have in mind', 'Preferred date(s)', 'Location ideas', 'How many people'];

// The peak is the same path as public/mountain.svg, inlined so it can take currentColor —
// the file itself is a black fill, which would vanish against this background.
const SectionDivider: React.FC = () => (
	<div className="px-6" aria-hidden="true">
		<div className="max-w-4xl mx-auto flex items-center gap-5">
			<div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-400" />
			<svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0 text-blue-400" fill="currentColor">
				<path d="M3 18L10 7l4 6 3-4 7 9H3z" />
			</svg>
			<div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-400" />
		</div>
	</div>
);

export const Contact: React.FC = () => {
	const formRef = useRef<HTMLDivElement>(null);
	const messageRef = useRef<HTMLTextAreaElement>(null);
	const autoSizedHeightRef = useRef<number | null>(null);
	const userResizedRef = useRef(false);
	const lastPrefillRef = useRef('');
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		subject: '',
		message: '',
		// Honeypot. Hidden from people, so anything here came from a bot filling in
		// every field it found. The server drops those silently.
		website: '',
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	// The textarea grows with what is in it, so nobody has to find the drag handle — which is
	// all but invisible on a dark field, and absent entirely on a phone. Capped at most of the
	// screen so a long message cannot push the send button out of reach; past that the textarea
	// scrolls itself. The min-height classes set the floor, since min-height beats an inline
	// height — which is why the floor is folded into the height recorded below.
	useEffect(() => {
		const field = messageRef.current;
		if (!field || userResizedRef.current) return;

		field.style.height = 'auto';
		const fitted = Math.min(field.scrollHeight, window.innerHeight * 0.6);
		field.style.height = `${fitted}px`;

		const floor = parseFloat(getComputedStyle(field).minHeight) || 0;
		autoSizedHeightRef.current = Math.max(fitted, floor);
	}, [formData.message]);

	// Dragging the corner still works, and wins: a height that is not the one just set can only
	// have come from the person, and auto-sizing would otherwise undo it on the next keystroke.
	useEffect(() => {
		const field = messageRef.current;
		if (!field) return;

		const observer = new ResizeObserver(() => {
			const height = field.getBoundingClientRect().height;
			if (autoSizedHeightRef.current !== null && Math.abs(height - autoSizedHeightRef.current) > 1) {
				userResizedRef.current = true;
			}
		});
		observer.observe(field);

		return () => observer.disconnect();
	}, []);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSelectPackage = (label: string, prompts: string[]) => {
		const intro =
			label === 'Custom'
				? "Hi Pete — I'd like a quote for something that isn't listed."
				: `Hi Pete — I'm interested in the ${label} session.`;
		// Blank line between each prompt so there is room to answer under it.
		const prefill = `${intro}\n\n${prompts.map((prompt) => `${prompt}:`).join('\n\n')}`;

		// Read the ref before reassigning it: the updater below runs after this function
		// returns, so comparing against lastPrefillRef.current there would compare the old
		// message with the new template and never match.
		const previousPrefill = lastPrefillRef.current;
		lastPrefillRef.current = prefill;

		setFormData((prev) => ({
			...prev,
			subject: label === 'Custom' ? 'Custom session' : `${label} session`,
			// Replace the message only when it is still empty or untouched since the last
			// time a button filled it in — never overwrite something they typed themselves.
			message: prev.message === '' || prev.message === previousPrefill ? prefill : prev.message,
		}));

		// Scroll only. Focusing the name field opened the browser's autofill list over the
		// form on phones, which is worse than letting them tap the field themselves.
		//
		// A card taller than the screen — which is every phone — is aligned by its bottom, so
		// the filled-in message and the send button are what comes into view rather than the
		// top of a form whose point is off screen.
		const card = formRef.current;
		if (card) {
			const tallerThanViewport = card.getBoundingClientRect().height > window.innerHeight;
			card.scrollIntoView({ behavior: 'smooth', block: tallerThanViewport ? 'end' : 'start' });
		}
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
				setFormData({ name: '', email: '', subject: '', message: '', website: '' });
				lastPrefillRef.current = '';
				userResizedRef.current = false;
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
		<div className="min-h-screen bg-gradient-to-br from-black via-gray-900 via-slate-800 via-blue-900 via-blue-700 via-sky-600 via-cyan-500 via-blue-600 via-indigo-700 via-indigo-900 via-slate-900 to-black flex flex-col">
			{/* Intro */}
			<div className="px-6 pt-8 sm:pt-14 lg:pt-24 pb-8 sm:pb-12">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7 }}
					className="w-full max-w-3xl mx-auto text-center"
				>
					<div className="relative block py-5 px-6 mb-5 sm:py-8 sm:px-8 sm:mb-8">
						<div className="absolute top-0 left-0 w-8 h-8 sm:w-10 sm:h-10 border-l-2 border-t-2 border-gray-600" />
						<div className="absolute top-0 right-0 w-8 h-8 sm:w-10 sm:h-10 border-r-2 border-t-2 border-gray-600" />
						<div className="absolute bottom-0 left-0 w-8 h-8 sm:w-10 sm:h-10 border-l-2 border-b-2 border-gray-600" />
						<div className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 border-r-2 border-b-2 border-gray-600" />
						<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-xs md:max-w-2xl text-center mx-auto">
							Let's capture <span className="text-blue-400">something</span> neat
						</h1>
					</div>

					<p className="text-gray-400 text-base sm:text-lg leading-relaxed">
						Have a shoot in mind? Want to collaborate? <br className="hidden sm:inline" />
						Pick a session below, or just send me a message.
					</p>
				</motion.div>
			</div>

			<SectionDivider />

			{/* Packages */}
			<section id="packages" className="px-6 pt-12 sm:pt-16 pb-16 sm:pb-20">
				<div className="w-full max-w-6xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.2 }}
						transition={{ duration: 0.6 }}
						className="text-center mb-8 sm:mb-10"
					>
						<h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
							Sessions &amp; <span className="text-blue-400">Pricing</span>
						</h2>
						<p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
							Based in Bozeman, Montana. Pick one and tell me what you have in mind.
						</p>
					</motion.div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
						{PACKAGES.map((pkg, i) => (
							<motion.div
								key={pkg.name}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.2 }}
								transition={{ duration: 0.5, delay: i * 0.08 }}
								className="flex flex-col bg-gray-800 border border-gray-600 rounded-2xl p-6 ring-1 ring-white/5 shadow-lg shadow-blue-950/20"
							>
								<div className="flex items-center gap-2">
									<svg
										viewBox="0 0 24 24"
										className="w-5 h-5 shrink-0 text-blue-400"
										fill="none"
										stroke="currentColor"
										strokeWidth={1.5}
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden="true"
									>
										{pkg.icon}
									</svg>
									<h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
										{pkg.name}
									</h3>
								</div>
								<p className="mt-3 text-white">
									<span className="text-sm text-gray-400">Starting at </span>
									<span className="text-3xl font-bold">${pkg.price}</span>
								</p>
								<p className="mt-3 text-sm text-gray-400 leading-relaxed">{pkg.blurb}</p>
								<ul className="mt-4 space-y-2 text-sm text-gray-300">
									{pkg.details.map((detail) => (
										<li key={detail} className="flex items-start gap-2">
											<svg
												className="w-4 h-4 mt-0.5 shrink-0 text-blue-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												aria-hidden="true"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 13l4 4L19 7"
												/>
											</svg>
											{detail}
										</li>
									))}
								</ul>
								<button
									type="button"
									onClick={() => handleSelectPackage(pkg.name, pkg.prompts)}
									className="mt-6 w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-medium text-sm"
								>
									Book {pkg.name}
								</button>
							</motion.div>
						))}
					</div>

					<div className="mt-8 text-center max-w-2xl mx-auto">
						<p className="text-sm text-gray-400 leading-relaxed">
							Every session includes an online gallery and a print release. Travel outside the Bozeman
							area, larger groups and extra time are quoted per shoot.
						</p>
						<button
							type="button"
							onClick={() => handleSelectPackage('Custom', CUSTOM_PROMPTS)}
							className="mt-4 px-5 py-3 bg-gray-800 border border-gray-600 text-gray-200 rounded-lg hover:border-blue-500 hover:text-white transition-colors cursor-pointer font-medium text-sm"
						>
							Something else? Get a custom quote
						</button>
					</div>
				</div>
			</section>

			<SectionDivider />

			{/* Contact form. scroll-mt on the card clears the fixed header, which would
			    otherwise cover its top when a package button scrolls it into view. */}
			<section className="px-6 pt-12 sm:pt-16 pb-16 sm:pb-20">
				<motion.div
					ref={formRef}
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.15 }}
					transition={{ duration: 0.6 }}
					className="w-full max-w-2xl mx-auto scroll-mt-24"
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
								{/*
								 * Positioned off-screen rather than display:none — some bots skip fields
								 * they can tell are hidden, but will fill anything they can read. aria-hidden
								 * and tabIndex keep it away from screen readers and keyboard users.
								 */}
								<div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
									<label htmlFor="website">Website (leave this empty)</label>
									<input
										type="text"
										id="website"
										name="website"
										value={formData.website}
										onChange={handleInputChange}
										tabIndex={-1}
										autoComplete="off"
									/>
								</div>

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
											autoComplete="off"
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
											autoComplete="off"
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
										placeholder="Grad photos, landscape prints, etc."
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
										ref={messageRef}
										rows={7}
										className={`${inputClass} resize-y overflow-y-auto min-h-48 sm:min-h-72`}
										placeholder="Tell me about your project"
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
			</section>
		</div>
	);
};
