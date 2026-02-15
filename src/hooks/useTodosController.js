import {useEffect, useMemo, useReducer, useState} from 'react';
import {todoReducer, initialTodoState, TODO_ACTIONS} from '../reducers/todoReducer.js';
import useDebounce from '../utils/useDebounce.js';
import {useAuth} from '../contexts/AuthContext.jsx';

const baseUrl = import.meta.env.VITE_BASE_URL;
const LOCAL_STORAGE_KEY = 'todos-offline';

export function useTodosController(statusFilter) {
    console.log('[useTodosController] called with statusFilter:', statusFilter);

    const {token, isDemoAccount} = useAuth();
    console.log('[useTodosController] auth state:', {tokenPresent: !!token, isDemoAccount});

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
        dataVersion,
    } = state;

    console.log('[useTodosController] state snapshot:', {
        todosCount: todoList.length,
        error,
        filterError,
        isTodoListLoading,
        fetchBlocked,
        sortBy,
        sortDirection,
        filterTerm,
        dataVersion,
    });

    const [offlineMode, setOfflineMode] = useState(false);
    const effectiveOffline = isDemoAccount || offlineMode;
    console.log('[useTodosController] offline flags:', {offlineMode, effectiveOffline});

    const debouncedFilterTerm = useDebounce(filterTerm, 300);
    const invalidateCache = () => {
        console.log('[useTodosController] invalidateCache called');
        dispatch({type: TODO_ACTIONS.INCREMENT_DATA_VERSION});
    };

    const displayedTodos = useMemo(() => {
        console.log('[useTodosController] computing displayedTodos');
        let list = todoList;

        if (effectiveOffline && filterTerm) {
            console.log('[useTodosController] applying offline filter:', filterTerm);
            list = list.filter((todo) =>
                todo.title.toLowerCase().includes(filterTerm.toLowerCase())
            );
        }

        if (sortBy === 'creationDate') {
            console.log('[useTodosController] sorting by creationDate', sortDirection);
            list = [...list].sort((a, b) => {
                const aTime = new Date(a.creationDate).getTime();
                const bTime = new Date(b.creationDate).getTime();
                return sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
            });
        } else if (sortBy === 'title') {
            console.log('[useTodosController] sorting by title', sortDirection);
            list = [...list].sort((a, b) => {
                const aTitle = (a.title || '').toLowerCase();
                const bTitle = (b.title || '').toLowerCase();
                return sortDirection === 'asc'
                    ? aTitle.localeCompare(bTitle)
                    : bTitle.localeCompare(aTitle);
            });
        }

        if (statusFilter && statusFilter !== 'all') {
            console.log('[useTodosController] applying statusFilter:', statusFilter);
            if (statusFilter === 'completed') {
                list = list.filter((t) => t.isCompleted);
            } else if (statusFilter === 'active') {
                list = list.filter((t) => !t.isCompleted);
            }
        }

        console.log('[useTodosController] displayedTodos length:', list.length);
        return list;
    }, [todoList, filterTerm, sortBy, sortDirection, effectiveOffline, statusFilter]);

    // Offline: load once when we enter offline mode (demo or manual toggle)
    useEffect(() => {
        console.log(
            '[useTodosController] offline load effect fired, effectiveOffline:',
            effectiveOffline
        );
        if (!effectiveOffline) return;

        let loadedFromStorage = false;

        try {
            const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
            console.log('[useTodosController] localStorage raw:', stored);
            if (stored) {
                const parsed = JSON.parse(stored);
                const storedLength = Array.isArray(parsed) ? parsed.length : 0;
                console.log(
                    '[useTodosController] parsed localStorage todos length:',
                    storedLength
                );
                if (storedLength > 0) {
                    dispatch({
                        type: TODO_ACTIONS.FETCH_SUCCESS,
                        payload: {todos: parsed},
                    });
                    loadedFromStorage = true;
                    console.log('[useTodosController] loaded todos from localStorage');
                }
            }
        } catch (e) {
            console.error('[useTodosController] Failed to load offline todos', e);
        }

        if (!loadedFromStorage && isDemoAccount) {
            console.log('[useTodosController] seeding demo offline todos');
            const now = Date.now();
            const seedTodos = [
                {
                    id: 1,
                    title: 'Welcome to offline mode!',
                    isCompleted: false,
                    creationDate: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
                },
                {
                    id: 2,
                    title: 'Tasks are stored in your browser',
                    isCompleted: false,
                    creationDate: new Date(now - 1000 * 60 * 60 * 6).toISOString(),
                },
                {
                    id: 3,
                    title: 'You can switch online later',
                    isCompleted: true,
                    creationDate: new Date(now - 1000 * 60 * 10).toISOString(),
                },
            ];
            dispatch({type: TODO_ACTIONS.FETCH_SUCCESS, payload: {todos: seedTodos}});
        }
    }, [effectiveOffline, isDemoAccount]);

