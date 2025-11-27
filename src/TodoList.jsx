
const componentStyle = {
    list: {
        listStyleType: "none",
        padding: 0,
        margin: "20px auto",
        maxWidth: "600px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
        border: "1px solid #ccc",
        borderRadius: "8px",
    },
    listItem: {
        padding: "10px",
        borderBottom: "1px solid #eee",
    },
    lastItem: {
        borderBottom: "none",
    },
};

function TodoList() {
    const todoList = [
        { id: 1, title: "review resources" },
        { id: 2, title: "take notes" },
        { id: 3, title: "code out app" },
    ];

    return (
        <ul style={componentStyle.list}>
            {todoList.map((todo, index) => (
                <li
                    key={todo.id}
                    style={{
                        ...componentStyle.listItem,
                        ...(index === todoList.length - 1 ? componentStyle.lastItem : {}),
                    }}
                >
                    {todo.title}
                </li>
            ))}
        </ul>
    );
}

export default TodoList;
