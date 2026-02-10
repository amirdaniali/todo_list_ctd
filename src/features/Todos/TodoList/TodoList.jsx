import TodoListItem from "./TodoListItem";
import {useMemo} from "react";
import {componentStyle} from "../../../shared/Styles.jsx";

function TodoList({
                      todoList,
                      onCompleteTodo,
                      onUpdateTodo,
                      statusFilter,
                      onReactivateTodo,
                  }) {
    const filtered = useMemo(() => {
        if (statusFilter === "completed") return todoList.filter(t => t.isCompleted);
        if (statusFilter === "active") return todoList.filter(t => !t.isCompleted);
        return todoList;
    }, [todoList, statusFilter]);

    const message =
        statusFilter === "completed"
            ? "No completed todos yet."
            : statusFilter === "active"
                ? "No active todos."
                : "No todos yet.";

    if (filtered.length === 0)
        return <p style={componentStyle.emptyList}>{message}</p>;

    return (
        <ul style={componentStyle.todoList}>
            {filtered.map(todo => (
                <TodoListItem
                    key={todo.id}
                    todo={todo}
                    onCompleteTodo={onCompleteTodo}
                    onReactivateTodo={onReactivateTodo}
                    onUpdateTodo={onUpdateTodo}
                    style={componentStyle.todoItem}
                />
            ))}
        </ul>
    );
}

export default TodoList;
