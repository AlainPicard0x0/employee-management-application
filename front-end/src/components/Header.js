import { Link } from "react-router-dom";

const Header = () => {
    return (
        <nav>
            <div className="header">
                <h1>ABC Corp</h1>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/register">Register</Link>
                    </li>
                    <li>
                        <Link to="/portal">Employee Portal</Link>
                    </li>
                </ul>
            </div>
            
        </nav>
    )
}

export default Header;