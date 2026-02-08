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


    useEffect(() => {
        if (!isAuthenticated && lastRequestedPath) {

            navigate("/login", {
                replace: true,
                state: {from: {pathname: lastRequestedPath}},
            });
        }
    }, [isAuthenticated, lastRequestedPath, navigate]);

    if (!isAuthenticated) {
        return (
            <>
                <p>Redirecting to login...</p>
            </>
        );
    }

    return children;
}
