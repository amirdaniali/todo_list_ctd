import {useNavigate} from 'react-router';

const componentStyle = {
    container: {
        maxWidth: "600px",
        margin: "40px auto",
        padding: "40px",
        borderRadius: "12px",
        background: "#ffffff",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.6",
    },
    title: {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#007bff",
        marginBottom: "20px",
        textAlign: "center",
    },
    subtitle: {
        fontSize: "18px",
        fontWeight: "bold",
        marginTop: "25px",
        color: "#333",
    },
    paragraph: {
        marginBottom: "14px",
        color: "#444",
    },
    list: {
        marginLeft: "20px",
        marginBottom: "14px",
        color: "#444",
    },
    button: {
        marginTop: "20px",
        padding: "10px 16px",
        border: "none",
        borderRadius: "6px",
        backgroundColor: "#007bff",
        color: "#fff",
        cursor: "pointer",
        fontSize: "14px",
    }
};

export default function AboutPage() {

    const navigate = useNavigate();

    return (
        <div style={componentStyle.container}>
            <h1 style={componentStyle.title}>About This Project</h1>

            <p style={componentStyle.paragraph}>
                <strong>Code the Dream – React V4</strong> is a learning project built as part of the Code the Dream
                React curriculum.
                This app is a fully interactive <strong>Todo List</strong> demonstrating key React concepts and
                real-world component architecture.
            </p>

            <h2 style={componentStyle.subtitle}>Project Highlights</h2>
            <ul style={componentStyle.list}>
                <li>Component-based architecture and modular structure</li>
                <li>State management using <code>useState</code>, <code>useReducer</code>, and Context</li>
                <li>Controlled forms and live validation</li>
                <li>Sorting, filtering, and dynamic UI updates</li>
                <li>Inline styling for consistency across components</li>
                <li>Navigation with React Router</li>
            </ul>

            <h2 style={componentStyle.subtitle}>Purpose</h2>
            <p style={componentStyle.paragraph}>
                The goal of this app is to practice creating a complete React project from scratch. We focus on clean,
                reusable code, state management, and intuitive user interaction.
                This Todo app evolves week by week with new functionality added as part of the learning journey.
            </p>


            <button style={componentStyle.button} onClick={() => navigate('/')}>
                Go back to homepage
            </button>
        </div>
    );
}
