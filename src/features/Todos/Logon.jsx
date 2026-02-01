import {useState} from "react";
import {useAuth} from "../../contexts/AuthContext.jsx";

export default function Logon() {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [authError, setAuthError] = useState("");
    let [isLoggingOn, setIsLoggingOn] = useState(false);

    let {login} = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoggingOn) {
            return;
        }
        setIsLoggingOn(true);
        let result = await login(email, password);
        setIsLoggingOn(false);
        if (result.success) {
            setAuthError("")
        } else {
            setAuthError(result.error);
        }

    }
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