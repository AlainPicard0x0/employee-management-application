import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
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

    const adjustVacationPie = () => {
        const vacationHoursRemaining = document.getElementById("vacation-pie");
        const vacationValue = parseInt(vacationHoursRemaining.innerText);
        // Set value of --p(css variable) equal to number of hours remaining (multiply by 1.25 to base 100% on 80 vacation hours)          
        vacationHoursRemaining.style.setProperty("--p", vacationValue * 1.25);
    }

    const findVacationHoursRemaining = () => {
        fetch(`${api}/login/vacation`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "email": email
            },
        })
        .then(response => {
            console.log(response);
            return response.json();
        })
        .then(data => {
            setVacationHours(data);
            adjustVacationPie();
        })
        
    }

    

    const adjustSickPie = () => {
        const sickHoursRemaining = document.getElementById("sick-pie");
        const sickValue = parseInt(sickHoursRemaining.innerText);
        // Set value of style of --p(css variable) equal to number of hours remaining (multiply by 4.17 to base 100% on 24 sick hours)
        sickHoursRemaining.style.setProperty("--p", sickValue * 4.17);
}

    const findSickHoursRemaining = () => {
        fetch(`${api}/login/sick`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "email": email
            },
          })  
          .then(response => {
              console.log(response);
              return response.json();
          })            
          .then(data => {
            setSickHours(data);
            adjustSickPie();
            // const sickHoursRemaining = document.getElementById("sick-pie");
            // const sickValue = parseInt(sickHoursRemaining.innerText);
            // Set value of style of --p(css variable) equal to number of hours remaining (multiply by 4.17 to base 100% on 24 sick hours)
            // sickHoursRemaining.style.setProperty("--p", sickValue * 4.17);
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
        let sickHoursRequestedField = document.getElementById("sick-hours-requested");
        let sickHoursRequestedInput = sickHoursRequestedField.value;
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
            sickHoursRequestedField.value = 0;    
            adjustSickPie(); 
            return data;
        })
        .catch((err) => {
            console.log(err);
        })
    }   
    
    const useVacationHours = (e) => {
        e.preventDefault();
        let vacationHoursRequestedField = document.getElementById("vacation-hours-requested");
        let vacationHoursRequested = vacationHoursRequestedField.value;
        fetch(`${api}/portal/vacation-leave`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "email": email,
                "vacation-hours": vacationHoursRequested
            }
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            setVacationHours(data);
            vacationHoursRequestedField.value = 0;
            adjustVacationPie();
            return data;
        })
        .catch((err) => {
            console.log(err);
        })        
    }

    // HTML on line 325
    const calculateTime = () => {
        let mondayTimeIn = document.getElementById("monday-time-in").valueAsNumber;
        let mondayTimeOut = document.getElementById("monday-time-out").valueAsNumber;
        let mondayRegHours = document.getElementById("monday-reg-hours");
        let mondayTotalHours = document.getElementById("monday-total-hours");
        let minutes = (mondayTimeOut - mondayTimeIn) % 3600000 / 60000;
        let hours = Math.floor((mondayTimeOut - mondayTimeIn) / 3600000)
        console.log(mondayTimeOut);
        if(isNaN(mondayTimeIn) || isNaN(mondayTimeOut)) {
            mondayRegHours.innerText = "00:00";
            mondayTotalHours.innerText = "00:00";
        }
        else {
            if(minutes < 10) {
                mondayRegHours.innerText = hours + ":0" + minutes;
                mondayTotalHours.innerText = hours + ":0" + minutes;
            }
            else {
                mondayRegHours.innerText = hours + ":" + minutes;
                mondayTotalHours.innerText = hours + ":" + minutes;
            }        
        }
        
        console.log("hours: " + hours + " minutes: " + minutes);
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
                
                <div className="portal-calendar">
                    <Calendar />
                </div>

                <div className="portal-sick-leave-request">
                    <div className="sick-leave-request-title">
                        <h3 id="use-sick-hours">Use Sick Hours</h3>
                    </div>
                    <div className="sick-leave-request">                        
                        <form className="sick-leave-form" onSubmit={useSickHours}>
                            <div className="form-group">
                                <label htmlFor="sick-hours-requested">Enter # of Sick Hours to be used this pay check:</label>
                                <input onChange={checkSickHoursInput} type="number" id="sick-hours-requested" name="sick-hours-requested" defaultValue={0} required></input>
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
                        <form className="vacation-leave-form" onSubmit={useVacationHours}>
                            <div className="form-group">
                                <label htmlFor="vacation-hours-requested">Enter # of Vacation Hours to be used this pay check:</label>
                                <input onChange={checkVacationHoursInput} type="number" id="vacation-hours-requested" name="vacation-hours-requested" defaultValue={0} required></input>
                            </div>
                            <div className="form-group">
                                <button id="vacation-hours-request-btn">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Add hours worked section? */}
                <div className="time-card">
                    <div className="time-card-header">
                        <div id="time-card-date">
                            <p>Date</p>
                        </div>
                        <div id="time-card-in">
                            <p>In</p>
                        </div>
                        <div id="time-card-out">
                            <p>Out</p>
                        </div>
                        <div id="time-card-reg-hours">
                            <p>Reg<br></br>Hours</p>
                        </div>
                        <div id="time-card-vacation-hours">
                            <p>Vacation Hours</p>
                        </div>
                        <div id="time-card-sick-hours">
                            <p>Sick Hours</p>
                        </div>
                        <div id="time-card-account-code">
                            <p>Account Code</p>
                        </div>
                        <div id="time-card-total-hours">
                            <p>Total<br></br> Hours</p>
                        </div>
                    </div>
                    <div className="time-card-body">
                        <div className="monday-container">
                            <div className="row-one">
                                <div className="monday-row-one-date">
                                    <p>Monday</p>
                                </div>   
                                <div className="monday-row-one-in">
                                    <input onChange={calculateTime} id="monday-time-in" type="time"></input>
                                </div>
                                <div className="monday-row-one-out">
                                    <input onChange={calculateTime} id="monday-time-out" type="time"></input>
                                </div>
                                <div className="monday-row-one-reg-hours">
                                    <p id="monday-reg-hours">Reg Hours</p>    
                                </div>
                                <div className="monday-row-one-vacation-hours">
                                    <p>Vac Hours</p>
                                </div>
                                <div className="monday-row-one-sick-hours">
                                    <p>Sick Hours</p>                
                                </div>                
                                <div className="monday-row-one-account-code">
                                    <p>Account Code</p>
                                </div>
                                <div className="monday-row-one-total-hours">
                                    <p id="monday-total-hours">Total Hours</p>
                                </div>
                            </div>
                            <div className="row-two">
                                <div className="monday-row-two-date">
                                    <p></p>
                                </div>
                                <div className="monday-row-two-in">
                                    <p>Time in</p>
                                </div>
                                <div className="monday-row-two-out">
                                    <p>Time out</p>
                                </div>
                                <div className="monday-row-two-reg-hours">
                                    <p>Reg Hours</p>    
                                </div>
                                <div className="monday-row-two-vacation-hours">
                                    <p>Vac Hours</p>
                                </div>
                                <div className="monday-row-two-sick-hours">
                                    <p>Sick Hours</p>                
                                </div>                
                                <div className="monday-row-two-account-code">
                                    <p>Account Code</p>
                                </div>
                                <div className="monday-row-two-total-hours">
                                    <p>Total Hours</p>
                                </div>                                
                            </div>
                        </div>

                        <div className="tuesday-container">
                            <div className="row-one">
                                <div className="tuesday-row-one-date">
                                    <p>Tuesday</p>
                                </div>   
                                <div className="tuesday-row-one-in">
                                    <p>Time in</p>
                                </div>
                                <div className="tuesday-row-one-out">
                                    <p>Time out</p>
                                </div>
                                <div className="tuesday-row-one-reg-hours">
                                    <p>Reg Hours</p>    
                                </div>
                                <div className="tuesday-row-one-vacation-hours">
                                    <p>Vac Hours</p>
                                </div>
                                <div className="tuesday-row-one-sick-hours">
                                    <p>Sick Hours</p>                
                                </div>                
                                <div className="tuesday-row-one-account-code">
                                    <p>Account Code</p>
                                </div>
                                <div className="tuesday-row-one-total-hours">
                                    <p>Total Hours</p>
                                </div>
                            </div>
                            <div className="row-two">
                                <div className="tuesday-row-two-date">
                                    <p></p>
                                </div>
                                <div className="tuesday-row-two-in">
                                    <p>Time in</p>
                                </div>
                                <div className="tuesday-row-two-out">
                                    <p>Time out</p>
                                </div>
                                <div className="tuesday-row-two-reg-hours">
                                    <p>Reg Hours</p>    
                                </div>
                                <div className="tuesday-row-two-vacation-hours">
                                    <p>Vac Hours</p>
                                </div>
                                <div className="tuesday-row-two-sick-hours">
                                    <p>Sick Hours</p>                
                                </div>                
                                <div className="tuesday-row-two-account-code">
                                    <p>Account Code</p>
                                </div>
                                <div className="tuesday-row-two-total-hours">
                                    <p>Total Hours</p>
                                </div>                                
                            </div>
                        </div>

                        <div className="wednesday-container">
                            <div className="row-one">
                                <div className="wednesday-row-one-date">
                                    <p>Wednesday</p>
                                </div>   
                                <div className="wednesday-row-one-in">
                                    <p>Time in</p>
                                </div>
                                <div className="wednesday-row-one-out">
                                    <p>Time out</p>
                                </div>
                                <div className="wednesday-row-one-reg-hours">
                                    <p>Reg Hours</p>    
                                </div>
                                <div className="wednesday-row-one-vacation-hours">
                                    <p>Vac Hours</p>
                                </div>
                                <div className="wednesday-row-one-sick-hours">
                                    <p>Sick Hours</p>                
                                </div>                
                                <div className="wednesday-row-one-account-code">
                                    <p>Account Code</p>
                                </div>
                                <div className="wednesday-row-one-total-hours">
                                    <p>Total Hours</p>
                                </div>
                            </div>
                            <div className="row-two">
                                <div className="wednesday-row-two-date">
                                    <p></p>
                                </div>
                                <div className="wednesday-row-two-in">
                                    <p>Time in</p>
                                </div>
                                <div className="wednesday-row-two-out">
                                    <p>Time out</p>
                                </div>
                                <div className="wednesday-row-two-reg-hours">
                                    <p>Reg Hours</p>    
                                </div>
                                <div className="wednesday-row-two-vacation-hours">
                                    <p>Vac Hours</p>
                                </div>
                                <div className="wednesday-row-two-sick-hours">
                                    <p>Sick Hours</p>                
                                </div>                
                                <div className="wednesday-row-two-account-code">
                                    <p>Account Code</p>
                                </div>
                                <div className="wednesday-row-two-total-hours">
                                    <p>Total Hours</p>
                                </div>                                
                            </div>
                        </div>

                        <div className="thursday-container">
                            <div className="row-one">
                                <div className="thursday-row-one-date">
                                    <p>Thursday</p>
                                </div>   
                                <div className="thursday-row-one-in">
                                    <p>Time in</p>
                                </div>
                                <div className="thursday-row-one-out">
                                    <p>Time out</p>
                                </div>
                                <div className="thursday-row-one-reg-hours">
                                    <p>Reg Hours</p>    
                                </div>
                                <div className="thursday-row-one-vacation-hours">
                                    <p>Vac Hours</p>
                                </div>
                                <div className="thursday-row-one-sick-hours">
                                    <p>Sick Hours</p>                
                                </div>                
                                <div className="thursday-row-one-account-code">
                                    <p>Account Code</p>
                                </div>
                                <div className="thursday-row-one-total-hours">
                                    <p>Total Hours</p>
                                </div>
                            </div>
                            <div className="row-two">
                                <div className="thursday-row-two-date">
                                    <p></p>
                                </div>
                                <div className="thursday-row-two-in">
                                    <p>Time in</p>
                                </div>
                                <div className="thursday-row-two-out">
                                    <p>Time out</p>
                                </div>
                                <div className="thursday-row-two-reg-hours">
                                    <p>Reg Hours</p>    
                                </div>
                                <div className="thursday-row-two-vacation-hours">
                                    <p>Vac Hours</p>
                                </div>
                                <div className="thursday-row-two-sick-hours">
                                    <p>Sick Hours</p>                
                                </div>                
                                <div className="thursday-row-two-account-code">
                                    <p>Account Code</p>
                                </div>
                                <div className="thursday-row-two-total-hours">
                                    <p>Total Hours</p>
                                </div>                                
                            </div>
                        </div>

                        <div className="friday-container">
                            <div className="row-one">
                                <div className="friday-row-one-date">
                                    <p>Friday</p>
                                </div>   
                                <div className="friday-row-one-in">
                                    <p>Time in</p>
                                </div>
                                <div className="friday-row-one-out">
                                    <p>Time out</p>
                                </div>
                                <div className="friday-row-one-reg-hours">
                                    <p>Reg Hours</p>    
                                </div>
                                <div className="friday-row-one-vacation-hours">
                                    <p>Vac Hours</p>
                                </div>
                                <div className="friday-row-one-sick-hours">
                                    <p>Sick Hours</p>                
                                </div>                
                                <div className="friday-row-one-account-code">
                                    <p>Account Code</p>
                                </div>
                                <div className="friday-row-one-total-hours">
                                    <p>Total Hours</p>
                                </div>
                            </div>
                            <div className="row-two">
                                <div className="friday-row-two-date">
                                    <p></p>
                                </div>
                                <div className="friday-row-two-in">
                                    <p>Time in</p>
                                </div>
                                <div className="friday-row-two-out">
                                    <p>Time out</p>
                                </div>
                                <div className="friday-row-two-reg-hours">
                                    <p>Reg Hours</p>    
                                </div>
                                <div className="friday-row-two-vacation-hours">
                                    <p>Vac Hours</p>
                                </div>
                                <div className="friday-row-two-sick-hours">
                                    <p>Sick Hours</p>                
                                </div>                
                                <div className="friday-row-two-account-code">
                                    <p>Account Code</p>
                                </div>
                                <div className="friday-row-two-total-hours">
                                    <p>Total Hours</p>
                                </div>                                
                            </div>
                        </div>

                    </div>
                    
                </div>

            </main>            
        </div>
    )
}

export default Portal;