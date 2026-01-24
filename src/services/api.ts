const API_BASE_URL = import.meta.env?.VITE_API_URL || 'https://localhost:7000/api';

class ApiClient {
	private baseURL: string;

	constructor(baseURL: string) {
		this.baseURL = baseURL;
	}

	async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
		const url = `${this.baseURL}${endpoint}`;

		const config: RequestInit = {
			headers: {
				'Content-Type': 'application/json',
				...options.headers,
			},
			...options,
		};

		if (options.body instanceof FormData) {
			delete (config.headers as Record<string, string>)['Content-Type'];
		}

		try {
			const response = await fetch(url, config);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error('API request failed:', error);
			throw error;
		}
	}

	get<T>(endpoint: string): Promise<T> {
		return this.request<T>(endpoint, { method: 'GET' });
	}

	post<T>(endpoint: string, data?: unknown): Promise<T> {
		return this.request<T>(endpoint, {
			method: 'POST',
			body: data instanceof FormData ? data : JSON.stringify(data),
		});
	}

	put<T>(endpoint: string, data: unknown): Promise<T> {
		return this.request<T>(endpoint, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	}

	delete<T>(endpoint: string): Promise<T> {
		return this.request<T>(endpoint, { method: 'DELETE' });
	}
}

export const apiClient = new ApiClient(API_BASE_URL);
