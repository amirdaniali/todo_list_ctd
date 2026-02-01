import {useAuth} from "../contexts/AuthContext.jsx";

const componentStyle = {
    heading: {
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        fontSize: "2rem",
        color: "#333",
        margin: "20px 0",
        paddingBottom: "10px",
        borderBottom: "2px solid #007bff",
    },
};

export default function Header() {
    let {token, isAuthenticated} = useAuth();
    return (
        <h1 style={componentStyle.heading}>Todo List</h1>
    )
}