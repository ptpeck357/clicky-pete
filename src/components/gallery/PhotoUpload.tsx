import React, { useState, useRef } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { useUpload } from '../../hooks/useUpload';
import type { PhotoUpload as PhotoUploadType } from '../../types/photo';

interface PhotoUploadProps {
	onUploadComplete?: () => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ onUploadComplete }) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [category, setCategory] = useState('');
	const [location, setLocation] = useState('');
	const [equipment, setEquipment] = useState('');
	const [style, setStyle] = useState('');
	const [dragOver, setDragOver] = useState(false);

	const { uploadPhoto, uploadMultiplePhotos, uploading, progress, error } = useUpload();

	const handleFileSelect = (files: FileList | null) => {
		if (!files) return;

		const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));

		setSelectedFiles((prev) => [...prev, ...imageFiles]);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setDragOver(false);
		handleFileSelect(e.dataTransfer.files);
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setDragOver(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setDragOver(false);
	};

	const removeFile = (index: number) => {
		setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
	};

	const handleUpload = async () => {
		if (selectedFiles.length === 0) return;

		const uploads: PhotoUploadType[] = selectedFiles.map((file) => ({
			file,
			category: category || undefined,
			location: location || undefined,
			equipment: equipment || undefined,
			style: style || undefined,
		}));

		try {
			if (uploads.length === 1) {
				await uploadPhoto(uploads[0]);
			} else {
				await uploadMultiplePhotos(uploads);
			}

			// Reset form
			setSelectedFiles([]);
			setCategory('');
			setLocation('');
			setEquipment('');
			setStyle('');

			onUploadComplete?.();
		} catch (err) {
			console.error('Upload failed:', err);
		}
	};

	return (
		<Card>
			<CardHeader>
				<h3 className="text-lg font-semibold">Upload Photos</h3>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					{/* File Drop Zone */}
					<div
						className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
							dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
						}`}
						onDrop={handleDrop}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onClick={() => fileInputRef.current?.click()}
					>
						<input
							ref={fileInputRef}
							type="file"
							multiple
							accept="image/*"
							className="hidden"
							onChange={(e) => handleFileSelect(e.target.files)}
						/>

						<svg
							className="mx-auto h-12 w-12 text-gray-400 mb-4"
							stroke="currentColor"
							fill="none"
							viewBox="0 0 48 48"
						>
							<path
								d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
								strokeWidth={2}
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>

						<p className="text-lg text-gray-600 mb-2">Drop photos here or click to select</p>
						<p className="text-sm text-gray-500">Supports JPEG, PNG, GIF, WebP</p>
					</div>

					{/* Selected Files */}
					{selectedFiles.length > 0 && (
						<div>
							<h4 className="font-medium mb-3">Selected Files ({selectedFiles.length})</h4>
							<div className="space-y-2 max-h-40 overflow-y-auto">
								{selectedFiles.map((file, index) => (
									<div
										key={index}
										className="flex items-center justify-between bg-gray-50 p-3 rounded"
									>
										<div className="flex items-center space-x-3">
											<div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
												<svg
													className="w-5 h-5 text-gray-500"
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path
														fillRule="evenodd"
														d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
														clipRule="evenodd"
													/>
												</svg>
											</div>
											<div>
												<p className="text-sm font-medium text-gray-900">{file.name}</p>
												<p className="text-xs text-gray-500">
													{(file.size / 1024 / 1024).toFixed(2)} MB
												</p>
											</div>
										</div>
										<button
											onClick={() => removeFile(index)}
											className="text-red-500 hover:text-red-700"
										>
											<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
												<path
													fillRule="evenodd"
													d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
													clipRule="evenodd"
												/>
											</svg>
										</button>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Tags Form */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
							<select
								value={category}
								onChange={(e) => setCategory(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="">Select category</option>
								<option value="landscape">Landscape</option>
								<option value="portrait">Portrait</option>
								<option value="street">Street</option>
								<option value="macro">Macro</option>
								<option value="wildlife">Wildlife</option>
								<option value="architecture">Architecture</option>
								<option value="abstract">Abstract</option>
								<option value="nature">Nature</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
							<input
								type="text"
								value={location}
								onChange={(e) => setLocation(e.target.value)}
								placeholder="e.g., Yosemite, Paris, Studio"
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Equipment</label>
							<input
								type="text"
								value={equipment}
								onChange={(e) => setEquipment(e.target.value)}
								placeholder="e.g., Canon 5D, iPhone 13"
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
							<input
								type="text"
								value={style}
								onChange={(e) => setStyle(e.target.value)}
								placeholder="e.g., black-white, golden-hour"
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					</div>

					{/* Upload Progress */}
					{uploading && (
						<div>
							<div className="flex justify-between text-sm text-gray-600 mb-1">
								<span>Uploading...</span>
								<span>{progress}%</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-2">
								<div
									className="bg-blue-600 h-2 rounded-full transition-all duration-300"
									style={{ width: `${progress}%` }}
								/>
							</div>
						</div>
					)}

					{/* Error Message */}
					{error && (
						<div className="bg-red-50 border border-red-200 rounded-md p-4">
							<p className="text-red-800">{error}</p>
						</div>
					)}

					{/* Upload Button */}
					<Button
						onClick={handleUpload}
						disabled={selectedFiles.length === 0 || uploading}
						loading={uploading}
						className="w-full"
					>
						Upload {selectedFiles.length > 0 && `${selectedFiles.length} `}Photo
						{selectedFiles.length !== 1 ? 's' : ''}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};
