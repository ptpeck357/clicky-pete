/** Fisher-Yates over a copy, taking its randomness as an argument so callers can seed it. */
export const shuffleWith = <T>(array: T[], random: () => number): T[] => {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
};

export const shuffleArray = <T>(array: T[]): T[] => shuffleWith(array, Math.random);
