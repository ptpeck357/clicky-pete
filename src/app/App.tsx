import { BrowserRouter } from 'react-router-dom';
import { Router } from './Router';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { AuthProvider } from '../components/providers/AuthProvider';

export default function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<div className="min-h-screen bg-gray-900">
					<Header />
					<main className="pt-16">
						<Router />
					</main>
					<Footer />
				</div>
			</BrowserRouter>
		</AuthProvider>
	);
}
