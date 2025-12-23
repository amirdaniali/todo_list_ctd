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
    empty: {
        padding: "10px",
        margin: "20px auto",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        border: "1px solid #ccc",
        maxWidth: "600px",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
    },
};

function TodoList({ todoList, onCompleteTodo }) {

    let filteredTodoList = todoList.filter((todo) => {
        return !todo.isCompleted
    });

    return (<>

        {filteredTodoList.length == 0 ? < p style={{
            ...componentStyle.empty
        }} > No Todos...</p > : <ul style={componentStyle.list}>
            {filteredTodoList.map((todo, index) => (
                <TodoListItem onCompleteTodo={onCompleteTodo} key={todo.id} todo={todo} style={{
                    ...componentStyle.listItem,
                    ...(index === filteredTodoList.length - 1 ? componentStyle.lastItem : {}),
                }} />
            ))}
        </ul>
        }
    </>
    );
}

export default TodoList;
