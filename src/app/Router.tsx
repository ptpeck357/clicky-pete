import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Temporary placeholder pages (replace with real pages later)
function HomePage() {
	return <div className="p-6">Home</div>;
}
function GalleryPage() {
	return <div className="p-6">Gallery</div>;
}
function AboutPage() {
	return <div className="p-6">About</div>;
}
function ContactPage() {
	return <div className="p-6">Contact</div>;
}
function PhotoPage() {
	return <div className="p-6">Photo detail</div>;
}
function AdminPage() {
	return <div className="p-6">Admin</div>;
}

export function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/gallery" element={<GalleryPage />} />
				<Route path="/about" element={<AboutPage />} />
				<Route path="/contact" element={<ContactPage />} />

				{/* future */}
				<Route path="/photo/:id" element={<PhotoPage />} />
				<Route path="/admin" element={<AdminPage />} />

				{/* fallback */}
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	);
}
