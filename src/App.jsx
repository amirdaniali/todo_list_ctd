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

const todos = [
    { id: 1, title: "review resources" },
    { id: 2, title: "take notes" },
    { id: 3, title: "code out app" },
];

function App() {

    let [todoList, setTodoList] = useState(todos);

    return (
        <div>
            <h1 style={componentStyle.heading}>Todo List</h1>
            <TodoForm />
            <TodoList todoList={todoList} />
        </div>
    );
}

export default App;
