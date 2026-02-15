import {createContext, useContext, useState} from 'react';

const AuthContext = createContext();

const baseUrl = import.meta.env.VITE_BASE_URL;

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({children}) {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');

    const login = async (userEmail, password) => {
        try {
            if (userEmail === 'demo@amirdaniali.com' && password === 'demo') {
                setEmail('demo@amirdaniali.com');
                setToken('demo');
                return {success: true};
            }

            const options = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email: userEmail, password}),
                credentials: 'include',
            };

            const res = await fetch(`${baseUrl}/user/logon`, options);
            const data = await res.json();

            if (res.status === 200 && data.name && data.csrfToken) {
                setEmail(data.name);
                setToken(data.csrfToken);
                return {success: true};
            } else {
                return {
                    success: false,
                    error: `Authentication failed: ${data?.message}`,
                };
            }
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    };

    const logout = async () => {
        try {
            const options = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
            };

            const res = await fetch(`${baseUrl}/user/logoff`, options);
            let data = null;

            try {
                data = await res.json();
            } catch {
            }

            if (res.status === 200 || res.status === 401) {
                setEmail('');
                setToken('');
                return {success: true};
            }

            setEmail('');
            setToken('');
            return {
                success: false,
                error: data?.message || `Logout failed: ${res.status}`,
            };
        } catch (error) {
            setEmail('');
            setToken('');
            return {
                success: false,
                error: 'Network error during logout',
            };
        }
    };

    const value = {
        email,
        token,
        isAuthenticated: !!token,
        isDemoAccount: email === 'demo@amirdaniali.com',
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
