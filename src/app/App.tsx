import { BrowserRouter } from 'react-router-dom';
import { Router } from './Router';
import { Header, Footer } from '../components/organisms';
import { AuthProvider } from '../contexts';

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
