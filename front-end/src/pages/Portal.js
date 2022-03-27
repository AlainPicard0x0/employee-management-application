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
                    <div className="user-icon-background">
                        <FontAwesomeIcon icon={faUser} />
                    </div>                    
                    <h2>John Doe</h2>
                    <button id="my-profile-btn">My Profile</button>                    
                </div>

                <div className="portal-leave-balance">

                    <div className="leave-balance-title">
                        <h3>My Leave</h3>
                    </div>

                    <div className="portal-sick-leave">
                        <div className="sick-leave-hours">
                            <div className="hours-left">
                                <h2>16</h2>
                                <p>hours left</p>
                            </div>                            
                        </div>
                        <div className="sick-leave-title">
                            <h4>Sick Leave</h4>
                        </div>
                    </div>

                    <div className="portal-vacation-leave">
                        <div className="vacation-leave-hours">
                            <div className="hours-left">
                                <h2>32</h2>
                                <p>hours left</p>
                            </div>
                        </div>
                        <div className="vacation-leave-title">
                            <h4>Vacation Leave</h4>
                        </div>
                    </div>

                </div>

            </main>
            <button onClick={() => setLogin(false)}>Logout</button>
        </div>
    )
}

export default Portal;