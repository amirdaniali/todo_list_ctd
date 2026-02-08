import {createContext, useContext, useState} from 'react';

// Create the context
const AuthContext = createContext();

const baseUrl = import.meta.env.VITE_BASE_URL;

// Custom hook with error checking
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({children}) {
    // State for authentication
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');

    const login = async (userEmail, password) => {
        try {
            const options = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email: userEmail, password: password}),
                credentials: 'include',
            };

            const res = await fetch(`${baseUrl}/user/logon`, options);
            const data = await res.json();
            // console.log("login response: " + JSON.stringify(data));

            if (res.status === 200 && data.name && data.csrfToken) {
                // Success: Update state
                setEmail(data.name);
                setToken(data.csrfToken);
                return {success: true};
            } else {
                // Failure: Return error
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
                // if body is empty or not JSON, ignore
            }

            // Treat 200 as success, and also treat 401 as "already logged out"
            if (res.status === 200 || res.status === 401) {
                setEmail("");
                setToken("");
                return {success: true};
            }

            setEmail("");
            setToken("");
            return {
                success: false,
                error: data?.message || `Logout failed: ${res.status}`,
            };
        } catch (error) {
            setEmail("");
            setToken("");
            return {
                success: false,
                error: 'Network error during logout',
            };
        }
    };


    // Context value object
    const value = {
        email,
        token,
        isAuthenticated: !!token,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}