import { useState, useEffect } from 'react';
import { UserProfile, Company } from '../types';
import { MOCK_USERS } from '../constants';

export const useAppAuth = (currentCompany: Company) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('isAuthenticated') === 'true');
    const [showLandingPage, setShowLandingPage] = useState(() => localStorage.getItem('isAuthenticated') !== 'true');
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
    const [user, setUser] = useState<UserProfile>(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                return JSON.parse(savedUser);
            } catch (e) {
                console.error('Failed to parse saved user', e);
            }
        }
        return MOCK_USERS[1]; // Default to Bob
    });

    const handleLogin = (u: UserProfile) => {
        setIsAuthenticated(true);
        setUser(u);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(u));
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        setShowLandingPage(true);
    };

    const navigateToAuth = (mode?: 'login' | 'signup') => {
        setAuthMode(mode || 'login');
        setShowLandingPage(false);
    };

    const handleBackToLanding = () => setShowLandingPage(true);

    return {
        isAuthenticated,
        showLandingPage,
        authMode,
        user,
        setUser,
        handleLogin,
        handleLogout,
        navigateToAuth,
        handleBackToLanding
    };
};
