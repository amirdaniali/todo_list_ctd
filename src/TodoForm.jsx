
const componentStyle = {
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        maxWidth: "300px",
        margin: "20px auto",
        padding: "15px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        fontFamily: "Arial, sans-serif",
    },
    label: {
        // display: "None",
        fontWeight: "bold",
        marginBottom: "5px",
        textAlign: "center",
    },
    input: {
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        outline: "none",
    },
    button: {
        padding: "10px",
        border: "none",
        borderRadius: "4px",
        backgroundColor: "#007bff",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        fontWeight: "bold",
        cursor: "pointer",
        opacity: 0.6,
    },
};

function TodoForm() {
    return (
        <form style={componentStyle.form}>
            <label htmlFor="todoTitle" style={componentStyle.label}>Todo</label>
            <input type="text" id="todoTitle" placeholder={"Todo text"} style={componentStyle.input} />
            <button type="submit" disabled style={componentStyle.button}>
                Add Todo
            </button>
        </form>
    );
}

export default TodoForm;
