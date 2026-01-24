import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PhotoGrid } from '../components/organisms/PhotoGrid';
import { PhotoModal } from '../components/gallery/PhotoModal';
import { SearchBar } from '../components/filters/SearchBar';
import { usePhotos } from '../hooks/usePhotos';
import type { Photo } from '../types/photo';
import { Button } from '../components/atoms/Button';

export const Category: React.FC = () => {
	const { category } = useParams<{ category: string }>();
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { photos, loading, error, refetch } = usePhotos({
		category,
		search: searchQuery || undefined,
	});

	const handlePhotoClick = (photo: Photo) => {
		setSelectedPhoto(photo);
		setIsModalOpen(true);
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
		setSelectedPhoto(null);
	};

	const getCurrentPhotoIndex = () => {
		if (!selectedPhoto) return -1;
		return photos.findIndex((p) => p.key === selectedPhoto.key);
	};

	const handleNextPhoto = () => {
		const currentIndex = getCurrentPhotoIndex();
		if (currentIndex < photos.length - 1) {
			setSelectedPhoto(photos[currentIndex + 1]);
		}
	};

	const handlePreviousPhoto = () => {
		const currentIndex = getCurrentPhotoIndex();
		if (currentIndex > 0) {
			setSelectedPhoto(photos[currentIndex - 1]);
		}
	};

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="text-red-600 text-lg mb-4">Failed to load photos</div>
					<Button onClick={refetch}>Try Again</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-900">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<nav className="flex mb-6" aria-label="Breadcrumb">
					<ol className="flex items-center space-x-4">
						<li>
							<Link to="/" className="text-gray-400 hover:text-gray-300">
								Home
							</Link>
						</li>
						<li>
							<svg
								className="flex-shrink-0 h-5 w-5 text-gray-500"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
									clipRule="evenodd"
								/>
							</svg>
						</li>
						<li>
							<Link to="/gallery" className="text-gray-400 hover:text-gray-300">
								Gallery
							</Link>
						</li>
						<li>
							<svg
								className="flex-shrink-0 h-5 w-5 text-gray-500"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
									clipRule="evenodd"
								/>
							</svg>
						</li>
						<li className="text-white font-medium capitalize">{category}</li>
					</ol>
				</nav>

				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">{category} Photography</h1>
						<p className="text-gray-600">
							{loading ? 'Loading...' : `${photos.length} photos in this category`}
						</p>
					</div>

					<div className="mt-4 lg:mt-0 lg:w-96">
						<SearchBar onSearch={setSearchQuery} placeholder={`Search ${category} photos...`} />
					</div>
				</div>

				<div className="mb-6">
					<Link to="/gallery">
						<Button variant="secondary" size="sm">
							← Back to Gallery
						</Button>
					</Link>
				</div>

				<PhotoGrid photos={photos} loading={loading} onPhotoClick={handlePhotoClick} />

				{!loading && photos.length === 0 && (
					<div className="text-center py-12">
						<svg
							className="mx-auto h-12 w-12 text-gray-400 mb-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						<h3 className="text-lg font-medium text-gray-900 mb-2">No {category} photos found</h3>
						<p className="text-gray-500 mb-4">
							{searchQuery
								? `No photos match your search "${searchQuery}"`
								: `No photos in the ${category} category yet`}
						</p>
						<Link to="/upload">
							<Button>Upload Photos</Button>
						</Link>
					</div>
				)}
			</div>

			<PhotoModal
				photo={selectedPhoto}
				isOpen={isModalOpen}
				onClose={handleModalClose}
				onNext={getCurrentPhotoIndex() < photos.length - 1 ? handleNextPhoto : undefined}
				onPrevious={getCurrentPhotoIndex() > 0 ? handlePreviousPhoto : undefined}
			/>
		</div>
	);
};
