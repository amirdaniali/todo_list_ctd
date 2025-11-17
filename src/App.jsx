import './App.css'
import TodoList from './TodoList.jsx';
import TodoForm from './TodoForm.jsx';

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
    return (
        <div>
            <h1 style={componentStyle.heading}>Todo List</h1>
            <TodoForm />
            <TodoList />
        </div>
    );
}

export default App;
