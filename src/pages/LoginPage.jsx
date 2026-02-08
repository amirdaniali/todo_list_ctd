import {useState, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router';
import {useAuth} from '../contexts/AuthContext';

const componentStyle = {
    container: {
        maxWidth: "380px",
        margin: "40px auto",
        padding: "30px",
        borderRadius: "12px",
        background: "#ffffff",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
    },
    formGroup: {
        display: "flex",
        flexDirection: "column",
        marginBottom: "18px",
    },
    label: {
        marginBottom: "6px",
        fontWeight: "bold",
        color: "#333",
    },
    input: {
        padding: "10px 12px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "14px",
        transition: "border-color 0.2s",
    },
    inputFocus: {
        borderColor: "#007bff",
    },
    button: {
        padding: "12px",
        border: "none",
        borderRadius: "6px",
        backgroundColor: "#007bff",
        color: "#fff",
        cursor: "pointer",
        width: "100%",
        fontSize: "16px",
        marginTop: "10px",
        transition: "background-color 0.2s",
    },
    buttonDisabled: {
        backgroundColor: "#6c757d",
        cursor: "not-allowed",
    },
    error: {
        color: "#d9534f",
        marginBottom: "15px",
        display: "block",
        fontWeight: "bold",
    }
};

export default function LoginPage() {
    const {login, isAuthenticated} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [authError, setAuthError] = useState("");
    let [isLoggingOn, setIsLoggingOn] = useState(false);

    // Get intended destination from location state, default to /todos
    const from = location.state?.from?.pathname || '/todos';

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, {replace: true});
        }
    }, [isAuthenticated, navigate, from]);

    // Handle login form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoggingOn) return;

        setIsLoggingOn(true);
        let result = await login(email, password);
        setIsLoggingOn(false);

        if (result.success) {
            setAuthError("");
        } else {
            setAuthError(result.error);
        }
    };

    return (
        <div style={componentStyle.container}>
            {authError && <span style={componentStyle.error}>Error: {authError}</span>}

            <form onSubmit={handleSubmit}>
                <div style={componentStyle.formGroup}>
                    <label htmlFor="email" style={componentStyle.label}>Email</label>
                    <input
                        id="email"
                        type="email"
                        style={componentStyle.input}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div style={componentStyle.formGroup}>
                    <label htmlFor="password" style={componentStyle.label}>Password</label>
                    <input
                        id="password"
                        type="password"
                        style={componentStyle.input}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    style={{
                        ...componentStyle.button,
                        ...(isLoggingOn ? componentStyle.buttonDisabled : {})
                    }}
                    disabled={isLoggingOn}
                >
                    {isLoggingOn ? "Logging in..." : "Log On"}
                </button>
            </form>
        </div>
    );
}
