export default function TodoListItem({ todo, style }) {
    return (
        <>
            <li
                style={style}
            >
                {todo.title}
            </li>
        </>
    )
}
