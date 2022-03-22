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
            <h1>Employee Portal Page</h1>
            <button onClick={() => setLogin(!login)}>Logout</button>
        </div>
    )
}

export default Portal;