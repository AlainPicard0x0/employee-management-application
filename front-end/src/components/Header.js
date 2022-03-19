import { Link } from "react-router-dom";

const Header = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/login">Login</Link>
                </li>
                <li>
                    <Link to="/register">Register</Link>
                </li>
                <li>
                    <Link to="/portal">Employee Portal</Link>
                </li>
            </ul>
        </nav>
    )
}

export default Header;