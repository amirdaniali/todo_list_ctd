import {useState} from "react";

export default function Logon({onSetEmail, onSetToken}) {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [authError, setAuthError] = useState("");
    let [isLoggingOn, setIsLoggingOn] = useState(false);

    const baseUrl = import.meta.env.VITE_BASE_URL;

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isLoggingOn) {
            return
        }
        setIsLoggingOn(true);
        try {
            const response = await fetch(`${baseUrl}/user/logon`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({email, password})
            });
            const data = await response.json();
            if (response.status === 200 && data.name && data.csrfToken) {
                onSetEmail(data.name);
                onSetToken(data.csrfToken);
                setAuthError("");
            } else {
                setAuthError(`Authentication failed: ${data?.message}`);
            }
        } catch (error) {
            setAuthError(`Error: ${error.name} | ${error.message}`);
        } finally {
            setIsLoggingOn(false);
        }
    };

    return (
        <>
            <b>{authError ? `Error: ${authError}` : null}</b>
            < form>
                <label htmlFor="email">Email</label>
                <input id="email" type="email" onChange={(event) => setEmail(event.target.value)}></input>

                <label htmlFor="password">Password</label>
                <input id="password" type="password" onChange={(event) => setPassword(event.target.value)}></input>

                <button type="submit" onClick={handleSubmit} disabled={false}>
                    {isLoggingOn ? "Logging in..." : "Log On"}
                </button>

            </form>
        </>
    )
};