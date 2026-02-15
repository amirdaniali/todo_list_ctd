import React, {useEffect, useReducer} from 'react';
import TodoList from '../features/Todos/TodoList/TodoList.jsx';
import TodoForm from '../features/Todos/TodoForm.jsx';
import TodoControls from '../features/TodoControls.jsx';
import useDebounce from '../utils/useDebounce.js';
import {todoReducer, initialTodoState, TODO_ACTIONS} from '../reducers/todoReducer.js';
import {useAuth} from "../contexts/AuthContext.jsx";
import {componentStyle} from "../shared/Styles.jsx";
import {useSearchParams} from "react-router";

const baseUrl = import.meta.env.VITE_BASE_URL;

function TodosPage() {
    console.log('todo page loaded');

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
    const [searchParams] = useSearchParams();
    const statusFilter = searchParams.get('status') || 'all';

    const {token, isDemoAccount} = useAuth();
    const debouncedFilterTerm = useDebounce(filterTerm, 300);

    const invalidateCache = () => dispatch({type: TODO_ACTIONS.INCREMENT_DATA_VERSION});


    useEffect(() => {
        if (isDemoAccount) {
            // Seed once if empty
            if (todoList.length === 0) {
                const now = Date.now();

                const demoTodos = [
                    {
                        id: 1,
                        title: 'Welcome to the demo!',
                        isCompleted: false,
                        creationDate: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
                    },
                    {
                        id: 2,
                        title: 'Try editing or completing me',
                        isCompleted: false,
                        creationDate: new Date(now - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
                    },
                    {
                        id: 3,
                        title: 'No data is sent to the server',
                        isCompleted: true,
                        creationDate: new Date(now - 1000 * 60 * 10).toISOString(), // 10 minutes ago
                    },
                ];

                // initial order should respect default: creationDate desc
                const initiallySorted = [...demoTodos].sort((a, b) => {
                    const aTime = new Date(a.creationDate).getTime();
                    const bTime = new Date(b.creationDate).getTime();
                    return sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
                });

                dispatch({
                    type: TODO_ACTIONS.FETCH_SUCCESS,
                    payload: {todos: initiallySorted},
                });

                return;
            }

            // Re-sort existing demo todos whenever sort changes
            const resorted = [...todoList].sort((a, b) => {
                if (sortBy === 'creationDate') {
                    const aTime = new Date(a.creationDate).getTime();
                    const bTime = new Date(b.creationDate).getTime();
                    return sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
                }

                if (sortBy === 'title') {
                    const aTitle = (a.title || '').toLowerCase();
                    const bTitle = (b.title || '').toLowerCase();
                    return sortDirection === 'asc'
                        ? aTitle.localeCompare(bTitle)
                        : bTitle.localeCompare(aTitle);
                }

                return 0;
            });

            dispatch({
                type: TODO_ACTIONS.FETCH_SUCCESS,
                payload: {todos: resorted},
            });

            return;
        }

        
        if (!token || state.fetchBlocked || isTodoListLoading) return;

        (async () => {
            dispatch({type: TODO_ACTIONS.FETCH_START});
            try {
                const paramsObject = {sortBy, sortDirection};
                if (debouncedFilterTerm) paramsObject.find = debouncedFilterTerm;
                const params = new URLSearchParams(paramsObject);

                const response = await fetch(`${baseUrl}/tasks?${params}`, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json', 'X-CSRF-TOKEN': token},
                    credentials: 'include',
                });

                const data = await response.json().catch(() => null);

                if (response.status === 200) {
                    dispatch({type: TODO_ACTIONS.FETCH_SUCCESS, payload: {todos: data}});
                } else {
                    dispatch({
                        type: TODO_ACTIONS.FETCH_ERROR,
                        payload: {error: `Error: ${data?.message}`, isFilterOrSort: false, status: response.status},
                    });
                }
            } catch (err) {
                const isFilterOrSort = Boolean(debouncedFilterTerm || sortBy !== 'creationDate' || sortDirection !== 'desc');
                dispatch({
                    type: TODO_ACTIONS.FETCH_ERROR,
                    payload: {
                        error: `Error fetching todos: ${err.message}`,
                        isFilterOrSort,
                        status: null,
                        blockFetch: true
                    },
                });
            }
        })();
    }, [token, sortBy, sortDirection, debouncedFilterTerm, fetchBlocked, dataVersion]);


    const addTodo = async (todoTitle) => {
        const newTodo = {id: Date.now(), title: todoTitle, isCompleted: false};
        dispatch({type: TODO_ACTIONS.ADD_TODO_OPTIMISTIC, payload: {todo: newTodo}});

        if (isDemoAccount) return; // no server
        // otherwise, normal POST
        try {
            const response = await fetch(`${baseUrl}/tasks`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'X-CSRF-TOKEN': token},
                credentials: 'include',
                body: JSON.stringify(newTodo),
            });
            if (response.ok) {
                const data = await response.json();
                dispatch({type: TODO_ACTIONS.ADD_TODO_SUCCESS, payload: {tempId: newTodo.id, serverTodo: data}});
                invalidateCache();
            } else {
                dispatch({
                    type: TODO_ACTIONS.ADD_TODO_ROLLBACK,
                    payload: {previousTodos: state.todoList, error: `Error: ${response.status}`}
                });
            }
        } catch (err) {
            dispatch({
                type: TODO_ACTIONS.ADD_TODO_ROLLBACK,
                payload: {previousTodos: state.todoList, error: err.message}
            });
        }
    };

    const completeTodo = async (id) => {
        dispatch({type: TODO_ACTIONS.COMPLETE_TODO_OPTIMISTIC, payload: {id}});
        if (isDemoAccount) return; // no server
        try {
            await fetch(`${baseUrl}/tasks/${id}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json', 'X-CSRF-TOKEN': token},
                credentials: 'include',
                body: JSON.stringify({isCompleted: true}),
            });
            dispatch({type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS});
            invalidateCache();
        } catch (err) {
            dispatch({
                type: TODO_ACTIONS.COMPLETE_TODO_ROLLBACK,
                payload: {previousTodos: state.todoList, error: err.message}
            });
        }
    };

    const reactivateTodo = async (id) => {
        dispatch({type: TODO_ACTIONS.REOPEN_TODO_OPTIMISTIC, payload: {id}});
        if (isDemoAccount) return;
        try {
            await fetch(`${baseUrl}/tasks/${id}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json', 'X-CSRF-TOKEN': token},
                credentials: 'include',
                body: JSON.stringify({isCompleted: false}),
            });
            dispatch({type: TODO_ACTIONS.REOPEN_TODO_SUCCESS});
            invalidateCache();
        } catch (err) {
            dispatch({
                type: TODO_ACTIONS.REOPEN_TODO_ROLLBACK,
                payload: {previousTodos: state.todoList, error: err.message}
            });
        }
    };

    const updateTodo = async (editedTodo) => {
        dispatch({type: TODO_ACTIONS.UPDATE_TODO_OPTIMISTIC, payload: {id: editedTodo.id, updated: editedTodo}});
        if (isDemoAccount) return;
        try {
            await fetch(`${baseUrl}/tasks/${editedTodo.id}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json', 'X-CSRF-TOKEN': token},
                credentials: 'include',
                body: JSON.stringify({title: editedTodo.title}),
            });
            dispatch({type: TODO_ACTIONS.UPDATE_TODO_SUCCESS});
            invalidateCache();
        } catch (err) {
            dispatch({
                type: TODO_ACTIONS.UPDATE_TODO_ROLLBACK,
                payload: {previousTodos: state.todoList, error: err.message}
            });
        }
    };

    const handleFilterChange = (term) => dispatch({type: TODO_ACTIONS.SET_FILTER_TERM, payload: term});

    return (
        <div style={componentStyle.page}>
            <div style={componentStyle.layout}>
                <TodoControls
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    onSortByChange={(v) => dispatch({type: TODO_ACTIONS.SET_SORT, payload: v})}
                    onSortDirectionChange={(v) => dispatch({type: TODO_ACTIONS.SET_SORT_DIRECTION, payload: v})}
                    filterTerm={filterTerm}
                    onFilterChange={handleFilterChange}
                    onResetFilters={() => dispatch({type: TODO_ACTIONS.RESET_FILTERS})}
                    error={error}
                    filterError={filterError}
                    onClearError={() => dispatch({type: TODO_ACTIONS.CLEAR_ERROR})}
                    onClearFilterError={() => dispatch({type: TODO_ACTIONS.CLEAR_FILTER_ERROR})}
                />
                <div style={componentStyle.mainContent}>
                    <TodoForm onAddTodo={addTodo}/>
                    <TodoList
                        onCompleteTodo={completeTodo}
                        onReactivateTodo={reactivateTodo}
                        onUpdateTodo={updateTodo}
                        todoList={todoList}
                        dataVersion={dataVersion}
                        statusFilter={statusFilter}
                    />
                </div>
            </div>
        </div>
    );
}

export default TodosPage;
