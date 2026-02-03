import {useRef, useState} from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel.jsx";
import {isValidTodoTitle} from "../../utils/todoValidation.js";

const componentStyle = {
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        maxWidth: "500px",
        margin: "20px auto",
        padding: "20px",
        background: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        fontFamily: "Arial, sans-serif",
    },

    button: {
        padding: "12px",
        border: "none",
        borderRadius: "6px",
        backgroundColor: "#007bff",
        color: "#fff",
        cursor: "pointer",
        fontSize: "15px",
        transition: "background-color 0.2s",
    },

    buttonDisabled: {
        padding: "12px",
        border: "none",
        borderRadius: "6px",
        backgroundColor: "#6c757d",
        color: "#fff",
        cursor: "not-allowed",
        fontSize: "15px",
        opacity: 0.6,
    }
};

function TodoForm({onAddTodo}) {

    let inputRef = useRef("");

    let [workingTodoTitle, setWorkingTodoTitle] = useState("");

    const handleAddTodo = (event) => {
        event.preventDefault();

        if (workingTodoTitle.trim()) {
            onAddTodo(workingTodoTitle);
            setWorkingTodoTitle("");
            inputRef.current.focus();
        }
    };

    return (
        <form style={componentStyle.form}>
            <TextInputWithLabel
                labelText={"Todo Title"}
                value={workingTodoTitle}
                elementId={"todoTitle"}
                ref={inputRef}
                onChange={(event) => setWorkingTodoTitle(event.target.value)}
            />

            <button
                style={
                    !isValidTodoTitle(workingTodoTitle)
                        ? componentStyle.buttonDisabled
                        : componentStyle.button
                }
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
