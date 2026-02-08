// RequireAuth.jsx
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router";
import {useAuth} from "../contexts/AuthContext.jsx";

export default function RequireAuth({children}) {
    const location = useLocation();
    const navigate = useNavigate();
    const {isAuthenticated} = useAuth();
    const [lastRequestedPath, setLastRequestedPath] = useState(null);

    // Save the path the user is trying to access
    useEffect(() => {
        if (!isAuthenticated) {
            setLastRequestedPath(location.pathname);
        }
    }, [location.pathname, isAuthenticated]);

    // Redirect to login if not authenticated, preserving the intended path
    useEffect(() => {
        if (!isAuthenticated && lastRequestedPath) {
            // console.log("Redirecting to login from...", lastRequestedPath);
            navigate("/login", {
                replace: true,
                state: {from: {pathname: lastRequestedPath}},
            });
        }
    }, [isAuthenticated, lastRequestedPath, navigate]);

    // Show loading/redirecting state while checking auth
    if (!isAuthenticated) {
        return (
            <>
                <p>Redirecting to login...</p>
            </>
        );
    }

    return children;
}
