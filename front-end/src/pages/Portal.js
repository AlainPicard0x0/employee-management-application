import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'


const Portal = ({email, login, setLogin, getEmployee, employee}) => {

    const [sickHours, setSickHours] = useState(null);
    const [vacationHours, setVacationHours] = useState(null);
    const navigate = useNavigate();
    const api = `http://localhost:8080/api/employees`    

    useEffect(() => {
        if(login) {
            navigate("/portal");
            findVacationHoursRemaining();  
            findSickHoursRemaining();  
            getEmployee(api, 1);
        }
        else {
            navigate("/");
        }
    }, [login, navigate])

    const findVacationHoursRemaining = () => {
        fetch(`${api}/login`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "email": email
            }
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            setVacationHours(data);
            const vacationHoursRemaining = document.getElementById("vacation-pie");
            const vacationValue = parseInt(vacationHoursRemaining.innerText);
            // Set value of --p(css variable) equal to number of hours remaining (multiply by 1.25 to base 100% on 80 vacation hours)          
            vacationHoursRemaining.style.setProperty("--p", vacationValue * 1.25);
        })
        
    }
    const findSickHoursRemaining = () => {
        fetch(`${api}/login`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "email": email
            },
          })  
          .then(response => {
              return response.json();
          })            
          .then(data => {
            setSickHours(data);
            const sickHoursRemaining = document.getElementById("sick-pie");
            const sickValue = parseInt(sickHoursRemaining.innerText);
            // Set value of style of --p(css variable) equal to number of hours remaining (multiply by 4.17 to base 100% on 24 sick hours)
            sickHoursRemaining.style.setProperty("--p", sickValue * 4.17);
        })
    }

    const checkSickHoursInput = () => {
        let sickHoursRequestedInput = document.getElementById("sick-hours-requested");
        let sickHoursRemaining = document.getElementsByClassName("sick-hours-remaining")[0].innerText;
        if(isNaN(sickHoursRequestedInput.value) || sickHoursRequestedInput.value < 1) {
            sickHoursRequestedInput.value = 0;
        }
        if((sickHoursRemaining - sickHoursRequestedInput.value) < 0) {
            alert("You do not have a sufficient number of sick hours remaining");
            sickHoursRequestedInput.value = sickHoursRemaining;
        }
    }

    const checkVacationHoursInput = () => {
        let vacationHoursRequestedInput = document.getElementById("vacation-hours-requested");
        let vacationHoursRemaining = document.getElementById("vacation-hours-remaining").innerText;
        if(isNaN(vacationHoursRequestedInput.value) || vacationHoursRequestedInput.value < 1) {
            vacationHoursRequestedInput.value = 0;
        }
        if((vacationHoursRemaining - vacationHoursRequestedInput.value) < 0) {
            alert("You do not have a sufficient number of vacation hours remaining");
            vacationHoursRequestedInput.value = vacationHoursRemaining;
        }
    }

    const useSickHours = (e) => {
        e.preventDefault();
        let sickHoursRequestedInput = document.getElementById("sick-hours-requested").value;
        fetch(`${api}/portal/sick-leave`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "email": email,
                "sick-hours": sickHoursRequestedInput 
            },
        })
        .then(response => {
            return response.json();
        })
        .then(data => { 
            setSickHours(data);         
            return data;
        })
        .catch((err) => {
            console.log(err);
        })
    }    

    return (
        <div className="portal">
            <main id="portal-main">

                <div className="portal-profile">
                    <h3>My Profile</h3>                    
                    <div className="user-icon-background">
                        <FontAwesomeIcon icon={faUser} />
                    </div>                    
                    <h2>{`${employee.firstName} ${employee.lastName}`}</h2>
                    <button id="my-profile-btn">My Profile</button>  
                    <button id="logout-btn" onClick={() => setLogin(false)}>Logout</button>                  
                </div>

                <div className="portal-leave-balance">

                    <div className="leave-balance-title">
                        <h3>My Leave</h3>
                    </div>

                    <div className="portal-sick-leave">                        
                        <div id="sick-pie">
                            <div id="sick-pie-background">
                            
                            </div>
                            <div className="hours-left">
                                <h2 className="sick-hours-remaining">{sickHours}</h2>
                                <p>hours left</p>
                            </div>                            
                        </div>
                        <div className="sick-leave-title">
                            <h4>Sick Leave</h4>
                        </div>
                    </div>

                    <div className="portal-vacation-leave">
                        <div id="vacation-pie">
                            <div id="vacation-pie-background">
                                
                            </div>
                            <div className="hours-left">
                                <h2 id="vacation-hours-remaining">{vacationHours}</h2>
                                <p>hours left</p>
                            </div>
                        </div>
                        <div className="vacation-leave-title">
                            <h4>Vacation Leave</h4>
                        </div>
                    </div>

                </div>

                <div className="portal-leave-status">
                    <div id="on-sick-leave-today">
                        <p className="portal-leave-number">3</p>
                        <p className="portal-leave-text">On sick leave today</p>
                    </div>
                    <div id="on-sick-leave-tomorrow">
                        <p className="portal-leave-number">2</p>
                        <p className="portal-leave-text">On sick leave tomorrow</p>
                    </div>
                    <div id="on-vacation-today">
                        <p className="portal-leave-number">4</p>
                        <p className="portal-leave-text">On vacation today</p>
                    </div>
                    <div id="on-vacation-tomorrow">
                        <p className="portal-leave-number">5</p>
                        <p className="portal-leave-text">On vacation tomorrow</p>
                    </div>
                    <div id="sick-leave-awaiting-approval">
                        <p className="portal-leave-number">0</p>
                        <p className="portal-leave-text">Sick leave awaiting approval</p>
                    </div>
                    <div id="vacation-awaiting-approval">
                        <p className="portal-leave-number">1</p>
                        <p className="portal-leave-text">Vacation awaiting approval</p>
                    </div>
                </div>

                <div className="portal-sick-leave-request">
                    <div className="sick-leave-request-title">
                        <h3 id="use-sick-hours">Use Sick Hours</h3>
                    </div>
                    <div className="sick-leave-request">                        
                        <form className="sick-leave-form" onSubmit={useSickHours}>
                            <div className="form-group">
                                <label htmlFor="sick-hours-requested">Enter # of Sick Hours to be used this pay check:</label>
                                <input onChange={checkSickHoursInput} type="number" id="sick-hours-requested" name="sick-hours-requested" required></input>
                            </div>
                            <div className="form-group">
                                <button id="sick-hours-request-btn">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="portal-vacation-leave-request">
                    <div className="vacation-leave-request-title">
                        <h3 id="use-vacation-hours">Use Vacation Hours</h3>
                    </div>
                    <div className="vacation-leave-request">
                        <form className="vacation-leave-form">
                            <div className="form-group">
                                <label htmlFor="vacation-hours-requested">Enter # of Vacation Hours to be used this pay check:</label>
                                <input onChange={checkVacationHoursInput} type="number" id="vacation-hours-requested" name="vacation-hours-requested" required></input>
                            </div>
                            <div className="form-group">
                                <button id="vacation-hours-request-btn">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Add hours worked section? */}

            </main>            
        </div>
    )
}

export default Portal;