import {useState} from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel.jsx";
import {isValidTodoTitle} from "../../utils/todoValidation.js";

export default function TodoListItem({ todo, style, onCompleteTodo, onUpdateTodo }) {
    let [isEditing, setIsEditing] = useState(false);
    let [workingTitle, setWorkingTitle] = useState(todo.title);

    let handleCancel = () => {
        setWorkingTitle(todo.title);
        setIsEditing(false);
    }

    let handleEdit = (event) => {
        setWorkingTitle(event.target.value);
    }
    
    let handleUpdate = (event) => {
        if (!isEditing) {
            return
        }
        event.preventDefault();
        onUpdateTodo({...todo, title: workingTitle});
        setIsEditing(false);
    }

    return ( <li style={style}>
            <form>
                {isEditing ? (<>
                    <TextInputWithLabel value={workingTitle} onChange={handleEdit}/>
                    <button type={"button"} onClick={handleCancel}>Cancel</button>
                    <button disabled={!isValidTodoTitle(workingTitle)} type={"button"} onClick={handleUpdate}>Update</button>
                    </>
                ) : (
                    <>
                        <label>
                            <input
                                type="checkbox"
                                id={`checkbox${todo.id}`}
                                checked={todo.isCompleted}
                                onChange={() => onCompleteTodo(todo.id)}
                            />
                        </label>
                        <span onClick={() => setIsEditing(true)}>{todo.title}</span>
                    </>
                )}
            </form>
        </li>
    );
}