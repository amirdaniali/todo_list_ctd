import {useState} from "react";
import {useNavigate} from "react-router";
import {useAuth} from "../contexts/AuthContext.jsx";

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

export default function LogoffOage() {
    const [isLoggingOff, setIsLoggingOff] = useState(false);
    const [error, setError] = useState("");

    const {logout} = useAuth();
    const navigate = useNavigate();

    async function handleLogoff(e) {
        e.preventDefault();
        if (isLoggingOff) return;

        setIsLoggingOff(true);
        setError("");

        const result = await logout();

        if (result.success) {
            navigate("/login");
        } else {
            setError(result.error || "There was a problem logging out.");
            setIsLoggingOff(false);
        }
    }

    return (
        <div style={componentStyle.container}>
            {error && <span style={componentStyle.error}>Error: {error}</span>}

            <form onSubmit={handleLogoff}>
                <div style={componentStyle.formGroup}>
                    <label style={componentStyle.label}>
                        Are you sure you want to log off?
                    </label>
                </div>

                <button
                    type="submit"
                    style={{
                        ...componentStyle.button,
                        ...(isLoggingOff ? componentStyle.buttonDisabled : {})
                    }}
                    disabled={isLoggingOff}
                >
                    {isLoggingOff ? "Logging off..." : "Log Off"}
                </button>
            </form>
        </div>
    );
}
