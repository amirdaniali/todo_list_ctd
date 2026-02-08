export const TODO_ACTIONS = {
    FETCH_START: 'FETCH_START',
    FETCH_SUCCESS: 'FETCH_SUCCESS',
    FETCH_ERROR: 'FETCH_ERROR',

    ADD_TODO_OPTIMISTIC: 'ADD_TODO_OPTIMISTIC',
    ADD_TODO_ROLLBACK: 'ADD_TODO_ROLLBACK',
    ADD_TODO_SUCCESS: 'ADD_TODO_SUCCESS',

    UPDATE_TODO_OPTIMISTIC: 'UPDATE_TODO_OPTIMISTIC',
    UPDATE_TODO_ROLLBACK: 'UPDATE_TODO_ROLLBACK',
    UPDATE_TODO_SUCCESS: 'UPDATE_TODO_SUCCESS',

    COMPLETE_TODO_OPTIMISTIC: 'COMPLETE_TODO_OPTIMISTIC',
    COMPLETE_TODO_ROLLBACK: 'COMPLETE_TODO_ROLLBACK',
    COMPLETE_TODO_SUCCESS: 'COMPLETE_TODO_SUCCESS',

    REOPEN_TODO_OPTIMISTIC: 'REOPEN_TODO_OPTIMISTIC',
    REOPEN_TODO_ROLLBACK: 'REOPEN_TODO_ROLLBACK',
    REOPEN_TODO_SUCCESS: 'REOPEN_TODO_SUCCESS',


    SET_SORT: 'SET_SORT',
    SET_SORT_DIRECTION: 'SET_SORT_DIRECTION',
    SET_FILTER_TERM: 'SET_FILTER_TERM',
    CLEAR_FILTER_ERROR: 'CLEAR_FILTER_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR',
    RESET_FILTERS: 'RESET_FILTERS',

    INCREMENT_DATA_VERSION: 'INCREMENT_DATA_VERSION',
};

export const initialTodoState = {
    todoList: [],
    error: '',
    filterError: '',
    isTodoListLoading: false,
    sortBy: 'creationDate',
    sortDirection: 'desc',
    filterTerm: '',
    dataVersion: 0,

    // New: block automatic refetches after server-side rate-limit/CORS failures
    fetchBlocked: false,
    lastFetchStatus: null,
};

export function todoReducer(state, action) {
    switch (action.type) {
        case TODO_ACTIONS.FETCH_START:
            return {
                ...state,
                isTodoListLoading: true,
                error: '',
                filterError: '',
                // don't clear fetchBlocked here; only INCREMENT_DATA_VERSION or CLEAR_ERROR should
            };

        case TODO_ACTIONS.FETCH_SUCCESS:
            return {
                ...state,
                isTodoListLoading: false,
                todoList: action.payload.todos || [],
                error: '',
                filterError: '',
                fetchBlocked: false,
                lastFetchStatus: 200,
            };

        case TODO_ACTIONS.FETCH_ERROR:
            return {
                ...state,
                isTodoListLoading: false,
                // payload: { error, isFilterOrSort, status, blockFetch }
                error: action.payload.isFilterOrSort ? state.error : action.payload.error,
                filterError: action.payload.isFilterOrSort ? action.payload.error : state.filterError,
                fetchBlocked: action.payload.blockFetch === true ? true : state.fetchBlocked,
                lastFetchStatus: action.payload.status ?? state.lastFetchStatus,
            };

        case TODO_ACTIONS.ADD_TODO_OPTIMISTIC:
            return {
                ...state,
                todoList: [action.payload.todo, ...state.todoList],
                error: '',
            };

        case TODO_ACTIONS.ADD_TODO_ROLLBACK:
            return {
                ...state,
                todoList: action.payload.previousTodos,
                error: action.payload.error || 'There was an error syncing the todo with the server.',
            };

        case TODO_ACTIONS.ADD_TODO_SUCCESS:
            return {
                ...state,
                todoList: state.todoList.map((t) =>
                    t.id === action.payload.tempId ? action.payload.serverTodo : t
                ),
                error: '',
            };

        case TODO_ACTIONS.UPDATE_TODO_OPTIMISTIC:
            return {
                ...state,
                todoList: state.todoList.map((t) => (t.id === action.payload.id ? action.payload.updated : t)),
                error: '',
            };

        case TODO_ACTIONS.UPDATE_TODO_ROLLBACK:
            return {
                ...state,
                todoList: action.payload.previousTodos,
                error: action.payload.error || 'There was an error syncing the todo with the server.',
            };

        case TODO_ACTIONS.UPDATE_TODO_SUCCESS:
            return {
                ...state,
                error: '',
            };

        case TODO_ACTIONS.COMPLETE_TODO_OPTIMISTIC:
            return {
                ...state,
                todoList: state.todoList.map((t) => (t.id === action.payload.id ? {...t, isCompleted: true} : t)),
                error: '',
            };

        case TODO_ACTIONS.COMPLETE_TODO_ROLLBACK:
            return {
                ...state,
                todoList: action.payload.previousTodos,
                error: action.payload.error || 'There was an error syncing the todo with the server.',
            };

        case TODO_ACTIONS.COMPLETE_TODO_SUCCESS:
            return {
                ...state,
                error: '',
            };


        case TODO_ACTIONS.REOPEN_TODO_OPTIMISTIC:
            return {
                ...state,
                todoList: state.todoList.map((t) =>
                    t.id === action.payload.id ? {...t, isCompleted: false} : t
                ),
                error: '',
            };

        case TODO_ACTIONS.REOPEN_TODO_ROLLBACK:
            return {
                ...state,
                todoList: action.payload.previousTodos,
                error:
                    action.payload.error ||
                    'There was an error syncing the todo with the server.',
            };

        case TODO_ACTIONS.REOPEN_TODO_SUCCESS:
            return {
                ...state,
                error: '',
            };


        case TODO_ACTIONS.SET_SORT:
            return {
                ...state,
                sortBy: action.payload,
            };

        case TODO_ACTIONS.SET_SORT_DIRECTION:
            return {
                ...state,
                sortDirection: action.payload,
            };

        case TODO_ACTIONS.SET_FILTER_TERM:
            return {
                ...state,
                filterTerm: action.payload,
            };

        case TODO_ACTIONS.CLEAR_FILTER_ERROR:
            return {
                ...state,
                filterError: '',
            };

        case TODO_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: '',
                // also clear fetchBlocked so user can retry after clearing error
                fetchBlocked: false,
                lastFetchStatus: null,
            };

        case TODO_ACTIONS.RESET_FILTERS:
            return {
                ...state,
                filterTerm: '',
                sortBy: 'creationDate',
                sortDirection: 'desc',
                filterError: '',
            };

        case TODO_ACTIONS.INCREMENT_DATA_VERSION:
            return {
                ...state,
                dataVersion: state.dataVersion + 1,
                // allow refetch after explicit invalidation
                fetchBlocked: false,
                lastFetchStatus: null,
            };

        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }
}
