import {useState} from 'react';
import './App.css'
import Logon from './features/Todos/Logon.jsx';
import TodosPage from './features/Todos/TodosPage.jsx';
import Header from './shared/Header.jsx';
import {useAuth} from "./contexts/AuthContext.jsx";

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


    let {isAuthenticated} = useAuth();

    return (
        <>
            <Header/>
            {isAuthenticated ? <TodosPage/> : <Logon/>}
        </>
    );
}

export default App;
