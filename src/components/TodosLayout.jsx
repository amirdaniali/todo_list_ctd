import React from 'react';
import TodoList from '../features/Todos/TodoList/TodoList.jsx';
import TodoForm from '../features/Todos/TodoForm.jsx';
import TodoControls from '../features/TodoControls.jsx';
import {componentStyle} from '../shared/Styles.jsx';
import {TODO_ACTIONS} from '../reducers/todoReducer.js';

export function TodosLayout({
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
                            }) {
    console.log('[TodosLayout] render called');

    const {
        error,
        filterError,
        sortBy,
        sortDirection,
        filterTerm,
        dataVersion,
    } = state;

    const dispatch = state.dispatch; // we will pass dispatch separately if needed

    return (
        <div style={componentStyle.page}>
            <div style={componentStyle.layout}>
                <TodoControls
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    onSortByChange={(v) => {
                        console.log('[TodosLayout] onSortByChange', v);
                        dispatch({type: TODO_ACTIONS.SET_SORT, payload: v});
                    }}
                    onSortDirectionChange={(v) => {
                        console.log('[TodosLayout] onSortDirectionChange', v);
                        dispatch({type: TODO_ACTIONS.SET_SORT_DIRECTION, payload: v});
                    }}
                    filterTerm={filterTerm}
                    onFilterChange={handleFilterChange}
                    onResetFilters={() => {
                        console.log('[TodosLayout] onResetFilters');
                        dispatch({type: TODO_ACTIONS.RESET_FILTERS});
                    }}
                    error={error}
                    filterError={filterError}
                    onClearError={() => {
                        console.log('[TodosLayout] onClearError');
                        dispatch({type: TODO_ACTIONS.CLEAR_ERROR});
                    }}
                    onClearFilterError={() => {
                        console.log('[TodosLayout] onClearFilterError');
                        dispatch({type: TODO_ACTIONS.CLEAR_FILTER_ERROR});
                    }}
                    offlineMode={offlineMode}
                    effectiveOffline={effectiveOffline}
                    isDemoAccount={isDemoAccount}
                    onToggleOffline={() => {
                        console.log('[TodosLayout] onToggleOffline');
                        toggleOffline();
                    }}
                />
                <div style={componentStyle.mainContent}>
                    <TodoForm
                        onAddTodo={(title) => {
                            console.log('[TodosLayout] TodoForm onAddTodo', title);
                            addTodo(title);
                        }}
                    />
                    <TodoList
                        onCompleteTodo={(id) => {
                            console.log('[TodosLayout] TodoList onCompleteTodo', id);
                            completeTodo(id);
                        }}
                        onReactivateTodo={(id) => {
                            console.log('[TodosLayout] TodoList onReactivateTodo', id);
                            reactivateTodo(id);
                        }}
                        onUpdateTodo={(todo) => {
                            console.log('[TodosLayout] TodoList onUpdateTodo', todo);
                            updateTodo(todo);
                        }}
                        todoList={displayedTodos}
                        dataVersion={dataVersion}
                    />
                </div>
            </div>
        </div>
    );
}
