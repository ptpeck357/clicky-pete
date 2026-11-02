// Loaded as a blocking script in <head> so the stored theme applies before first paint. It is a
// file rather than inline because the CSP's script-src is 'self'. Dark is the default.
try {
	if (localStorage.getItem('theme') === 'light') {
		document.documentElement.classList.add('light');
	}
} catch {
	// Storage can be blocked (private modes, embedded contexts); dark is a safe fallback.
}
