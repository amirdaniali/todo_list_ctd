import {Link,} from "react-router";

const componentStyle = {
    footer: {
        position: "fixed",
        left: "0",
        bottom: "0",
        width: "100%",
        color: "#333",
        backgroundColor: "#fff",
        padding: "15px",
        borderTop: "2px solid #007bff",
        display: "flex",
        justifyContent: "space-between",
        fontSize: "1.2rem",
        alignItems: "center",
        boxSizing: "border-box",
    },
    footerLeft: {
        textAlign: "left",
        marginLeft: "20px",
    },
    footerMiddle: {
        textAlign: "left",
    },
    footerRight: {
        display: "flex",
        alignItems: "center",
        marginRight: "20px",
        color: "#007bff",
        textDecoration: "none",
    },
};

export default function Footer() {
    return (
        <footer style={componentStyle.footer} className="footer">
            <div style={componentStyle.footerLeft}>Code the dream React V4</div>
            <div style={componentStyle.footerMiddle}>
                Made with ❤️ by Amir Daniali
            </div>
            <Link style={componentStyle.footerRight} target="_blank"
                  to="https://github.com/amirdaniali/todo_list_ctd">Github Project</Link>

        </footer>
    );
}

