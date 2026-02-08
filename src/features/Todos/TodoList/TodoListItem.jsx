import {useState} from "react";
import TextInputWithLabel from "../../../shared/TextInputWithLabel";
import {isValidTodoTitle} from "../../../utils/todoValidation";

const componentStyle = {
    checkbox: {
        marginRight: "12px",
        transform: "scale(1.2)",
    },
    title: {
        cursor: "pointer",
        fontSize: "16px",
    },
    button: {
        padding: "6px 10px",
        borderRadius: "6px",
        border: "none",
        marginLeft: "8px",
        cursor: "pointer",
        backgroundColor: "#007bff",
        color: "#fff",
    },
    buttonSecondary: {
        backgroundColor: "#6c757d",
    }
};

export default function TodoListItem({
                                         todo,
                                         style,
                                         onCompleteTodo,
                                         onUpdateTodo,
                                         onReactivateTodo,
                                     }) {
    let [isEditing, setIsEditing] = useState(false);
    let [workingTitle, setWorkingTitle] = useState(todo.title);

    const handleCancel = () => {
        setWorkingTitle(todo.title);
        setIsEditing(false);
    };

    const handleEdit = (event) => {
        setWorkingTitle(event.target.value);
    };

    const handleUpdate = (event) => {
        if (!isEditing) return;
        event.preventDefault();
        onUpdateTodo({...todo, title: workingTitle.trim()});
        setIsEditing(false);
    };

    const handleCheckboxChange = () => {
        if (todo.isCompleted) {
            // was completed, now uncheck → free/reactivate
            onReactivateTodo(todo.id);
        } else {
            // was active, now check → complete
            onCompleteTodo(todo.id);
        }
    };

    let editingInput = (
        <>
            <TextInputWithLabel value={workingTitle} onChange={handleEdit}/>
            <button
                type="button"
                style={{...componentStyle.button, ...componentStyle.buttonSecondary}}
                onClick={handleCancel}
            >
                Cancel
            </button>
            <button
                type="button"
                disabled={!isValidTodoTitle(workingTitle)}
                style={componentStyle.button}
                onClick={handleUpdate}
            >
                Update
            </button>
        </>
    );

    let editableTextInput = (
        <>
            <input
                type="checkbox"
                checked={todo.isCompleted}
                onChange={handleCheckboxChange}
                style={componentStyle.checkbox}
            />
            <span style={componentStyle.title} onClick={() => setIsEditing(true)}>
        {todo.title}
      </span>
        </>
    );

    return (
        <li style={style}>
            <form>{isEditing ? editingInput : editableTextInput}</form>
        </li>
    );
}
