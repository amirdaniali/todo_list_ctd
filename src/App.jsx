import './App.css'
import TodoList from './TodoList.jsx';
import TodoForm from './TodoForm.jsx';
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
        }, ...todoList])
    };

    return (
        <div>
            <h1 style={componentStyle.heading}>Todo List</h1>
            <TodoForm onAddTodo={addTodo} />
            <TodoList todoList={todoList} />
        </div>
    );
}

export default App;
