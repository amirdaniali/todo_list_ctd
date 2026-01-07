import './App.css'
import TodoList from './features/TodoList/TodoList.jsx';
import TodoForm from './features/TodoForm.jsx';
import { useState } from 'react';

const componentStyle = {
    heading: {
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        fontSize: "2rem",
        color: "#333",
        margin: "20px 0",
        paddingBottom: "10px",
        borderBottom: "2px solid #007bff",
    },
};



function App() {

    let [todoList, setTodoList] = useState([]);

    const addTodo = (todoTitle) => {
        setTodoList([{
            title: todoTitle,
            id: Date.now(),
            isCompleted: false,
        }, ...todoList])
    };

    const completeTodo = (id) => {
        let newList = [];
        todoList.forEach((todo) => {
            newList.push(todo.id === id ? { ...todo, isCompleted: true } : todo)
        })
        setTodoList(
            newList
        );
    };

    const updateTodo = (editedTodo) => {
        let updatedTodos = [];
        todoList.forEach((todo) => {
            if (todo.id === editedTodo.id) {
                updatedTodos.push(editedTodo);
            }
            else {
                updatedTodos.push(todo)
            }
        })
        setTodoList(updatedTodos);
    }

    return (
        <div>
            <h1 style={componentStyle.heading}>Todo List</h1>
            <TodoForm onAddTodo={addTodo} />
            <TodoList onCompleteTodo={completeTodo} onUpdateTodo={updateTodo} todoList={todoList} />
        </div>
    );
}

export default App;
