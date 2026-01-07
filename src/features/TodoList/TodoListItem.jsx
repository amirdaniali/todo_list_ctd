export default function TodoListItem({ todo, style, onCompleteTodo }) {

    return (
        <li style={style}>
            <input
                type="checkbox"
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
            />
            {todo.title}
        </li>
    );
}