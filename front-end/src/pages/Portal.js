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
                <div className="portal-col-left">
                    <p>Employee</p>
                    <h2>PORTAL</h2>
                </div>
                <div className="portal-col-right">
                    <h2>Right Side</h2>
                </div>
            </div>
            <main id="portal-main">
                
            </main>
            <button onClick={() => setLogin(false)}>Logout</button>
        </div>
    )
}

export default Portal;