import React from 'react';
import { PhotoUpload, AdminLogin } from '../components/organisms';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Upload: React.FC = () => {
	const navigate = useNavigate();
	const { isAdmin } = useAuth();

	const handleUploadComplete = () => {
		navigate('/gallery');
	};

	const handleLoginSuccess = () => {};

	if (!isAdmin) {
		return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
	}

	return (
		<div className="min-h-screen bg-gray-900 py-6 sm:py-8">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-6 sm:mb-8">
					<h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Upload Photos</h1>
					<p className="text-gray-400 text-sm sm:text-base">
						Add new photos to your portfolio with tags for easy organization
					</p>
				</div>

				<PhotoUpload onUploadComplete={handleUploadComplete} />

				<div className="mt-6 sm:mt-8 bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6">
					<h3 className="text-base sm:text-lg font-medium text-white mb-4">Upload Tips</h3>
					<ul className="space-y-2 text-gray-300 text-sm sm:text-base">
						<li className="flex items-start">
							<svg
								className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0"
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
								className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0"
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
								className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0"
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
								className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0"
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
