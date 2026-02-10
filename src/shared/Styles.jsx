const componentStyle = {
    page: {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        fontFamily: "Verdana, sans-serif",
        padding: "40px 20px",
        boxSizing: "border-box",
    },

    layout: {
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "2rem",
        margin: "0 auto",
        maxWidth: "1100px",
        width: "100%",
        flexWrap: "wrap",
    },

    sidebar: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        background: "#ffffff",
        borderRadius: "12px",
        padding: "24px 20px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        maxWidth: "280px",
        minWidth: "240px",
        gap: "1rem",
        flexShrink: 0,
    },

    controlsGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        width: "100%",
    },

    mainContent: {
        flex: 1,
        background: "#ffffff",
        borderRadius: "12px",
        padding: "30px 25px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        minWidth: "320px",
    },

    label: {
        fontWeight: "bold",
        marginRight: "8px",
        color: "#333",
    },

    input: {
        boxSizing: "border-box",
        padding: "10px 12px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "14px",
        width: "100%",
        marginTop: "6px",
    },

    select: {
        padding: "8px 10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "14px",
        width: "100%",
    },

    button: {
        padding: "10px 14px",
        border: "none",
        borderRadius: "6px",
        backgroundColor: "#007bff",
        color: "#fff",
        cursor: "pointer",
        fontSize: "14px",
        transition: "opacity 0.2s ease, background-color 0.2s ease",
    },

    buttonSecondary: {
        backgroundColor: "#6c757d",
    },

    errorBox: {
        boxSizing: "border-box",
        backgroundColor: "#fef2f2",
        color: "#b30000",
        borderRadius: "8px",
        padding: "10px 12px",
        fontSize: "14px",
        width: "100%",
    },

    todoList: {
        listStyleType: "none",
        padding: 0,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },

    todoItem: {
        backgroundColor: "#f9fafc",
        border: "1px solid #e2e4ea",
        borderRadius: "8px",
        padding: "14px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        transition: "box-shadow 0.2s ease, transform 0.1s ease",
    },

    todoItemHover: {
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transform: "translateY(-1px)",
    },

    emptyList: {
        textAlign: "center",
        fontSize: "16px",
        color: "#666",
        padding: "20px",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
    },

    '@media (max-width: 768px)': {
        layout: {
            flexDirection: "column",
            gap: "1.5rem",
        },
        sidebar: {
            flexDirection: "row",
            flexWrap: "wrap",
            width: "100%",
            justifyContent: "space-between",
        },
        mainContent: {
            width: "100%",
        },
    },


    profileHeader: {
        marginBottom: "20px",
    },

    profileTitle: {
        margin: 0,
        color: "#222",
    },

    profileSubtitle: {
        marginTop: "6px",
        color: "#666",
        fontSize: "14px",
    },

    profileSection: {
        marginBottom: "24px",
    },

    profileSectionTitle: {
        marginBottom: "10px",
        color: "#333",
    },

    profileCard: {
        padding: "16px 18px",
        borderRadius: "10px",
        backgroundColor: "#f9fafc",
        border: "1px solid #e2e4ea",
    },

    profileParagraph: {
        margin: "0 0 8px",
    },

    profileParagraphLast: {
        margin: 0,
    },

    profileLoading: {
        color: "#555",
        margin: 0,
    },

    profileError: {
        marginTop: 0,
        marginBottom: "8px",
        color: "#b30000",
        fontSize: "14px",
    },

    profileEmpty: {
        margin: 0,
    },

    profileStatsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        gap: "10px",
        fontSize: "14px",
    },

    profileStatsLabel: {
        margin: "0 0 4px",
        color: "#555",
    },

    profileStatsValue: {
        margin: 0,
        fontWeight: 600,
    },

    aboutContainer: {
        maxWidth: "800px",
        margin: "40px auto",
        padding: "30px 24px",
        borderRadius: "12px",
        background: "#ffffff",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    },

    aboutTitle: {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#222",
        marginBottom: "16px",
        textAlign: "left",
    },

    aboutParagraph: {
        marginBottom: "14px",
        color: "#444",
        fontSize: "14px",
    },

    aboutSubtitle: {
        fontSize: "18px",
        fontWeight: "bold",
        marginTop: "24px",
        marginBottom: "10px",
        color: "#333",
    },

    aboutList: {
        marginLeft: "20px",
        marginBottom: "14px",
        color: "#444",
        fontSize: "14px",
    },

    aboutButtonWrapper: {
        marginTop: "24px",
    },

    aboutButton: {
        padding: "10px 16px",
        border: "none",
        borderRadius: "6px",
        backgroundColor: "#007bff",
        color: "#fff",
        cursor: "pointer",
        fontSize: "14px",
        transition: "background-color 0.2s ease",
    },
};

export {componentStyle};


