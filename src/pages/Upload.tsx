import React from 'react';
import { PhotoUpload } from '../components/gallery/PhotoUpload';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AdminLogin } from '../components/auth/AdminLogin';

export const Upload: React.FC = () => {
	const navigate = useNavigate();
	const { isAdmin } = useAuth();

	const handleUploadComplete = () => {
		// Navigate to gallery after successful upload
		navigate('/gallery');
	};

	const handleLoginSuccess = () => {
		// Stay on upload page after successful login
	};

	if (!isAdmin) {
		return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
	}

	return (
		<div className="min-h-screen bg-gray-900 py-8">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-white mb-2">Upload Photos</h1>
					<p className="text-gray-400">Add new photos to your portfolio with tags for easy organization</p>
				</div>

				<PhotoUpload onUploadComplete={handleUploadComplete} />

				{/* Upload Tips */}
				<div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-6">
					<h3 className="text-lg font-medium text-white mb-4">Upload Tips</h3>
					<ul className="space-y-2 text-gray-300">
						<li className="flex items-start">
							<svg
								className="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
								/>
							</svg>
							Use descriptive categories like "landscape", "portrait", "street" for better organization
						</li>
						<li className="flex items-start">
							<svg
								className="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
								/>
							</svg>
							Add location tags to showcase where your photos were taken
						</li>
						<li className="flex items-start">
							<svg
								className="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
								/>
							</svg>
							Include equipment information for technical reference
						</li>
						<li className="flex items-start">
							<svg
								className="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
								/>
							</svg>
							Supported formats: JPEG, PNG, GIF, WebP
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};
