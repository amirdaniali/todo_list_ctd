import './App.css'
import Logon from './features/Todos/Logon.jsx';
import TodosPage from './features/Todos/TodosPage.jsx';
import Header from './shared/Header.jsx';
import {useAuth} from "./contexts/AuthContext.jsx";


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
