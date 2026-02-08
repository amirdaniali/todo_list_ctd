import TodoListItem from "./TodoListItem";
import {useMemo} from "react";

const componentStyle = {
    list: {
        listStyleType: "none",
        padding: 0,
        margin: "20px auto",
        maxWidth: "600px",
        backgroundColor: "#f9f9f9",
        border: "1px solid #ddd",
        borderRadius: "8px",
    },
    listItem: {
        padding: "12px",
        borderBottom: "1px solid #eee",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    lastItem: {
        borderBottom: "none",
    },
    empty: {
        padding: "20px",
        margin: "20px auto",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        border: "1px solid #ddd",
        maxWidth: "600px",
        textAlign: "center",
        fontSize: "16px",
        color: "#666",
    },
};


function TodoList({todoList, onCompleteTodo, onUpdateTodo, dataVersion, statusFilter, onReactivateTodo}) {

    let filteredTodoList = useMemo(() => {

        if (statusFilter == "all") {
            return {
                version: dataVersion,
                todos: todoList,
            }
        } else if (statusFilter == "completed") {
            return {
                version: dataVersion,
                todos: todoList.filter((todo) => {
                    return todo.isCompleted
                })
            }
        } else if (statusFilter == "active") {
            return {
                version: dataVersion,
                todos: todoList.filter((todo) => {
                    return !todo.isCompleted
                })
            }
        }

    }, [dataVersion, todoList, statusFilter]);

    const getEmptyMessage = () => {
        switch (statusFilter) {
            case 'completed':
                return 'No completed todos yet. Complete some tasks to see them here.';
            case 'active':
                return 'No active todos. Add a todo above to get started.';
            case 'all':
            default:
                return 'Add todo above to get started.';
        }
    };

    return (<>

            {filteredTodoList.todos.length == 0 ? < p style={{
                ...componentStyle.empty
            }}>{getEmptyMessage()}</p> : <ul style={componentStyle.list}>
                {filteredTodoList.todos.map((todo, index) => (
                    <TodoListItem onCompleteTodo={onCompleteTodo} onReactivateTodo={onReactivateTodo}
                                  onUpdateTodo={onUpdateTodo} key={todo.id} todo={todo}
                                  style={{
                                      ...componentStyle.listItem,
                                      ...(index === filteredTodoList.todos.length - 1 ? componentStyle.lastItem : {}),
                                  }}/>
                ))}
            </ul>
            }
        </>
    );
}

export default TodoList;
