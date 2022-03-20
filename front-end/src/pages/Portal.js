import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Portal = ({login}) => {

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
        </div>
    )
}

export default Portal;