// src/shared/Navigation.jsx
import {NavLink} from 'react-router';
import {useAuth} from '../contexts/AuthContext.jsx';

const navLinkStyle = ({isActive}) => ({
    textDecoration: isActive ? 'underline' : 'none',
    fontWeight: isActive ? 'bold' : 'normal',
    color: '#007bff',
});

const componentStyle = {
    navContainerStyle: {
        // padding: '1rem 0',
        // borderBottom: '1px solid #ddd',
        fontFamily: 'Verdana, sans-serif',
        fontSize: '1.2rem',
    },
    navListStyle: {
        listStyle: 'none',
        display: 'flex',
        gap: '1rem',
        padding: 0,
        margin: 0,
    },

}


export default function Navigation() {
    const {isAuthenticated} = useAuth();

    return (
        <nav style={componentStyle.navContainerStyle}>
            <ul style={componentStyle.navListStyle}>
                {/* Always visible */}
                <li>
                    <NavLink to="/about" style={navLinkStyle}>
                        About
                    </NavLink>
                </li>

                {isAuthenticated ? (
                    <>
                        <li>
                            <NavLink to="/todos" style={navLinkStyle}>
                                Todos
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/profile" style={navLinkStyle}>
                                Profile
                            </NavLink>
                        </li>
                    </>
                ) : (
                    <li>
                        <NavLink to="/login" style={navLinkStyle}>
                            Login
                        </NavLink>
                    </li>
                )}
            </ul>
        </nav>
    );
}
