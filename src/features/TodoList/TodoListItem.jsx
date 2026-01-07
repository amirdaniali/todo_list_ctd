import {useState} from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel.jsx";

export default function TodoListItem({ todo, style, onCompleteTodo }) {
    let [isEditing, setIsEditing] = useState(false);
    return ( <li style={style}>
            <form>
                {isEditing ? (
                    <TextInputWithLabel value={todo.title}/>
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