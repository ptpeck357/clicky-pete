import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';

interface AdminLoginProps {
	onLoginSuccess?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const { login } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		const success = login(password);

		if (success) {
			setPassword('');
			onLoginSuccess?.();
		} else {
			setError('Invalid password');
		}

		setIsLoading(false);
	};

	return (
		<div className="min-h-screen bg-gray-900 flex items-center justify-center">
			<div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8">
				<div className="text-center mb-8">
					<h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
					<p className="text-gray-400">Enter password to access upload functionality</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<Input
							type="password"
							placeholder="Admin password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full"
							required
						/>
					</div>

					{error && <div className="text-red-400 text-sm text-center">{error}</div>}

					<Button type="submit" className="w-full" disabled={isLoading || !password.trim()}>
						{isLoading ? 'Logging in...' : 'Login'}
					</Button>
				</form>

				<div className="mt-6 text-center">
					<a href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
						← Back to Portfolio
					</a>
				</div>
			</div>
		</div>
	);
};
