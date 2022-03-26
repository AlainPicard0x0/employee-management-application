import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Portal = ({login, setLogin}) => {

    const navigate = useNavigate();

    useEffect(() => {
        if(login) {
            navigate("/portal");
        }
        else {
            navigate("/login");
        }
    }, [login, navigate])

    return (
        <div className="portal">
            <div className="portal-nav">
                <h1>Employee</h1>
                <h2>Portal</h2>
            </div>
            <h1>Employee Portal Page</h1>
            <button onClick={() => setLogin(false)}>Logout</button>
        </div>
    )
}

export default Portal;