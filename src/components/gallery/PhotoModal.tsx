import React, { useState } from 'react';
import type { Photo } from '../../types/photo';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface PhotoModalProps {
	photo: Photo | null;
	isOpen: boolean;
	onClose: () => void;
	onDelete?: (photo: Photo) => void;
	onNext?: () => void;
	onPrevious?: () => void;
}

export const PhotoModal: React.FC<PhotoModalProps> = ({ photo, isOpen, onClose, onDelete, onNext, onPrevious }) => {
	const [imageLoaded, setImageLoaded] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	if (!photo) return null;

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	const formatFileSize = (bytes: number) => {
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		if (bytes === 0) return '0 Bytes';
		const i = Math.floor(Math.log(bytes) / Math.log(1024));
		return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
	};

	const handleDelete = () => {
		if (onDelete) {
			onDelete(photo);
			setShowDeleteConfirm(false);
			onClose();
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="xl">
			<div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
				{/* Image */}
				<div className="flex-1">
					<div className="relative bg-gray-100 rounded-lg overflow-hidden">
						{!imageLoaded && (
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
							</div>
						)}
						<img
							src={photo.preSignedUrl}
							alt={photo.tags.category || 'Photo'}
							className={`w-full h-auto max-h-[50vh] lg:max-h-[70vh] object-contain transition-opacity duration-200 ${
								imageLoaded ? 'opacity-100' : 'opacity-0'
							}`}
							onLoad={() => setImageLoaded(true)}
						/>
					</div>

					{/* Navigation - Mobile Optimized */}
					<div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3 sm:gap-0">
						<Button
							variant="secondary"
							onClick={onPrevious}
							disabled={!onPrevious}
							className="w-full sm:w-auto text-sm"
						>
							← Previous
						</Button>

						<div className="flex gap-2 w-full sm:w-auto">
							<Button
								variant="secondary"
								onClick={() => window.open(photo.preSignedUrl, '_blank')}
								className="flex-1 sm:flex-none text-sm"
							>
								Open Original
							</Button>
							{onDelete && (
								<Button
									variant="danger"
									onClick={() => setShowDeleteConfirm(true)}
									className="flex-1 sm:flex-none text-sm"
								>
									Delete
								</Button>
							)}
						</div>

						<Button
							variant="secondary"
							onClick={onNext}
							disabled={!onNext}
							className="w-full sm:w-auto text-sm"
						>
							Next →
						</Button>
					</div>
				</div>

				{/* Photo Details */}
				<div className="lg:w-80 mt-4 lg:mt-0">
					<h3 className="text-lg font-semibold mb-4">Photo Details</h3>

					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">File Name</label>
							<p className="text-sm text-gray-900 break-all">{photo.key}</p>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Upload Date</label>
							<p className="text-sm text-gray-900">{formatDate(photo.lastModified)}</p>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">File Size</label>
							<p className="text-sm text-gray-900">{formatFileSize(photo.size)}</p>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
							<div className="space-y-2">
								{Object.entries(photo.tags).map(([key, value]) => (
									<div
										key={key}
										className="flex flex-col sm:flex-row sm:justify-between text-sm gap-1 sm:gap-0"
									>
										<span className="font-medium text-gray-600 capitalize">{key}:</span>
										<span className="text-gray-900">{value}</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Delete Confirmation Modal */}
			{showDeleteConfirm && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
						<h4 className="text-lg font-semibold mb-4">Delete Photo</h4>
						<p className="text-gray-600 mb-6">
							Are you sure you want to delete this photo? This action cannot be undone.
						</p>
						<div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
							<Button
								variant="secondary"
								onClick={() => setShowDeleteConfirm(false)}
								className="w-full sm:w-auto"
							>
								Cancel
							</Button>
							<Button variant="danger" onClick={handleDelete} className="w-full sm:w-auto">
								Delete
							</Button>
						</div>
					</div>
				</div>
			)}
		</Modal>
	);
};
