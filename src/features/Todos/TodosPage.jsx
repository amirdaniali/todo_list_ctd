import TodoList from './TodoList/TodoList.jsx'
import TodoForm from './TodoForm';
import {useCallback, useEffect, useState} from 'react';
import SortBy from "../../shared/sortBy.jsx";
import useDebounce from "../../utils/useDebounce.js";
import FilterInput from "../../shared/FilterInput.jsx";

const baseUrl = import.meta.env.VITE_BASE_URL


function TodosPage({token}) {

    let [todoList, setTodoList] = useState([]);
    let [error, setError] = useState("");
    let [isTodoListLoading, setIsTodoListLoading] = useState(false);
    let [sortBy, setSortBy] = useState('creationDate');
    let [sortDirection, setSortDirection] = useState('desc');
    const [filterTerm, setFilterTerm] = useState('');
    const debouncedFilterTerm = useDebounce(filterTerm, 300);
    let [dataVersion, setDataVersion] = useState(0);
    let [filterError, setFilterError] = useState("");

    let invalidateCache = useCallback(() => {
        setDataVersion(prev => prev + 1);
    }, [])

    async function fetchTodos(token) {
        if (isTodoListLoading) {
            return
        }
        setIsTodoListLoading(true);
        try {
            const paramsObject = {
                sortBy,
                sortDirection,
            };
            if (debouncedFilterTerm) {
                paramsObject.find = debouncedFilterTerm;
            }
            const params = new URLSearchParams(paramsObject);
            const response = await fetch(`${baseUrl}/tasks?${params}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json', "X-CSRF-TOKEN": token},
                credentials: 'include',
            });
            const data = await response.json();
            if (response.status === 200) {
                setTodoList(data);
                setFilterError("");
                setError("");
            } else if (response.status === 401) {
                setError(`Unauthorized Error: ${data?.message}`);

            } else {
                setError(`Error: ${data?.message}`);
            }
        } catch (error) {
            if (debouncedFilterTerm || sortBy !== 'creationDate' || sortDirection !== 'desc') {
                setFilterError(`Error filtering/sorting todos: ${error.message}`);
            } else {
                setError(`Error fetching todos: ${error.message}`);
            }
        } finally {
            setIsTodoListLoading(false)
        }

    }


    useEffect(() => {
        if (token) {
            fetchTodos(token)
        }
    }, [token, sortBy, sortDirection, debouncedFilterTerm])

    const postTodo = async (title) => {

        try {
            const response = await fetch(`${baseUrl}/tasks`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json', "X-CSRF-TOKEN": token},
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

        }
    }

    const finishTodo = async (id) => {

        try {
            const response = await fetch(`${baseUrl}/tasks/${id}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json', "X-CSRF-TOKEN": token},
                credentials: 'include',
                body: JSON.stringify({
                    // i didn't implement createdTime patching because it didn't seem relevant?
                    isCompleted: true,
                }),
            });
            const data = await response.json();
            if (response.status === 200) {

                setError("");
                return "success"
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
                headers: {'Content-Type': 'application/json', "X-CSRF-TOKEN": token},
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
                return "success"
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
        let newTodo = await postTodo(todoTitle);
        if (newTodo) {
            setTodoList([newTodo, ...lastTodos]);
            invalidateCache();
        } else {
            setTodoList(lastTodos);
            setError(`There was an error syncing the todo with the server.`);
        }
    };

    const completeTodo = async (id) => {
        let newList = [];
        let oldList = todoList;

        todoList.forEach((todo) => {
            newList.push(todo.id === id ? {...todo, isCompleted: true} : todo);
        })
        setTodoList(
            newList
        );
        let result = await finishTodo(id);
        if (result !== "success") {
            setTodoList(oldList);
            setError(`There was an error syncing the todo with the server.`);
            return
        }
        invalidateCache();
    };

    const updateTodo = async (editedTodo) => {
        let updatedTodos = [];
        let oldTodos = todoList;
        todoList.forEach((todo) => {
            if (todo.id === editedTodo.id) {
                updatedTodos.push(editedTodo);
            } else {
                updatedTodos.push(todo);
            }
        })
        setTodoList(updatedTodos);

        let result = await alterTodo(editedTodo.id, editedTodo.title, editedTodo.createdTime);
        if (result !== "success") {
            setTodoList(oldTodos);
            setError(`There was an error syncing the todo with the server.`);
            return
        }
        invalidateCache();
    }

    const handleFilterChange = (newTerm) => {
        setFilterTerm(newTerm);
    };

    const filterErrorComponent = <div>
        <p>{filterError}</p>
        <button style={{display: filterError ? "initial" : "none"}} type="reset"
                onClick={() => setFilterError("")}>Clear Filter
            Error
        </button>
        <button type={"reset"} onClick={() => {
            setFilterTerm("");
            setSortBy('creationDate');
            setSortDirection('desc');
            setFilterError('');
        }}>Reset Filters
        </button>

    </div>

    return (
        <div>

            <p>{error ? `Error: ${error}` : null}</p>
            <button style={{display: error ? "initial" : "none"}} type="reset" onClick={() => setError("")}>Clear
                Error
            </button>
            <p>{isTodoListLoading ? `Loading.. Please wait.` : null}</p>
            <SortBy sortBy={sortBy} sortDirection={sortDirection} onSortByChange={setSortBy}
                    onSortDirectionChange={setSortDirection}/>
            <TodoForm onAddTodo={addTodo}/>
            <FilterInput filterTerm={filterTerm} onFilterChange={handleFilterChange}/>
            {filterErrorComponent}
            <TodoList onCompleteTodo={completeTodo} onUpdateTodo={updateTodo} todoList={todoList}
                      dataVersion={dataVersion}/>
        </div>
    );
}

export default TodosPage;
