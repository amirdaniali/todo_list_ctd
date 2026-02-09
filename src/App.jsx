import './App.css';
import {Routes, Route} from 'react-router';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import TodosPage from './pages/TodosPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import RequireAuth from './components/RequireAuth';
import Header from './shared/Header';
import LogoffOage from "./pages/LogoffOage.jsx";
import Footer from "./shared/Footer.jsx";

function App() {
    return (
        <>
            <Header/>
            <Routes>
                <Route path='/' element={<HomePage/>}/>
                <Route path='/about' element={<AboutPage/>}/>
                <Route path='/login' element={<LoginPage/>}/>

                <Route
                    path='/todos'
                    element={
                        <RequireAuth>
                            <TodosPage/>
                        </RequireAuth>
                    }
                />
                <Route
                    path='/logoff'
                    element={
                        <RequireAuth>
                            <LogoffOage/>
                        </RequireAuth>
                    }
                />
                <Route
                    path='/profile'
                    element={
                        <RequireAuth>
                            <ProfilePage/>
                        </RequireAuth>
                    }
                />
                <Route path='*' element={<NotFoundPage/>}/>
            </Routes>
            <Footer/>
        </>
    );
}

export default App;