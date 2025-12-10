import TodoListItem from "../TodoListItem";

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

function TodoList({ todoList }) {

    return (
        <ul style={componentStyle.list}>
            {todoList.map((todo, index) => (
                <TodoListItem todo={todo} style={{
                    ...componentStyle.listItem,
                    ...(index === todoList.length - 1 ? componentStyle.lastItem : {}),
                }} />
            ))}
        </ul>
    );
}

export default TodoList;
