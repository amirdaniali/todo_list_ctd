import {useAuth} from "../contexts/AuthContext.jsx";
import Navigation from "./Navigation.jsx";
import {useNavigate} from "react-router";

const componentStyle = {
    header: {
        color: "#333",
        margin: "20px 0",
        paddingBottom: "10px",
        borderBottom: "2px solid #007bff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerLeft: {
        textAlign: "left",
        fontFamily: "Arial, sans-serif",
        fontSize: "2rem",
        marginLeft: "10px",
    },
    headerRight: {
        display: "flex",
        alignItems: "center",
        marginRight: "10px",

    },
    headerMiddle: {},

    headerButton: {
        padding: "10px",
        border: "none",
        borderRadius: "4px",
        backgroundColor: "#007bff",
        color: "#fff",
        cursor: "pointer",
    }
};

export default function Header() {

    let {token, isAuthenticated, logout} = useAuth();
    let navigate = useNavigate();
    return (
        <header style={componentStyle.header} className="header">
            <h1 style={componentStyle.headerLeft}>Todo Tracker</h1>
            <Navigation></Navigation>
            <div className={"header-right"} style={componentStyle.headerRight}>
                {isAuthenticated ? <button style={componentStyle.headerButton}
                                           onClick={() => navigate('/logoff')}>Logout</button> : null}
            </div>


        </header>
    );
}

