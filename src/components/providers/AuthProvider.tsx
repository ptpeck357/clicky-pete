import React, { useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const ADMIN_PASSWORD = import.meta.env?.VITE_ADMIN_PASSWORD || 'clickypete2026';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [isAdmin, setIsAdmin] = useState(() => {
		return localStorage.getItem('isAdmin') === 'true';
	});

	const login = (password: string): boolean => {
		if (password === ADMIN_PASSWORD) {
			setIsAdmin(true);
			localStorage.setItem('isAdmin', 'true');
			return true;
		}
		return false;
	};

	const logout = () => {
		setIsAdmin(false);
		localStorage.removeItem('isAdmin');
	};

	return <AuthContext.Provider value={{ isAdmin, login, logout }}>{children}</AuthContext.Provider>;
};
