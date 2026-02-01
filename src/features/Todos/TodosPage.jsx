// TodosPage.jsx
import React, {useEffect, useReducer} from 'react';
import TodoList from './TodoList/TodoList.jsx';
import TodoForm from './TodoForm';
import SortBy from '../../shared/sortBy.jsx';
import useDebounce from '../../utils/useDebounce.js';
import FilterInput from '../../shared/FilterInput.jsx';
import {todoReducer, initialTodoState, TODO_ACTIONS} from '../../reducers/todoReducer.js';
import {useAuth} from "../../contexts/AuthContext.jsx";

const baseUrl = import.meta.env.VITE_BASE_URL;

function TodosPage() {
    const [state, dispatch] = useReducer(todoReducer, initialTodoState);
    const {
        todoList,
        error,
        filterError,
        isTodoListLoading,
        fetchBlocked,
        sortBy,
        sortDirection,
        filterTerm,
        dataVersion
    } = state;

    let {token} = useAuth();

    const debouncedFilterTerm = useDebounce(filterTerm, 300);

    const invalidateCache = () => dispatch({type: TODO_ACTIONS.INCREMENT_DATA_VERSION});


    useEffect(() => {
        if (!token) return;

        if (state.fetchBlocked) {
            return;
        }

        if (isTodoListLoading) return;

        (async () => {
            dispatch({type: TODO_ACTIONS.FETCH_START});

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
                    headers: {'Content-Type': 'application/json', 'X-CSRF-TOKEN': token},
                    credentials: 'include',
                });

                if (response.status === 429) {
                    const data = await response.text().catch(() => null);
                    dispatch({
                        type: TODO_ACTIONS.FETCH_ERROR,
                        payload: {
                            error: `Server rate-limited requests (429). Try again later.`,
                            isFilterOrSort: false,
                            status: 429,
                            blockFetch: true,
                        },
                    });
                    return;
                }

                const data = await response.json();

                if (response.status === 200) {
                    dispatch({type: TODO_ACTIONS.FETCH_SUCCESS, payload: {todos: data}});
                } else if (response.status === 401) {
                    dispatch({
                        type: TODO_ACTIONS.FETCH_ERROR,
                        payload: {error: `Unauthorized Error: ${data?.message}`, isFilterOrSort: false, status: 401},
                    });
                } else {
                    dispatch({
                        type: TODO_ACTIONS.FETCH_ERROR,
                        payload: {error: `Error: ${data?.message}`, isFilterOrSort: false, status: response.status},
                    });
                }
            } catch (err) {
                // Network/CORS errors show up as thrown exceptions in fetch
                const isFilterOrSort = Boolean(debouncedFilterTerm || sortBy !== 'creationDate' || sortDirection !== 'desc');
                const message = isFilterOrSort
                    ? `Error filtering/sorting todos: ${err.message}`
                    : `Error fetching todos: ${err.message}`;

                // Block automatic refetches on network/CORS errors to avoid tight loops
                dispatch({
                    type: TODO_ACTIONS.FETCH_ERROR,
                    payload: {error: message, isFilterOrSort, status: null, blockFetch: true},
                });
            }
        })();
        // match original dependencies so fetch runs exactly when the original did
        // do NOT include isTodoListLoading here (it caused a loop)
    }, [token, sortBy, sortDirection, debouncedFilterTerm, fetchBlocked, dataVersion]);


    // inside TodosPage.jsx (replace the existing helpers)

    const postTodo = async (title) => {
        try {
            const response = await fetch(`${baseUrl}/tasks`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'X-CSRF-TOKEN': token},
                credentials: 'include',
                body: JSON.stringify({title, isCompleted: false}),
            });

            if (response.ok) {
                const data = await response.json().catch(() => null);
                dispatch({type: TODO_ACTIONS.CLEAR_ERROR});
                return data;
            }

            const data = await response.json().catch(() => null);
            if (response.status === 401) {
                dispatch({
                    type: TODO_ACTIONS.FETCH_ERROR,
                    payload: {error: `Unauthorized Error: ${data?.message}`, isFilterOrSort: false, status: 401},
                });
            } else {
                dispatch({
                    type: TODO_ACTIONS.FETCH_ERROR,
                    payload: {
                        error: `Error: ${data?.message ?? response.statusText}`,
                        isFilterOrSort: false,
                        status: response.status
                    },
                });
            }
        } catch (err) {
            dispatch({
                type: TODO_ACTIONS.FETCH_ERROR,
                payload: {
                    error: `Error: ${err.name} | ${err.message}`,
                    isFilterOrSort: false,
                    status: null,
                    blockFetch: true
                },
            });
        }
    };

    const finishTodo = async (id) => {
        try {
            const response = await fetch(`${baseUrl}/tasks/${id}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json', 'X-CSRF-TOKEN': token},
                credentials: 'include',
                body: JSON.stringify({isCompleted: true}),
            });

            if (response.ok) {
                const data = await response.json().catch(() => null);
                dispatch({type: TODO_ACTIONS.CLEAR_ERROR});
                return 'success';
            }

            const data = await response.json().catch(() => null);
            if (response.status === 401) {
                dispatch({
                    type: TODO_ACTIONS.FETCH_ERROR,
                    payload: {error: `Unauthorized Error: ${data?.message}`, isFilterOrSort: false, status: 401},
                });
            } else {
                dispatch({
                    type: TODO_ACTIONS.FETCH_ERROR,
                    payload: {
                        error: `Error: ${data?.message ?? response.statusText}`,
                        isFilterOrSort: false,
                        status: response.status
                    },
                });
            }
        } catch (err) {
            dispatch({
                type: TODO_ACTIONS.FETCH_ERROR,
                payload: {
                    error: `Error: ${err.name} | ${err.message}`,
                    isFilterOrSort: false,
                    status: null,
                    blockFetch: true
                },
            });
        }
    };

    const alterTodo = async (id, title, createdTime) => {
        try {
            const response = await fetch(`${baseUrl}/tasks/${id}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json', 'X-CSRF-TOKEN': token},
                credentials: 'include',
                body: JSON.stringify({title, createdTime, isCompleted: false}),
            });

            if (response.ok) {
                const data = await response.json().catch(() => null);
                dispatch({type: TODO_ACTIONS.CLEAR_ERROR});
                return 'success';
            }

            const data = await response.json().catch(() => null);
            if (response.status === 401) {
                dispatch({
                    type: TODO_ACTIONS.FETCH_ERROR,
                    payload: {error: `Unauthorized Error: ${data?.message}`, isFilterOrSort: false, status: 401},
                });
            } else {
                dispatch({
                    type: TODO_ACTIONS.FETCH_ERROR,
                    payload: {
                        error: `Error: ${data?.message ?? response.statusText}`,
                        isFilterOrSort: false,
                        status: response.status
                    },
                });
            }
        } catch (err) {
            dispatch({
                type: TODO_ACTIONS.FETCH_ERROR,
                payload: {
                    error: `Error: ${err.name} | ${err.message}`,
                    isFilterOrSort: false,
                    status: null,
                    blockFetch: true
                },
            });
        }
    };


    const addTodo = async (todoTitle) => {
        const previousTodos = todoList;
        const tempTodo = {title: todoTitle, id: Date.now(), isCompleted: false};

        dispatch({type: TODO_ACTIONS.ADD_TODO_OPTIMISTIC, payload: {todo: tempTodo}});

        const serverTodo = await postTodo(todoTitle);
        if (serverTodo) {
            dispatch({type: TODO_ACTIONS.ADD_TODO_SUCCESS, payload: {tempId: tempTodo.id, serverTodo}});
            invalidateCache();
        } else {
            dispatch({
                type: TODO_ACTIONS.ADD_TODO_ROLLBACK,
                payload: {previousTodos, error: 'There was an error syncing the todo with the server.'},
            });
        }
    };

    const completeTodo = async (id) => {
        const previousTodos = todoList;
        dispatch({type: TODO_ACTIONS.COMPLETE_TODO_OPTIMISTIC, payload: {id}});

        const result = await finishTodo(id);
        if (result !== 'success') {
            dispatch({
                type: TODO_ACTIONS.COMPLETE_TODO_ROLLBACK,
                payload: {previousTodos, error: 'There was an error syncing the todo with the server.'},
            });
            return;
        }
        dispatch({type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS});
        invalidateCache();
    };

    const updateTodo = async (editedTodo) => {
        const previousTodos = todoList;
        dispatch({type: TODO_ACTIONS.UPDATE_TODO_OPTIMISTIC, payload: {id: editedTodo.id, updated: editedTodo}});

        const result = await alterTodo(editedTodo.id, editedTodo.title, editedTodo.createdTime);
        if (result !== 'success') {
            dispatch({
                type: TODO_ACTIONS.UPDATE_TODO_ROLLBACK,
                payload: {previousTodos, error: 'There was an error syncing the todo with the server.'},
            });
            return;
        }
        dispatch({type: TODO_ACTIONS.UPDATE_TODO_SUCCESS});
        invalidateCache();
    };

    const handleFilterChange = (newTerm) => {
        dispatch({type: TODO_ACTIONS.SET_FILTER_TERM, payload: newTerm});
    };

    const filterErrorComponent = (
        <div>
            <p>{filterError}</p>
            <button style={{display: filterError ? 'initial' : 'none'}} type="reset"
                    onClick={() => dispatch({type: TODO_ACTIONS.CLEAR_FILTER_ERROR})}>
                Clear Filter Error
            </button>
            <button
                type="reset"
                onClick={() => {
                    dispatch({type: TODO_ACTIONS.RESET_FILTERS});
                }}
            >
                Reset Filters
            </button>
        </div>
    );

    return (
        <div>
            <p>{error ? `Error: ${error}` : null}</p>
            <button style={{display: error ? 'initial' : 'none'}} type="reset"
                    onClick={() => dispatch({type: TODO_ACTIONS.CLEAR_ERROR})}>
                Clear Error
            </button>
            <p>{isTodoListLoading ? `Loading.. Please wait.` : null}</p>

            <SortBy
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortByChange={(val) => dispatch({type: TODO_ACTIONS.SET_SORT, payload: val})}
                onSortDirectionChange={(val) => dispatch({type: TODO_ACTIONS.SET_SORT_DIRECTION, payload: val})}
            />

            <TodoForm onAddTodo={addTodo}/>

            <FilterInput filterTerm={filterTerm} onFilterChange={handleFilterChange}/>

            {filterErrorComponent}

            <TodoList onCompleteTodo={completeTodo} onUpdateTodo={updateTodo} todoList={todoList}
                      dataVersion={dataVersion}/>
        </div>
    );
}

export default TodosPage;
