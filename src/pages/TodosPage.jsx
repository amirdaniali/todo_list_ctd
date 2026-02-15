import React from 'react';
import {useSearchParams} from 'react-router';
import {useTodosController} from '../hooks/useTodosController.js';
import {TodosLayout} from '../components/TodosLayout.jsx';

function TodosPage() {
    console.log('[TodosPage] render called');
    const [searchParams] = useSearchParams();
    const statusFilter = searchParams.get('status') || 'all';
    console.log('[TodosPage] statusFilter:', statusFilter);

    const controller = useTodosController(statusFilter);

    const {
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
    } = controller;

    console.log('[TodosPage] controller received, todosCount:', state.todoList.length);

    return (
        <TodosLayout
            state={{...state, dispatch}}
            displayedTodos={displayedTodos}
            effectiveOffline={effectiveOffline}
            offlineMode={offlineMode}
            isDemoAccount={isDemoAccount}
            addTodo={addTodo}
            completeTodo={completeTodo}
            reactivateTodo={reactivateTodo}
            updateTodo={updateTodo}
            handleFilterChange={handleFilterChange}
            toggleOffline={toggleOffline}
        />
    );
}

export default TodosPage;
