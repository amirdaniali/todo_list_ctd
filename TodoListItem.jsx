export default function TodoListItem({ todo, style }) {
    return (
        <>
            <li
                key={todo.id}
                style={style}
            >
                {todo.title}
            </li>
        </>
    )
}
