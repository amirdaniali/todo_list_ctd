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
            console.log("login response: " + JSON.stringify(data));

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


    const logout = async (userEmail, password) => {
        try {
            const options = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email: userEmail, password}),
                credentials: 'include',
            };

            const res = await fetch(`${baseUrl}/user/logoff`, options);
            const data = await res.json();

            if (res.status === 200 && data.name && data.csrfToken) {
                // Success: Update state
                setEmail("");
                setToken("");
                return {success: true};
            } else {
                setEmail("");
                setToken("");
                return {
                    success: false,
                    error: `Authentication failed: ${data?.message}`,
                };
            }
        } catch (error) {
            setEmail("");
            setToken("");
            return {
                success: false,
                error: 'Network error during logout',
            };
        } finally {
            setEmail("");
            setToken("");
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