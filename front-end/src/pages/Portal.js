import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faUser } from '@fortawesome/free-solid-svg-icons'





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
                <div className="portal-profile">
                    <h3>My Profile</h3>
                    <img className="profile-pic"></img>
                    <FontAwesomeIcon icon={faUser} />
                    <h2>John Doe</h2>
                    <button>My Profile</button>
                    
                </div>
            </main>
            <button onClick={() => setLogin(false)}>Logout</button>
        </div>
    )
}

export default Portal;