// Offline: persist to localStorage when list changes
    useEffect(() => {
        console.log(
            '[useTodosController] offline persist effect fired, effectiveOffline:',
            effectiveOffline,
            'todosCount:',
            todoList.length
        );
        if (!effectiveOffline) return;

        try {
            const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
            const parsed = stored ? JSON.parse(stored) : null;
            const storedLength = Array.isArray(parsed) ? parsed.length : 0;

            // Avoid overwriting non-empty storage with an empty in-memory list on first mount
            if (todoList.length === 0 && storedLength > 0) {
                console.log(
                    '[useTodosController] skip persist: in-memory empty but storage has',
                    storedLength,
                    'items'
                );
                return;
            }

            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todoList));
            console.log('[useTodosController] saved todos to localStorage');
        } catch (e) {
            console.error('[useTodosController] Failed to persist offline todos', e);
        }
    }, [effectiveOffline, todoList]);


    // Online: initial and subsequent fetches
    useEffect(() => {
        console.log('[useTodosController] online fetch effect fired', {
            effectiveOffline,
            tokenPresent: !!token,
            fetchBlocked,
            sortBy,
            sortDirection,
            debouncedFilterTerm,
            dataVersion,
        });

        if (effectiveOffline) return;
        if (!token) return;
        if (fetchBlocked) return;

        let cancelled = false;

        (async () => {
            console.log('[useTodosController] starting online fetch');
            dispatch({type: TODO_ACTIONS.FETCH_START});
            try {
                const paramsObject = {sortBy, sortDirection};
                if (debouncedFilterTerm) {
                    paramsObject.find = debouncedFilterTerm;
                }
                const params = new URLSearchParams(paramsObject);
                const url = `${baseUrl}/tasks?${params.toString()}`;
                console.log('[useTodosController] fetching URL:', url);

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json', 'X-CSRF-TOKEN': token},
                    credentials: 'include',
                });

                console.log('[useTodosController] fetch response status:', response.status);

                if (cancelled) {
                    console.log('[useTodosController] fetch cancelled, skipping handling');
                    return;
                }

                if (response.status === 429) {
                    await response.text().catch(() => null);
                    dispatch({
                        type: TODO_ACTIONS.FETCH_ERROR,
                        payload: {
                            error: 'Server rate-limited requests (429). Try again later.',
                            isFilterOrSort: false,
                            status: 429,
                            blockFetch: true,
                        },
                    });
                    console.log('[useTodosController] fetch 429 handled');
                    return;
                }

                const data = await response.json().catch(() => null);
                console.log(
                    '[useTodosController] fetch data type:',
                    Array.isArray(data) ? 'array' : typeof data,
                    'length:',
                    Array.isArray(data) ? data.length : 'n/a'
                );

                if (response.status === 200) {
                    dispatch({
                        type: TODO_ACTIONS.FETCH_SUCCESS,
                        payload: {todos: Array.isArray(data) ? data : []},
                    });
                    console.log(
                        '[useTodosController] fetch success, todos length:',
                        Array.isArray(data) ? data.length : 0
                    );
                } else if (response.status === 401) {
                    dispatch({
                        type: TODO_ACTIONS.FETCH_ERROR,
                        payload: {
                            error: `Unauthorized Error: ${data?.message}`,
                            isFilterOrSort: false,
                            status: 401,
                        },
                    });
                    console.log('[useTodosController] fetch unauthorized 401');
                } else {
                    dispatch({
                        type: TODO_ACTIONS.FETCH_ERROR,
                        payload: {
                            error: `Error: ${data?.message}`,
                            isFilterOrSort: false,
                            status: response.status,
                        },
                    });
                    console.log('[useTodosController] fetch non-200 error status:', response.status);
                }
            } catch (err) {
                if (cancelled) {
                    console.log('[useTodosController] fetch error after cancel, ignoring');
                    return;
                }
                const isFilterOrSort = Boolean(
                    debouncedFilterTerm ||
                    sortBy !== 'creationDate' ||
                    sortDirection !== 'desc'
                );
                const message = isFilterOrSort
                    ? `Error filtering/sorting todos: ${err.message}`
                    : `Error fetching todos: ${err.message}`;
                dispatch({
                    type: TODO_ACTIONS.FETCH_ERROR,
                    payload: {error: message, isFilterOrSort, status: null, blockFetch: true},
                });
                console.error('[useTodosController] fetch threw error:', err);
            }
        })();

        return () => {
            console.log('[useTodosController] cleanup, cancelling fetch');
            cancelled = true;
        };
    }, [
        effectiveOffline,
        token,
        sortBy,
        sortDirection,
        debouncedFilterTerm,
        fetchBlocked,
        dataVersion,
    ]);


    const addTodo = async (todoTitle) => {

        console.log('[useTodosController] addTodo called with title:', todoTitle);
        const tempTodo = {
            title: todoTitle,
            id: Date.now(),
            isCompleted: false,
            creationDate: new Date().toISOString(),
        };
        const prevTodos = todoList;
        const nextTodos = [tempTodo, ...prevTodos];

        dispatch({type: TODO_ACTIONS.ADD_TODO_OPTIMISTIC, payload: {todo: tempTodo}});

        if (effectiveOffline) {
            console.log('[useTodosController] addTodo offline, skipping server and updating localStorage directly');
            try {
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextTodos));
                console.log(
                    '[useTodosController] addTodo offline persisted, new length:',
                    nextTodos.length
                );
            } catch (e) {
                console.error('[useTodosController] addTodo offline persist error:', e);
            }
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/tasks`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'X-CSRF-TOKEN': token},
                credentials: 'include',
                body: JSON.stringify({title: todoTitle, isCompleted: false}),
            });
            console.log('[useTodosController] addTodo response status:', response.status);
            if (response.ok) {
                const data = await response.json().catch(() => null);
                dispatch({
                    type: TODO_ACTIONS.ADD_TODO_SUCCESS,
                    payload: {tempId: tempTodo.id, serverTodo: data},
                });
                console.log('[useTodosController] addTodo success, invalidating cache');
                invalidateCache();
            } else {
                dispatch({
                    type: TODO_ACTIONS.ADD_TODO_ROLLBACK,
                    payload: {previousTodos: todoList, error: 'Sync failed'},
                });
                console.warn('[useTodosController] addTodo non-ok response, rollback');
            }
        } catch (err) {
            dispatch({
                type: TODO_ACTIONS.ADD_TODO_ROLLBACK,
                payload: {previousTodos: todoList, error: err.message},
            });
            console.error('[useTodosController] addTodo error:', err);
        }
    };

    const completeTodo = async (id) => {
        console.log('[useTodosController] completeTodo called with id:', id);
        dispatch({type: TODO_ACTIONS.COMPLETE_TODO_OPTIMISTIC, payload: {id}});
        if (effectiveOffline) {
            console.log('[useTodosController] completeTodo offline, skipping server');
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/tasks/${id}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json', 'X-CSRF-TOKEN': token},
                credentials: 'include',
                body: JSON.stringify({isCompleted: true}),
            });
            console.log('[useTodosController] completeTodo response status:', response.status);
            if (response.ok) {
                dispatch({type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS});
                console.log('[useTodosController] completeTodo success, invalidating cache');
                invalidateCache();
            } else {
                dispatch({
                    type: TODO_ACTIONS.COMPLETE_TODO_ROLLBACK,
                    payload: {previousTodos: todoList, error: 'Sync failed'},
                });
                console.warn('[useTodosController] completeTodo non-ok response, rollback');
            }
        } catch (err) {
            dispatch({
                type: TODO_ACTIONS.COMPLETE_TODO_ROLLBACK,
                payload: {previousTodos: todoList, error: err.message},
            });
            console.error('[useTodosController] completeTodo error:', err);
        }
    };

    const reactivateTodo = async (id) => {
        console.log('[useTodosController] reactivateTodo called with id:', id);
        dispatch({type: TODO_ACTIONS.REOPEN_TODO_OPTIMISTIC, payload: {id}});
        if (effectiveOffline) {
            console.log('[useTodosController] reactivateTodo offline, skipping server');
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/tasks/${id}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json', 'X-CSRF-TOKEN': token},
                credentials: 'include',
                body: JSON.stringify({isCompleted: false}),
            });
            console.log('[useTodosController] reactivateTodo response status:', response.status);
            if (response.ok) {
                dispatch({type: TODO_ACTIONS.REOPEN_TODO_SUCCESS});
                console.log('[useTodosController] reactivateTodo success, invalidating cache');
                invalidateCache();
            } else {
                dispatch({
                    type: TODO_ACTIONS.REOPEN_TODO_ROLLBACK,
                    payload: {previousTodos: todoList, error: 'Sync failed'},
                });
                console.warn('[useTodosController] reactivateTodo non-ok response, rollback');
            }
        } catch (err) {
            dispatch({
                type: TODO_ACTIONS.REOPEN_TODO_ROLLBACK,
                payload: {previousTodos: todoList, error: err.message},
            });
            console.error('[useTodosController] reactivateTodo error:', err);
        }
    };

    const updateTodo = async (editedTodo) => {
        console.log('[useTodosController] updateTodo called with id:', editedTodo.id);
        dispatch({
            type: TODO_ACTIONS.UPDATE_TODO_OPTIMISTIC,
            payload: {id: editedTodo.id, updated: editedTodo},
        });
        if (effectiveOffline) {
            console.log('[useTodosController] updateTodo offline, skipping server');
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/tasks/${editedTodo.id}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json', 'X-CSRF-TOKEN': token},
                credentials: 'include',
                body: JSON.stringify({title: editedTodo.title}),
            });
            console.log('[useTodosController] updateTodo response status:', response.status);
            if (response.ok) {
                dispatch({type: TODO_ACTIONS.UPDATE_TODO_SUCCESS});
                console.log('[useTodosController] updateTodo success, invalidating cache');
                invalidateCache();
            } else {
                dispatch({
                    type: TODO_ACTIONS.UPDATE_TODO_ROLLBACK,
                    payload: {previousTodos: todoList, error: 'Sync failed'},
                });
                console.warn('[useTodosController] updateTodo non-ok response, rollback');
            }
        } catch (err) {
            dispatch({
                type: TODO_ACTIONS.UPDATE_TODO_ROLLBACK,
                payload: {previousTodos: todoList, error: err.message},
            });
            console.error('[useTodosController] updateTodo error:', err);
        }
    };

    const handleFilterChange = (newTerm) => {
        console.log('[useTodosController] handleFilterChange called with:', newTerm);
        dispatch({type: TODO_ACTIONS.SET_FILTER_TERM, payload: newTerm});
    };

    const toggleOffline = () => {
        console.log('[useTodosController] toggleOffline called, current offlineMode:', offlineMode);
        setOfflineMode((m) => !m);
    };

    console.log('[useTodosController] returning controller object');

    return {
        state,
        displayedTodos,
        effectiveOffline,
        offlineMode,
        isDemoAccount,
        addTodo,
        completeTodo,
        reactivateTodo,
        updateTodo,
        handleFilterChange,
        toggleOffline,
        dispatch,
    };
}
