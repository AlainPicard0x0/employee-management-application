import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'


const Portal = ({email, login, setLogin, getEmployee, employee}) => {

    const [sickHours, setSickHours] = useState(null);
    const [vacationHours, setVacationHours] = useState(null);
    const [value, onChange] = useState(new Date());
    const navigate = useNavigate();
    const api = `http://localhost:8080/api/employees`    
    const [week, setWeek] = useState({});

    useEffect(() => {
        if(login) {
            navigate("/portal");
            findVacationHoursRemaining();  
            findSickHoursRemaining();  
            getEmployee(api, 1);
            getCurrentWeek();
        }
        else {
            navigate("/");
        }
    }, [login, navigate])

    // TODO implement previous week button and next week button
    const getCurrentWeek = () => {        
        let today = new Date();
        console.log(today);
        let oldMonday = today.getDay();
        let newMonday;
        switch(oldMonday) {
            case 0:
                newMonday = -1;
                break;
            case 1:
                newMonday = 0;
                break;
            case 2: 
                newMonday = 1;
                break;
            case 3:
                newMonday = 2;
                break;
            case 4:
                newMonday = 3;
                break;
            case 5:
                newMonday = 4;
                break;
            case 6: 
                newMonday = 5;
                break;
            default:
                console.log("thisMonday: " + oldMonday);
                newMonday = 0;
        }
        let monday = new Date();
        console.log(monday);
        let tuesday = new Date();
        let wednesday = new Date();
        let thursday = new Date();
        let friday = new Date();
        monday.setDate(monday.getDate() - newMonday);
        tuesday.setDate(tuesday.getDate() - newMonday + 1);
        wednesday.setDate(wednesday.getDate() - newMonday + 2);
        thursday.setDate(thursday.getDate() - newMonday + 3);
        friday.setDate(friday.getDate() - newMonday + 4);
        setWeek({
            "monday": monday.toDateString(),
            "tuesday": tuesday.toDateString(),
            "wednesday": wednesday.toDateString(),
            "thursday": thursday.toDateString(),
            "friday": friday.toDateString()
        })
    }

    // const handleVacationHours = () => {
    //     let vacationHoursRemaining = document.getElementById("vacation-hours-remaining");
    //     let vacationHoursValue = parseInt(vacationHoursRemaining.innerText);
    //     let vacationHoursPie = document.getElementById("vacation-pie");
    //     vacationHoursPie.style.setProperty("--p", vacationHoursValue * 1.25);
    //     console.log(vacationHoursValue);
    // }

    const adjustVacationPie = () => {
        const vacationPie = document.getElementById("vacation-pie");
        const vacationHoursRemaining = document.getElementById("vacation-hours-remaining");
        const vacationValue = parseInt(vacationHoursRemaining.innerText) - 20;
        vacationHoursRemaining.innerText = vacationValue;
        // Set value of --p(css variable) equal to number of hours remaining (multiply by 1.25 to base 100% on 80 vacation hours)          
        vacationPie.style.setProperty("--p", vacationValue * 1.25);
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
            // handleVacationHours();
            // adjustVacationPie();
        })
        
    }

    const testFunc = () => {
        console.log("Hello");
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

    const checkVacationHoursInput = (e) => {
        // get html element for hours left display 
        let vacationHoursRemainingElement = document.getElementById("vacation-hours-remaining");
        // save number of vacation hours displayed in html element to a variable
        let vacationHoursRemaining = vacationHoursRemainingElement.innerText;
        // find value of vacation hours input field and save to a variable (number of hours being requested)
        let vacationHoursRequestedInput = e.target;
        let vacationHoursRequested = vacationHoursRequestedInput.value;
        // get result of adding/subtracting hours requested from remaining hours and store in a variable
        let newHours = vacationHours - vacationHoursRequested;         
        const vacationPie = document.getElementById("vacation-pie");
        
        if(vacationHoursRequestedInput.value > 8) {
            vacationHoursRequestedInput.value = 8;
            alert("Can not use more than 8 hours per day");      
            return;                  
        }
        else {
            if(isNaN(vacationHoursRequestedInput.value) || vacationHoursRequestedInput.value < 1) {
                vacationHoursRequestedInput.value = 0;
                vacationHoursRemainingElement.innerText = vacationHours;
                return;
            }
            if((vacationHoursRemaining - vacationHoursRequestedInput.value) < 0) {
                alert("You do not have a sufficient number of vacation hours remaining");
                vacationHoursRequestedInput.value = vacationHoursRemaining;
            }
            // adjust pie chart for vacation hours
            vacationHoursRemainingElement.innerText = newHours;
            vacationPie.style.setProperty("--p", newHours * 1.25);
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
        if(isNaN(mondayTimeIn) || isNaN(mondayTimeOut) || mondayTimeIn > mondayTimeOut) {
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
                    <Calendar calendarType="US" onChange={onChange} value={value} />
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
                                    <p>{week.monday}</p>                                    
                                </div>   
                                <div className="monday-row-one-in">
                                    <input onChange={calculateTime} id="monday-time-in" type="time"></input>
                                </div>
                                <div className="monday-row-one-out">
                                    <input onChange={e => {calculateTime(); testFunc() }} id="monday-time-out" type="time"></input>
                                </div>
                                <div className="monday-row-one-reg-hours">
                                    <div className="">
                                        <p id="monday-reg-hours">0:00</p>
                                    </div>    
                                </div>
                                <div className="monday-row-one-vacation-hours">
                                    <div className="">
                                        <input onChange={e => {checkVacationHoursInput(e); findVacationHoursRemaining(e) }} type="number" id="monday-vacation-hours-input" className="vacation-hours-requested" defaultValue={0}></input>
                                    </div>
                                </div>
                                <div className="monday-row-one-sick-hours">                                    
                                    <div className="">
                                        <input onChange={checkSickHoursInput} type="number" id="monday-sick-hours-input" name="" defaultValue={0}></input>
                                    </div>                                                 
                                </div>                
                                <div className="monday-row-one-account-code">
                                    <p>11559 (Software Engineer)</p>
                                </div>
                                <div className="monday-row-one-total-hours">
                                    <p id="monday-total-hours">0:00</p>
                                </div>
                            </div>
                            <div className="row-two">
                                <div className="monday-row-two-date">
                                    
                                </div>
                                <div className="monday-row-two-in">
                                    
                                </div>
                                <div className="monday-row-two-out">
                                    
                                </div>
                                <div className="monday-row-two-reg-hours">
                                        
                                </div>
                                <div className="monday-row-two-vacation-hours">
                                    
                                </div>
                                <div className="monday-row-two-sick-hours">
                                                    
                                </div>                
                                <div className="monday-row-two-account-code">
                                    
                                </div>
                                <div className="monday-row-two-total-hours">
                                    
                                </div>                                
                            </div>
                        </div>

                        <div className="tuesday-container">
                            <div className="row-one">
                                <div className="tuesday-row-one-date">
                                    <p>{week.tuesday}</p>
                                </div>   
                                <div className="tuesday-row-one-in">
                                    <input id="tuesday-time-in" type="time"></input>
                                </div>
                                <div className="tuesday-row-one-out">
                                    <input id="tuesday-time-out" type="time"></input>
                                </div>
                                <div className="tuesday-row-one-reg-hours">
                                    <div className="">
                                       <p id="tuesday-reg-hours">0:00</p>
                                    </div>    
                                </div>
                                <div className="tuesday-row-one-vacation-hours">
                                    <div className="">
                                        <input type="number" id="tuesday-vacation-hours-input" defaultValue={0}></input>
                                    </div>
                                </div>
                                <div className="tuesday-row-one-sick-hours">                                    
                                    <div className="">
                                        <input onChange={checkSickHoursInput} type="number" id="tuesday-sick-hours-input" name="" defaultValue={0}></input>
                                    </div>                                                 
                                </div>                
                                <div className="tuesday-row-one-account-code">
                                    <p>11559 (Software Engineer)</p>
                                </div>
                                <div className="tuesday-row-one-total-hours">
                                    <p id="tuesday-total-hours">0:00</p>
                                </div>
                            </div>
                            <div className="row-two">
                                <div className="tuesday-row-two-date">
                                    
                                </div>
                                <div className="tuesday-row-two-in">
                                    
                                </div>
                                <div className="tuesday-row-two-out">
                                    
                                </div>
                                <div className="tuesday-row-two-reg-hours">
                                        
                                </div>
                                <div className="tuesday-row-two-vacation-hours">
                                    
                                </div>
                                <div className="tuesday-row-two-sick-hours">
                                                    
                                </div>                
                                <div className="tuesday-row-two-account-code">
                                    
                                </div>
                                <div className="tuesday-row-two-total-hours">
                                    
                                </div>                                
                            </div>
                        </div>

                        <div className="wednesday-container">
                            <div className="row-one">
                                <div className="wednesday-row-one-date">
                                    <p>{week.wednesday}</p>
                                </div>   
                                <div className="wednesday-row-one-in">
                                    <input id="wednesday-time-in" type="time"></input>
                                </div>
                                <div className="wednesday-row-one-out">
                                    <input id="wednesday-time-out" type="time"></input>
                                </div>
                                <div className="wednesday-row-one-reg-hours">
                                    <div className="">
                                        <p id="wednesday-reg-hours">0:00</p>
                                    </div>    
                                </div>
                                <div className="wednesday-row-one-vacation-hours">
                                    <div className="">
                                        <input type="number" id="wednesday-vacation-hours-input" defaultValue={0}></input>
                                    </div>
                                </div>
                                <div className="wednesday-row-one-sick-hours">                                    
                                    <div className="">
                                        <input onChange={checkSickHoursInput} type="number" id="wednesday-sick-hours-input" name="" defaultValue={0}></input>
                                    </div>                                                 
                                </div>                
                                <div className="wednesday-row-one-account-code">
                                    <p>11559 (Software Engineer)</p>
                                </div>
                                <div className="wednesday-row-one-total-hours">
                                    <p id="wednesday-total-hours">0:00</p>
                                </div>
                            </div>
                            <div className="row-two">
                                <div className="wednesday-row-two-date">
                                    
                                </div>
                                <div className="wednesday-row-two-in">
                                    
                                </div>
                                <div className="wednesday-row-two-out">
                                    
                                </div>
                                <div className="wednesday-row-two-reg-hours">
                                        
                                </div>
                                <div className="wednesday-row-two-vacation-hours">
                                    
                                </div>
                                <div className="wednesday-row-two-sick-hours">
                                                    
                                </div>                
                                <div className="wednesday-row-two-account-code">
                                    
                                </div>
                                <div className="wednesday-row-two-total-hours">
                                    
                                </div>                                
                            </div>
                        </div>

                        <div className="thursday-container">
                            <div className="row-one">
                                <div className="thursday-row-one-date">
                                    <p>{week.thursday}</p>
                                </div>   
                                <div className="thursday-row-one-in">
                                    <input id="thursday-time-in" type="time"></input>
                                </div>
                                <div className="thursday-row-one-out">
                                    <input id="thursday-time-out" type="time"></input>
                                </div>
                                <div className="thursday-row-one-reg-hours">
                                    <div className="">
                                        <p id="thursday-reg-hours">0:00</p>
                                    </div>    
                                </div>
                                <div className="thursday-row-one-vacation-hours">
                                    <div className="">
                                        <input type="number" id="thursday-vacation-hours-input" defaultValue={0}></input>
                                    </div>
                                </div>
                                <div className="thursday-row-one-sick-hours">                                    
                                    <div className="">
                                        <input onChange={checkSickHoursInput} type="number" id="thursday-sick-hours-input" name="" defaultValue={0}></input>
                                    </div>                                                 
                                </div>                
                                <div className="thursday-row-one-account-code">
                                    <p>11559 (Software Engineer)</p>
                                </div>
                                <div className="thursday-row-one-total-hours">
                                    <p id="thursday-total-hours">0:00</p>
                                </div>
                            </div>
                            <div className="row-two">
                                <div className="thursday-row-two-date">
                                    
                                </div>
                                <div className="thursday-row-two-in">
                                    
                                </div>
                                <div className="thursday-row-two-out">
                                    
                                </div>
                                <div className="thursday-row-two-reg-hours">
                                       
                                </div>
                                <div className="thursday-row-two-vacation-hours">
                                    
                                </div>
                                <div className="thursday-row-two-sick-hours">
                                                   
                                </div>                
                                <div className="thursday-row-two-account-code">
                                    
                                </div>
                                <div className="thursday-row-two-total-hours">
                                    
                                </div>                                
                            </div>
                        </div>

                        <div className="friday-container">
                            <div className="row-one">
                                <div className="friday-row-one-date">
                                    <p>{week.friday}</p>
                                </div>   
                                <div className="friday-row-one-in">
                                    <input id="friday-time-in" type="time"></input>
                                </div>
                                <div className="friday-row-one-out">
                                    <input id="friday-time-out" type="time"></input>
                                </div>
                                <div className="friday-row-one-reg-hours">
                                    <div className="">
                                        <p id="friday-reg-hours">0:00</p>
                                    </div>    
                                </div>
                                <div className="friday-row-one-vacation-hours">
                                    <div className="">
                                        <input type="number" id="friday-vacation-hours-input" defaultValue={0}></input>
                                    </div>
                                </div>
                                <div className="friday-row-one-sick-hours">                                    
                                    <div className="">
                                        <input onChange={checkSickHoursInput} type="number" id="friday-sick-hours-input" name="" defaultValue={0}></input>
                                    </div>                                                 
                                </div>                
                                <div className="friday-row-one-account-code">
                                    <p>11559 (Software Engineer)</p>
                                </div>
                                <div className="friday-row-one-total-hours">
                                    <p id="friday-total-hours">0:00</p>
                                </div>
                            </div>
                            <div className="row-two">
                                <div className="friday-row-two-date">
                                    
                                </div>
                                <div className="friday-row-two-in">
                                    
                                </div>
                                <div className="friday-row-two-out">
                                    
                                </div>
                                <div className="friday-row-two-reg-hours">
                                       
                                </div>
                                <div className="friday-row-two-vacation-hours">
                                    
                                </div>
                                <div className="friday-row-two-sick-hours">
                                                   
                                </div>                
                                <div className="friday-row-two-account-code">
                                    
                                </div>
                                <div className="friday-row-two-total-hours">
                                    
                                </div>                                
                            </div>
                        </div>

                        <div className="submit-container">
                            <div className="save-btn-container">
                                <button id="time-card-save-btn">Save</button>
                            </div>
                            <div className="submit-btn-container">
                                <button onClick={getCurrentWeek} id="time-card-submit-btn">Submit for Approval</button>
                            </div>
                            <div className="reg-hours-total-container">
                                <p className="reg-hours-total">0:00</p>
                            </div>
                            <div className="vacation-hours-total-container">
                                <p className="vacation-hours-total">0:00</p>
                            </div>
                            <div className="sick-hours-total-container">
                                <p className="sick-hours-total">0:00</p>
                            </div>
                            <div className="total-hours-total-container">
                                <p className="total-hours-total">0:00</p>
                            </div>
                        </div>

                    </div>
                    
                </div>

            </main>            
        </div>
    )
}

export default Portal;