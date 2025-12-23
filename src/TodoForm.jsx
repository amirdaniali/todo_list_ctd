import { useRef, useState } from "react";
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
    enabledButton: {
        padding: "10px",
        border: "none",
        borderRadius: "4px",
        backgroundColor: "#007bff",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        fontWeight: "bold",
        cursor: "pointer",
        // opacity: 0.6,
    },
    disabledButton: {
        padding: "10px",
        border: "none",
        borderRadius: "4px",
        backgroundColor: "#007bff",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        fontWeight: "bold",
        cursor: "pointer",
        opacity: 0.3,
    },
};

function TodoForm({ onAddTodo }) {

    let inputRef = useRef()

    let [workingTodoTitle, setWorkingTodoTitle] = useState("");

    const handleAddTodo = (event) => {
        event.preventDefault();

        if (workingTodoTitle && workingTodoTitle != null && workingTodoTitle != "") {
            onAddTodo(workingTodoTitle.trim());
            setWorkingTodoTitle("");
            inputRef.current.focus();
        }
    }

    return (
        <form style={componentStyle.form}>
            <label htmlFor="todoTitle" style={componentStyle.label}>Todo</label>
            <input
                ref={inputRef}
                required
                type="text"
                id="todoTitle"
                placeholder={"Todo text"}
                value={workingTodoTitle}
                onChange={(event) => setWorkingTodoTitle(event.target.value)}
                style={componentStyle.input} />
            <button
                style={!workingTodoTitle.trim() ?
                    componentStyle.disabledButton : componentStyle.enabledButton}
                disabled={!workingTodoTitle.trim()}
                type="submit"
                onClick={handleAddTodo}
            >
                Add Todo
            </button>
        </form>
    );
}

export default TodoForm;
