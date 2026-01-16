import { useRef, useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel.jsx";
import { isValidTodoTitle } from "../../utils/todoValidation.js";
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

    let inputRef = useRef("")

    let [workingTodoTitle, setWorkingTodoTitle] = useState("");

    const handleAddTodo = (event) => {
        event.preventDefault();

        if (workingTodoTitle && workingTodoTitle !== "") {
            onAddTodo(workingTodoTitle.trim());
            setWorkingTodoTitle("");
            inputRef.current.focus();
        }
    }

    return (
        <form style={componentStyle.form}>
            <TextInputWithLabel labelText={"todo"} value={workingTodoTitle} elementId={"todoTitle"} ref={inputRef} onChange={(event) => setWorkingTodoTitle(event.target.value)} />
            <button
                style={!workingTodoTitle.trim() ?
                    componentStyle.disabledButton : componentStyle.enabledButton}
                disabled={!isValidTodoTitle(workingTodoTitle)}
                type="submit"
                onClick={handleAddTodo}
            >
                Add Todo
            </button>
        </form>
    );
}

export default TodoForm;
