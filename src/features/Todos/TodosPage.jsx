import TodoList from './TodoList/TodoList.jsx'
import TodoForm from './TodoForm';
import { useEffect, useState } from 'react';

const baseUrl = import.meta.env.VITE_BASE_URL


function TodosPage({ token }) {

    let [todoList, setTodoList] = useState([]);
    let [error, setError] = useState("");
    let [isTodoListLoading, setIsTodoListLoading] = useState(false);

    async function fetchTodos(token) {
        if (isTodoListLoading) {
            return
        }
        setIsTodoListLoading(true);
        try {
            const response = await fetch(`${baseUrl}/tasks`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', "X-CSRF-TOKEN": token },
                credentials: 'include',
            });
            const data = await response.json();
            if (response.status === 200) {
                setTodoList(data);
                setError("");
            } else if (response.status === 200) {
                setError(`Unauthorized Error: ${data?.message}`);

            } else {
                setError(`Error: ${data?.message}`);
            }
        } catch (error) {
            setError(`Error: ${error.name} | ${error.message}`);

        } finally {
            setIsTodoListLoading(false)
        }

    }



    useEffect(() => {
        if (token) {
            fetchTodos(token)
        }
    }, [token])

    const postTodo = async (title) => {

        try {
            const response = await fetch(`${baseUrl}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', "X-CSRF-TOKEN": token },
                credentials: 'include',
                body: JSON.stringify({
                    title: title,
                    isCompleted: false,
                }),
            });
            const data = await response.json();
            if (response.status === 200) {

                setError("");
                return data
            } else if (response.status === 401) {
                setError(`Unauthorized Error: ${data?.message}`);

            } else {
                setError(`Error: ${data?.message}`);
            }
        } catch (error) {
            setError(`Error: ${error.name} | ${error.message}`);

        } finally {
        }
    }

    const finishTodo = async (id) => {

        try {
            const response = await fetch(`${baseUrl}/tasks/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', "X-CSRF-TOKEN": token },
                credentials: 'include',
                body: JSON.stringify({
                    // i didn't implement createdTime patching because it didn't seem relevant?
                    isCompleted: true,
                }),
            });
            const data = await response.json();
            if (response.status === 200) {

                setError("");
                return "succes"
            } else if (response.status === 401) {
                setError(`Unauthorized Error: ${data?.message}`);

            } else {
                setError(`Error: ${data?.message}`);
            }
        } catch (error) {
            setError(`Error: ${error.name} | ${error.message}`);

        } finally {
        }
    }

    const alterTodo = async (id, title, createdTime) => {

        try {
            const response = await fetch(`${baseUrl}/tasks/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', "X-CSRF-TOKEN": token },
                credentials: 'include',
                body: JSON.stringify({
                    title: title,
                    createdTime: createdTime,
                    // i didn't implement createdTime patching because it didn't seem relevant?
                    isCompleted: false, // why pass isCompleted when users can only edit what they see and they can only see non completed?
                }),
            });
            const data = await response.json();
            if (response.status === 200) {

                setError("");
                return "succes"
            } else if (response.status === 401) {
                setError(`Unauthorized Error: ${data?.message}`);

            } else {
                setError(`Error: ${data?.message}`);
            }
        } catch (error) {
            setError(`Error: ${error.name} | ${error.message}`);

        } finally {
        }
    }

    const addTodo = async (todoTitle) => {
        let lastTodos = todoList;
        setTodoList([{
            title: todoTitle,
            id: Date.now(),
            isCompleted: false,
        }, ...todoList])
        let newTodo = postTodo(todoTitle);
        if (newTodo) {
            setTodoList([newTodo, ...lastTodos]);
        }
        else {
            setTodoList(lastTodos);
            setError(`There was an error syncing the todo with the server.`);
        }
    };

    const completeTodo = async (id) => {
        let newList = [];
        let oldList = todoList;

        todoList.forEach((todo) => {
            newList.push(todo.id === id ? { ...todo, isCompleted: true } : todo);
        })
        setTodoList(
            newList
        );
        let result = finishTodo(id);
        if (result !== "succes") {
            setTodoList(oldList);
            setError(`There was an error syncing the todo with the server.`);
        }
    };

    const updateTodo = async (editedTodo) => {
        let updatedTodos = [];
        let oldTodos = todoList;
        todoList.forEach((todo) => {
            if (todo.id === editedTodo.id) {
                updatedTodos.push(editedTodo);
            }
            else {
                updatedTodos.push(todo);
            }
        })
        setTodoList(updatedTodos);

        let result = alterTodo(editedTodo.id, editedTodo.title, editedTodo.createdTime);
        if (result !== "success") {
            setTodoList(oldTodos);
            setError(`There was an error syncing the todo with the server.`);
        }
    }

    return (
        <div>

            <p>{error ? `Error: ${error}` : null}</p>
            <button style={{ display: !!error ? "initial" : "none" }} type="reset" onClick={() => setError("")}>Clear Error</button>
            <p>{isTodoListLoading ? `Loading.. Please wait.` : null}</p>
            <TodoForm onAddTodo={addTodo} />
            <TodoList onCompleteTodo={completeTodo} onUpdateTodo={updateTodo} todoList={todoList} />
        </div >
    );
}

export default TodosPage;
