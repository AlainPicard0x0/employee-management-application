import { useEffect, useState } from "react";
import { BrowserRouter,Routes, Route, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import {faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import {faMinusCircle} from '@fortawesome/free-solid-svg-icons';
import {faPersonWalkingLuggage} from '@fortawesome/free-solid-svg-icons';
import {faUmbrellaBeach} from '@fortawesome/free-solid-svg-icons'
import {faNotesMedical} from '@fortawesome/free-solid-svg-icons';
import {faSyringe} from '@fortawesome/free-solid-svg-icons';
import {faBuildingUser} from '@fortawesome/free-solid-svg-icons';
import {faBusinessTime} from '@fortawesome/free-solid-svg-icons';

const Portal = ({email, login, setLogin, getEmployee, employee}) => {

    const [sickHours, setSickHours] = useState(null);
    const [vacationHours, setVacationHours] = useState(null);
    const [value, onChange] = useState(new Date());
    const navigate = useNavigate();
    const api = `http://localhost:8080/api/employees`;    
    const [week, setWeek] = useState({});
    
    

    useEffect(() => {
        if(login) {
            navigate("/portal");
            findVacationHoursRemaining();  
            findSickHoursRemaining();  
            getEmployee(api, 1);
            getCurrentWeek();
            addMobileVacationHours();
            subtractMobileVacationHours();
        }
        else {
            navigate("/");
        }
    }, [login, navigate])

    // TODO implement previous week button and next week button
    const getCurrentWeek = () => {        
        let today = new Date();
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

    const adjustVacationPie = () => {
        const vacationPie = document.getElementById("vacation-pie");
        const vacationHoursRemaining = document.getElementById("vacation-hours-remaining");
        const vacationValue = parseInt(vacationHoursRemaining.innerText);
        vacationHoursRemaining.innerText = vacationValue;
        // Set value of --p(css variable) equal to number of hours remaining (multiply by 1.25 to base 100% on 80 vacation hours)          
        vacationPie.style.setProperty("--p", vacationValue * 1.25);
    }

    // removed this from vacation-hours-input onChange() 4/30/2022
    const findVacationHoursRemaining = () => {
        fetch(`${api}/login/vacation`, {
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
            setVacationHours(data);
            adjustVacationPie();
        })        
    }

    const adjustSickPie = () => {
        const sickPie = document.getElementById("sick-pie");
        const sickHoursRemaining = document.getElementById("sick-hours-remaining");
        const sickValue = parseInt(sickHoursRemaining.innerText);
        sickHoursRemaining.innerText = sickValue;
        // Set value of --p(css variable) equal to number of hours remaining (multiply by 4.17 to base 100% on 24 sick hours)          
        sickPie.style.setProperty("--p", sickValue * 4.17);
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
              return response.json();
          })            
          .then(data => {
            setSickHours(data);
            adjustSickPie();
        })
    }

    const checkSickHoursInput = (e) => {
         // get html element for hours left display 
         let sickHoursRemainingElement = document.getElementById("sick-hours-remaining");
         // save number of sick hours displayed in html element to a variable
         let sickHoursRemaining = sickHoursRemainingElement.innerText;
         // find value of sick hours input field and save to a variable (number of hours being requested)
         let sickHoursRequestedInput = e.target;
         let sickHoursRequested = sickHoursRequestedInput.value;
         // get result of adding/subtracting hours requested from remaining hours and store in a variable
         let newHours = sickHours - sickHoursRequested;         
         const sickPie = document.getElementById("sick-pie");
         
         if(sickHoursRequestedInput.value > 8) {
             sickHoursRequestedInput.value = 8;
             alert("Can not use more than 8 hours per day");      
             return;                  
         }
         else {
             if(isNaN(sickHoursRequestedInput.value) || sickHoursRequestedInput.value < 1) {
                 sickHoursRequestedInput.value = 0;
                 // won't need this line once eventListener added to sick-hours input
                 // sickHoursRemainingElement.innerText = sickHours;
                 //
                 return;
             }
             if(sickHoursRemaining < 0) {
                 alert("You do not have a sufficient number of sick hours remaining");
                 sickHoursRequestedInput.value = sickHoursRemaining;
             }
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
                //vacationHoursRemainingElement.innerText = vacationHours;
                return;
            }
            if(vacationHoursRemaining < 0) {
                console.log("VacationHoursRemaining: " + vacationHoursRemaining);
                console.log("VacationHoursRequestedInput.value: " + vacationHoursRequestedInput.value);
                console.log(vacationHoursRemaining - vacationHoursRequestedInput.value);
                alert("You do not have a sufficient number of vacation hours remaining");
                vacationHoursRequestedInput.value = vacationHoursRemaining;
            }
            // adjust pie chart for vacation hours
            // getTotalVacationHours(e);
            // vacationHoursRemainingElement.innerText = newHours;
            // vacationPie.style.setProperty("--p", newHours * 1.25);
        }
    }

    const adjustVacationSickHours = () => {
        let mondayVacationHoursRequestedField = document.getElementById("monday-vacation-hours-input");
        let mondayVacationHoursRequested = parseFloat(mondayVacationHoursRequestedField.value);
        let tuesdayVacationHoursRequestedField = document.getElementById("tuesday-vacation-hours-input");
        let tuesdayVacationHoursRequested = parseFloat(tuesdayVacationHoursRequestedField.value);
        let wednesdayVacationHoursRequestedField = document.getElementById("wednesday-vacation-hours-input");
        let wednesdayVacationHoursRequested = parseFloat(wednesdayVacationHoursRequestedField.value);
        let thursdayVacationHoursRequestedField = document.getElementById("thursday-vacation-hours-input");
        let thursdayVacationHoursRequested = parseFloat(thursdayVacationHoursRequestedField.value);
        let fridayVacationHoursRequestedField = document.getElementById("friday-vacation-hours-input");
        let fridayVacationHoursRequested = parseFloat(fridayVacationHoursRequestedField.value);
        let totalVacationHours = mondayVacationHoursRequested + tuesdayVacationHoursRequested + wednesdayVacationHoursRequested + thursdayVacationHoursRequested + fridayVacationHoursRequested;
        fetch(`${api}/portal/vacation-leave`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "email": email,
                "vacation-hours": totalVacationHours
            }
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            setVacationHours(data);
            mondayVacationHoursRequestedField.value = 0;
            tuesdayVacationHoursRequestedField.value = 0;
            wednesdayVacationHoursRequestedField.value = 0;
            thursdayVacationHoursRequestedField.value = 0;
            fridayVacationHoursRequestedField.value = 0;
            document.getElementsByClassName("vacation-hours-total")[0].innerText = "0:00";
            adjustVacationPie();
            return data;
        })
        .then(function () {
            let mondaySickHoursRequestedField = document.getElementById("monday-sick-hours-input");
            let mondaySickHoursRequested = parseFloat(mondaySickHoursRequestedField.value);
            let tuesdaySickHoursRequestedField = document.getElementById("tuesday-sick-hours-input");
            let tuesdaySickHoursRequested = parseFloat(tuesdaySickHoursRequestedField.value);
            let wednesdaySickHoursRequestedField = document.getElementById("wednesday-sick-hours-input");
            let wednesdaySickHoursRequested = parseFloat(wednesdaySickHoursRequestedField.value);
            let thursdaySickHoursRequestedField = document.getElementById("thursday-sick-hours-input");
            let thursdaySickHoursRequested = parseFloat(thursdaySickHoursRequestedField.value);
            let fridaySickHoursRequestedField = document.getElementById("friday-sick-hours-input");
            let fridaySickHoursRequested = parseFloat(fridaySickHoursRequestedField.value);
            let totalSickHours = mondaySickHoursRequested + tuesdaySickHoursRequested + wednesdaySickHoursRequested + thursdaySickHoursRequested + fridaySickHoursRequested;
            fetch(`${api}/portal/sick-leave`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "email": email,
                    "sick-hours": totalSickHours 
                },
            })
            .then(response => {
                return response.json();
            })
            .then(data => { 
                setSickHours(data);  
                mondaySickHoursRequestedField.value = 0;   
                tuesdaySickHoursRequestedField.value = 0;
                wednesdaySickHoursRequestedField.value = 0;
                thursdaySickHoursRequestedField.value = 0;
                fridaySickHoursRequestedField.value = 0;
                document.getElementsByClassName("sick-hours-total")[0].innerText = "0:00";
                adjustSickPie(); 
                return data;
            })
            document.getElementById("monday-total-hours").innerText = "0:00";
            document.getElementById("tuesday-total-hours").innerText = "0:00";
            document.getElementById("wednesday-total-hours").innerText = "0:00";
            document.getElementById("thursday-total-hours").innerText = "0:00";
            document.getElementById("friday-total-hours").innerText = "0:00";
            document.getElementsByClassName("total-hours-total")[0].innerText = "0:00";
        })       
    }

    // HTML on line 325
    const calculateTime = () => {
        // Monday
        let mondayTimeIn = document.getElementById("monday-time-in").valueAsNumber;
        let mondayTimeOut = document.getElementById("monday-time-out").valueAsNumber;
        let mondayRegHoursInput = document.getElementById("monday-reg-hours");
        let mondayVacationHoursInput = parseFloat(document.getElementById("monday-vacation-hours-input").value);
        let mondaySickHoursInput = parseFloat(document.getElementById("monday-sick-hours-input").value);
        let mondayTotalHoursInput = document.getElementById("monday-total-hours");
        
        // 60,000ms = 1 minute; 3,600,000ms = 1 hour
        let mondayRegTime = parseInt(mondayTimeOut - mondayTimeIn) || 0;
        let mondayVacationTime = mondayVacationHoursInput * 3600000;
        let mondaySickTime = mondaySickHoursInput * 3600000; 
        let mondayRegHours = Math.floor(mondayRegTime / 3600000);
        let mondayRegMinutes = mondayRegTime % 3600000 / 60000;
        let mondayVacHours = Math.floor(mondayVacationTime / 3600000);
        let mondayVacMinutes = mondayVacationTime % 3600000 / 60000;
        let mondaySickHours = Math.floor(mondaySickTime / 3600000);
        let mondaySickMinutes = mondaySickTime % 3600000 / 60000;
        let mondayTotalHours = mondayRegHours + mondayVacHours + mondaySickHours;
        let mondayTotalMinutes = mondayRegMinutes + mondayVacMinutes + mondaySickMinutes;        
        if(isNaN(mondayTimeIn) || isNaN(mondayTimeOut) || mondayTimeIn > mondayTimeOut) {
            if(mondayVacMinutes + mondaySickMinutes === 0 && mondayVacHours + mondaySickHours === 0) {
                mondayTotalHoursInput.innerText = "0:00";
            }
            else if(mondayVacMinutes + mondaySickMinutes < 10) {
                mondayTotalHoursInput.innerText = Math.floor(mondayVacHours + mondaySickHours) + ":0" + Math.floor(mondayVacMinutes + mondaySickMinutes);
            }
            else {
                mondayRegHoursInput.innerText = "0:00";
                mondayTotalHoursInput.innerText = Math.floor(mondayVacHours + mondaySickHours) + ":" + Math.floor(mondayVacMinutes + mondaySickMinutes);
            }         
        }
        else {
            if(mondayRegMinutes < 10 && mondayTotalMinutes < 10) {
                mondayRegHoursInput.innerText = mondayRegHours + ":0" + mondayRegMinutes;
                mondayTotalHoursInput.innerText = mondayTotalHours + ":0" + mondayTotalMinutes;
            }
            else if(mondayRegMinutes < 10) {
                mondayRegHoursInput.innerText = mondayRegHours + ":0" + mondayRegMinutes;
                mondayTotalHoursInput.innerText = mondayTotalHours + ":" + mondayTotalMinutes;
            }
            else {
                mondayRegHoursInput.innerText = mondayRegHours + ":" + mondayRegMinutes;
                mondayTotalHoursInput.innerText = mondayTotalHours + ":" + mondayTotalMinutes;
            }        
        }  
        // Tuesday
        let tuesdayTimeIn = document.getElementById("tuesday-time-in").valueAsNumber;
        let tuesdayTimeOut = document.getElementById("tuesday-time-out").valueAsNumber;
        let tuesdayRegHoursInput = document.getElementById("tuesday-reg-hours");
        let tuesdayVacationHoursInput = parseFloat(document.getElementById("tuesday-vacation-hours-input").value);
        let tuesdaySickHoursInput = parseFloat(document.getElementById("tuesday-sick-hours-input").value);
        let tuesdayTotalHoursInput = document.getElementById("tuesday-total-hours");

        // 60,000ms = 1 minute; 3,600,000ms = 1 hour
        let tuesdayRegTime = parseInt(tuesdayTimeOut - tuesdayTimeIn) || 0;
        let tuesdayVacationTime = tuesdayVacationHoursInput * 3600000;
        let tuesdaySickTime = tuesdaySickHoursInput * 3600000; 
        let tuesdayRegHours = Math.floor(tuesdayRegTime / 3600000);
        let tuesdayRegMinutes = tuesdayRegTime % 3600000 / 60000;
        let tuesdayVacHours = Math.floor(tuesdayVacationTime / 3600000);
        let tuesdayVacMinutes = tuesdayVacationTime % 3600000 / 60000;
        let tuesdaySickHours = Math.floor(tuesdaySickTime / 3600000);
        let tuesdaySickMinutes = tuesdaySickTime % 3600000 / 60000;
        let tuesdayTotalHours = tuesdayRegHours + tuesdayVacHours + tuesdaySickHours;
        let tuesdayTotalMinutes = tuesdayRegMinutes + tuesdayVacMinutes + tuesdaySickMinutes;        
        if(isNaN(tuesdayTimeIn) || isNaN(tuesdayTimeOut) || tuesdayTimeIn > tuesdayTimeOut) {
            if(tuesdayVacMinutes + tuesdaySickMinutes === 0 && tuesdayVacHours + tuesdaySickHours === 0) {
                tuesdayTotalHoursInput.innerText = "0:00";
            }
            else if(tuesdayVacMinutes + tuesdaySickMinutes < 10) {
                tuesdayTotalHoursInput.innerText = Math.floor(tuesdayVacHours + tuesdaySickHours) + ":0" + Math.floor(tuesdayVacMinutes + tuesdaySickMinutes);
            }
            else {
                tuesdayRegHoursInput.innerText = "0:00";
                tuesdayTotalHoursInput.innerText = Math.floor(tuesdayVacHours + tuesdaySickHours) + ":" + Math.floor(tuesdayVacMinutes + tuesdaySickMinutes);
            }         
        }
        else {
            if(tuesdayRegMinutes < 10 && tuesdayTotalMinutes < 10) {
                tuesdayRegHoursInput.innerText = tuesdayRegHours + ":0" + tuesdayRegMinutes;
                tuesdayTotalHoursInput.innerText = tuesdayTotalHours + ":0" + tuesdayTotalMinutes;
            }
            else if(tuesdayRegMinutes < 10) {
                tuesdayRegHoursInput.innerText = tuesdayRegHours + ":0" + tuesdayRegMinutes;
                tuesdayTotalHoursInput.innerText = tuesdayTotalHours + ":" + tuesdayTotalMinutes;
            }
            else {
                tuesdayRegHoursInput.innerText = tuesdayRegHours + ":" + tuesdayRegMinutes;
                tuesdayTotalHoursInput.innerText = tuesdayTotalHours + ":" + tuesdayTotalMinutes;
            }        
        }
        // Wednesday
        let wednesdayTimeIn = document.getElementById("wednesday-time-in").valueAsNumber;
        let wednesdayTimeOut = document.getElementById("wednesday-time-out").valueAsNumber;
        let wednesdayRegHoursInput = document.getElementById("wednesday-reg-hours");
        let wednesdayVacationHoursInput = parseFloat(document.getElementById("wednesday-vacation-hours-input").value);
        let wednesdaySickHoursInput = parseFloat(document.getElementById("wednesday-sick-hours-input").value);
        let wednesdayTotalHoursInput = document.getElementById("wednesday-total-hours");
        
        // 60,000ms = 1 minute; 3,600,000ms = 1 hour
        let wednesdayRegTime = parseInt(wednesdayTimeOut - wednesdayTimeIn) || 0;
        let wednesdayVacationTime = wednesdayVacationHoursInput * 3600000;
        let wednesdaySickTime = wednesdaySickHoursInput * 3600000; 
        let wednesdayRegHours = Math.floor(wednesdayRegTime / 3600000);
        let wednesdayRegMinutes = wednesdayRegTime % 3600000 / 60000;
        let wednesdayVacHours = Math.floor(wednesdayVacationTime / 3600000);
        let wednesdayVacMinutes = wednesdayVacationTime % 3600000 / 60000;
        let wednesdaySickHours = Math.floor(wednesdaySickTime / 3600000);
        let wednesdaySickMinutes = wednesdaySickTime % 3600000 / 60000;
        let wednesdayTotalHours = wednesdayRegHours + wednesdayVacHours + wednesdaySickHours;
        let wednesdayTotalMinutes = wednesdayRegMinutes + wednesdayVacMinutes + wednesdaySickMinutes;        
        if(isNaN(wednesdayTimeIn) || isNaN(wednesdayTimeOut) || wednesdayTimeIn > wednesdayTimeOut) {
            if(wednesdayVacMinutes + wednesdaySickMinutes === 0 && wednesdayVacHours + wednesdaySickHours === 0) {
                wednesdayTotalHoursInput.innerText = "0:00";
            }
            else if(wednesdayVacMinutes + wednesdaySickMinutes < 10) {
                wednesdayTotalHoursInput.innerText = Math.floor(wednesdayVacHours + wednesdaySickHours) + ":0" + Math.floor(wednesdayVacMinutes + wednesdaySickMinutes);
            }
            else {
                wednesdayRegHoursInput.innerText = "0:00";
                wednesdayTotalHoursInput.innerText = Math.floor(wednesdayVacHours + wednesdaySickHours) + ":" + Math.floor(wednesdayVacMinutes + wednesdaySickMinutes);
            }         
        }
        else {
            if(wednesdayRegMinutes < 10 && wednesdayTotalMinutes < 10) {
                wednesdayRegHoursInput.innerText = wednesdayRegHours + ":0" + wednesdayRegMinutes;
                wednesdayTotalHoursInput.innerText = wednesdayTotalHours + ":0" + wednesdayTotalMinutes;
            }
            else if(wednesdayRegMinutes < 10) {
                wednesdayRegHoursInput.innerText = wednesdayRegHours + ":0" + wednesdayRegMinutes;
                wednesdayTotalHoursInput.innerText = wednesdayTotalHours + ":" + wednesdayTotalMinutes;
            }
            else {
                wednesdayRegHoursInput.innerText = wednesdayRegHours + ":" + wednesdayRegMinutes;
                wednesdayTotalHoursInput.innerText = wednesdayTotalHours + ":" + wednesdayTotalMinutes;
            }        
        }
        // Thursday
        let thursdayTimeIn = document.getElementById("thursday-time-in").valueAsNumber;
        let thursdayTimeOut = document.getElementById("thursday-time-out").valueAsNumber;
        let thursdayRegHoursInput = document.getElementById("thursday-reg-hours");
        let thursdayVacationHoursInput = parseFloat(document.getElementById("thursday-vacation-hours-input").value);
        let thursdaySickHoursInput = parseFloat(document.getElementById("thursday-sick-hours-input").value);
        let thursdayTotalHoursInput = document.getElementById("thursday-total-hours");
        
        // 60,000ms = 1 minute; 3,600,000ms = 1 hour
        let thursdayRegTime = parseInt(thursdayTimeOut - thursdayTimeIn) || 0;
        let thursdayVacationTime = thursdayVacationHoursInput * 3600000;
        let thursdaySickTime = thursdaySickHoursInput * 3600000; 
        let thursdayRegHours = Math.floor(thursdayRegTime / 3600000);
        let thursdayRegMinutes = thursdayRegTime % 3600000 / 60000;
        let thursdayVacHours = Math.floor(thursdayVacationTime / 3600000);
        let thursdayVacMinutes = thursdayVacationTime % 3600000 / 60000;
        let thursdaySickHours = Math.floor(thursdaySickTime / 3600000);
        let thursdaySickMinutes = thursdaySickTime % 3600000 / 60000;
        let thursdayTotalHours = thursdayRegHours + thursdayVacHours + thursdaySickHours;
        let thursdayTotalMinutes = thursdayRegMinutes + thursdayVacMinutes +thursdaySickMinutes;        
        if(isNaN(thursdayTimeIn) || isNaN(thursdayTimeOut) || thursdayTimeIn > thursdayTimeOut) {
            if(thursdayVacMinutes + thursdaySickMinutes === 0 && thursdayVacHours + thursdaySickHours === 0) {
                thursdayTotalHoursInput.innerText = "0:00";
            }
            else if(thursdayVacMinutes + thursdaySickMinutes < 10) {
                thursdayTotalHoursInput.innerText = Math.floor(thursdayVacHours + thursdaySickHours) + ":0" + Math.floor(thursdayVacMinutes + thursdaySickMinutes);
            }
            else {
                thursdayRegHoursInput.innerText = "0:00";
                thursdayTotalHoursInput.innerText = Math.floor(thursdayVacHours + thursdaySickHours) + ":" + Math.floor(thursdayVacMinutes + thursdaySickMinutes);
            }         
        }
        else {
            if(thursdayRegMinutes < 10 && thursdayTotalMinutes < 10) {
                thursdayRegHoursInput.innerText = thursdayRegHours + ":0" + thursdayRegMinutes;
                thursdayTotalHoursInput.innerText = thursdayTotalHours + ":0" + thursdayTotalMinutes;
            }
            else if(thursdayRegMinutes < 10) {
                thursdayRegHoursInput.innerText = thursdayRegHours + ":0" + thursdayRegMinutes;
                thursdayTotalHoursInput.innerText = thursdayTotalHours + ":" + thursdayTotalMinutes;
            }
            else {
                thursdayRegHoursInput.innerText = thursdayRegHours + ":" + thursdayRegMinutes;
                thursdayTotalHoursInput.innerText = thursdayTotalHours + ":" + thursdayTotalMinutes;
            }        
        }  
        // Friday
        let fridayTimeIn = document.getElementById("friday-time-in").valueAsNumber;
        let fridayTimeOut = document.getElementById("friday-time-out").valueAsNumber;
        let fridayRegHoursInput = document.getElementById("friday-reg-hours");
        let fridayVacationHoursInput = parseFloat(document.getElementById("friday-vacation-hours-input").value);
        let fridaySickHoursInput = parseFloat(document.getElementById("friday-sick-hours-input").value);
        let fridayTotalHoursInput = document.getElementById("friday-total-hours");
        
        // 60,000ms = 1 minute; 3,600,000ms = 1 hour
        let fridayRegTime = parseInt(fridayTimeOut - fridayTimeIn) || 0;
        let fridayVacationTime = fridayVacationHoursInput * 3600000;
        let fridaySickTime = fridaySickHoursInput * 3600000; 
        let fridayRegHours = Math.floor(fridayRegTime / 3600000);
        let fridayRegMinutes = fridayRegTime % 3600000 / 60000;
        let fridayVacHours = Math.floor(fridayVacationTime / 3600000);
        let fridayVacMinutes = fridayVacationTime % 3600000 / 60000;
        let fridaySickHours = Math.floor(fridaySickTime / 3600000);
        let fridaySickMinutes = fridaySickTime % 3600000 / 60000;
        let fridayTotalHours = fridayRegHours + fridayVacHours + fridaySickHours;
        let fridayTotalMinutes = fridayRegMinutes + fridayVacMinutes + fridaySickMinutes;        
        if(isNaN(fridayTimeIn) || isNaN(fridayTimeOut) || fridayTimeIn > fridayTimeOut) {
            if(fridayVacMinutes + fridaySickMinutes === 0 && fridayVacHours + fridaySickHours === 0) {
                fridayTotalHoursInput.innerText = "0:00";
            }
            else if(fridayVacMinutes + fridaySickMinutes < 10) {
                fridayTotalHoursInput.innerText = Math.floor(fridayVacHours + fridaySickHours) + ":0" + Math.floor(fridayVacMinutes + fridaySickMinutes);
            }
            else {
                fridayRegHoursInput.innerText = "0:00";
                fridayTotalHoursInput.innerText = Math.floor(fridayVacHours + fridaySickHours) + ":" + Math.floor(fridayVacMinutes + fridaySickMinutes);
            }         
        }
        else {
            if(fridayRegMinutes < 10 && fridayTotalMinutes < 10) {
                fridayRegHoursInput.innerText = fridayRegHours + ":0" + fridayRegMinutes;
                fridayTotalHoursInput.innerText = fridayTotalHours + ":0" + fridayTotalMinutes;
            }
            else if(fridayRegMinutes < 10) {
                fridayRegHoursInput.innerText = fridayRegHours + ":0" + fridayRegMinutes;
                fridayTotalHoursInput.innerText = fridayTotalHours + ":" + fridayTotalMinutes;
            }
            else {
                fridayRegHoursInput.innerText = fridayRegHours + ":" + fridayRegMinutes;
                fridayTotalHoursInput.innerText = fridayTotalHours + ":" + fridayTotalMinutes;
            }        
        }
        findTotalRegHours(mondayRegTime, tuesdayRegTime, wednesdayRegTime, thursdayRegTime, fridayRegTime);      
        findTotalVacHours(mondayVacationTime, tuesdayVacationTime, wednesdayVacationTime, thursdayVacationTime, fridayVacationTime);
        findTotalSickHours(mondaySickTime, tuesdaySickTime, wednesdaySickTime, thursdaySickTime, fridaySickTime);
        let totalTime = mondayRegTime + mondaySickTime + mondayVacationTime + tuesdayRegTime + tuesdaySickTime + tuesdayVacationTime + wednesdayRegTime + wednesdaySickTime + wednesdayVacationTime + thursdayRegTime + thursdaySickTime + thursdayVacationTime + fridayRegTime + fridaySickTime + fridayVacationTime;
        findTotalWeeklyHours(totalTime);
    }

    const findTotalRegHours = (mondayRegTime, tuesdayRegTime, wednesdayRegTime, thursdayRegTime, fridayRegTime) => {
        let weeklyRegTime = (mondayRegTime || 0) + (tuesdayRegTime || 0) + (wednesdayRegTime || 0) + (thursdayRegTime || 0) + (fridayRegTime || 0);
        let weeklyRegHours = Math.floor(weeklyRegTime / 3600000);
        let weeklyRegMinutes = (weeklyRegTime % 3600000) / 60000
        let totalRegHoursDisplay = document.getElementsByClassName("reg-hours-total")[0];
        weeklyRegMinutes < 10 ? totalRegHoursDisplay.innerText = weeklyRegHours + ":0" + weeklyRegMinutes : totalRegHoursDisplay.innerText = weeklyRegHours + ":" + weeklyRegMinutes;
    }

    const findTotalVacHours = (mondayVacationTime, tuesdayVacationTime, wednesdayVacationTime, thursdayVacationTime, fridayVacationTime) => {
        let weeklyVacTime = mondayVacationTime + tuesdayVacationTime + wednesdayVacationTime + thursdayVacationTime + fridayVacationTime;
        let weeklyVacHours = Math.floor(weeklyVacTime / 3600000);
        let weeklyVacMinutes = (weeklyVacTime % 3600000) / 60000;
        let totalVacHoursDisplay = document.getElementsByClassName("vacation-hours-total")[0];
        weeklyVacMinutes < 10 ? totalVacHoursDisplay.innerText = weeklyVacHours + ":0" + weeklyVacMinutes : totalVacHoursDisplay.innerText = weeklyVacHours + ":" + weeklyVacMinutes;
    }

    const findTotalSickHours = (mondaySickTime, tuesdaySickTime, wednesdaySickTime, thursdaySickTime, fridaySickTime) => {
        let weeklySickTime = mondaySickTime + tuesdaySickTime + wednesdaySickTime + thursdaySickTime + fridaySickTime;
        let weeklySickHours = Math.floor(weeklySickTime / 3600000);
        let weeklySickMinutes = (weeklySickTime % 3600000) / 60000;
        let totalSickHoursDisplay = document.getElementsByClassName("sick-hours-total")[0];
        weeklySickMinutes < 10 ? totalSickHoursDisplay.innerText = weeklySickHours + ":0" + weeklySickMinutes : totalSickHoursDisplay.innerText = weeklySickHours + ":" + weeklySickMinutes;
    }

    const findTotalWeeklyHours = (totalTime) => {
        let totalWeeklyHours = Math.floor((totalTime) / 3600000);
        let totalWeeklyMinutes = ((totalTime % 3600000) / 60000)
        let totalHoursDisplay = document.getElementsByClassName("total-hours-total")[0];
        totalWeeklyMinutes < 10 ? totalHoursDisplay.innerText = totalWeeklyHours + ":0" + totalWeeklyMinutes : totalHoursDisplay.innerText = totalWeeklyHours + ":" + totalWeeklyMinutes;
    }

    let vacHoursReqInput = document.getElementsByClassName("vacation-hours-requested");
    for(let i = 0; i < vacHoursReqInput.length; i++) {
        vacHoursReqInput[i].addEventListener("change", () => {
            getTotalVacationHours();
        })
    }

    let sickHoursReqInput = document.getElementsByClassName("sick-hours-requested");
    for(let i = 0; i < sickHoursReqInput.length; i++) {
        sickHoursReqInput[i].addEventListener("change", () => {
            getTotalSickHours();
        })
    }

    const getTotalVacationHours = (e) => {
        const vacationHoursRequested = document.getElementsByClassName("vacation-hours-requested");
        const vacationHoursRemaining = document.getElementById("vacation-hours-remaining");
        const vacationPie = document.getElementById("vacation-pie");
        let totalVacationHoursRequested = 0;
        for(let i = 0; i < vacationHoursRequested.length; i++) {
            let vacationHoursValue = parseFloat(vacationHoursRequested[i].value);
            totalVacationHoursRequested += vacationHoursValue;
        }
        let newHours = parseFloat(vacationHours - totalVacationHoursRequested);
        vacationHoursRemaining.innerText = newHours;
        vacationPie.style.setProperty("--p", newHours * 1.25);
    }

    const getTotalSickHours = (e) => {
        const sickHoursRequested = document.getElementsByClassName("sick-hours-requested");
        const sickHoursRemaining = document.getElementById("sick-hours-remaining");
        const sickPie = document.getElementById("sick-pie");
        let totalSickHoursRequested = 0;
        for(let i = 0; i < sickHoursRequested.length; i++) {
            let sickHoursValue = parseFloat(sickHoursRequested[i].value);
            totalSickHoursRequested += sickHoursValue;
        }
        let newHours = parseFloat(sickHours - totalSickHoursRequested);
        sickHoursRemaining.innerText = newHours;
        sickPie.style.setProperty("--p", newHours * 4.17);
    }

    const resetInputValues = () => {
        document.getElementById("monday-time-in").value = "";
        document.getElementById("monday-time-out").value = "";
        document.getElementById("tuesday-time-in").value = "";
        document.getElementById("tuesday-time-out").value = "";
        document.getElementById("wednesday-time-in").value = "";
        document.getElementById("wednesday-time-out").value = "";
        document.getElementById("thursday-time-in").value = "";
        document.getElementById("thursday-time-out").value = "";
        document.getElementById("friday-time-in").value = "";
        document.getElementById("friday-time-out").value = "";
        let regHoursField = document.getElementsByClassName("reg-hours");
        for(let i = 0; i < regHoursField.length; i++) {
            regHoursField[i].innerText = "0:00";
        }
        document.getElementsByClassName("reg-hours-total")[0].innerText = "0:00";
    }

    const mobileHeaderSelection = document.getElementsByClassName("mobile-header-selection");
    const mobileContainer = document.getElementsByClassName("mobile-container");
    const handleSelection = (e) => {
        for(let i = 0; i < mobileHeaderSelection.length; i++) {
            let selectedMenu = e.target.classList[1];           
            if(!mobileHeaderSelection[i].classList.contains("active") && mobileHeaderSelection[i].classList.contains(selectedMenu)) {
                mobileHeaderSelection[i].classList.add("active");
            }
            else if(mobileHeaderSelection[i].classList.contains("active") && mobileHeaderSelection[i].classList.contains(selectedMenu)) {
                continue;
            }
            else {
                mobileHeaderSelection[i].classList.remove("active");
            }
        }
        for(let i = 0; i < mobileContainer.length; i++) {
            mobileContainer[i].classList.remove("selected");
        }
        for(let i = 0; i < mobileHeaderSelection.length; i++) {
            if(mobileHeaderSelection[i].classList.contains("active")) {
                let selectedDataset = mobileHeaderSelection[i].dataset.page;
                
                document.getElementById(selectedDataset).classList.add("selected");
            }
        }
    }

    for(let i = 0; i < mobileHeaderSelection.length; i++) {
        mobileHeaderSelection[i].addEventListener("click", handleSelection);
    }

    let mobileRequestVacationBtn = document.getElementById("mobile-vacation-request-btn");
    if(mobileRequestVacationBtn) {
        let totalVacHoursToUse = document.getElementsByClassName("mobile-vacation-used-block")[0].innerText;
        console.log(totalVacHoursToUse);
        mobileRequestVacationBtn.addEventListener("click", () => {
            fetch(`${api}/portal/vacation-leave`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "email": email,
                    "vacation-hours": totalVacHoursToUse
                }
            })
            .then(response => {
                return response.json();
            })
            .then(data => {
                setVacationHours(data);
                document.getElementsByClassName("mobile-vacation-used-block")[0].innerText = 0;
                adjustVacationPie();
                return data;
            })
        })
    }
    
          
    let mobileVacationHoursToUse = 0;
    let mobileVacationHoursRemaining;    
    const addMobileVacationHours = () => {
        const mobileVacationPlusBtn = document.getElementsByClassName("vac-plus-btn")[0];
        const mobileVacationUsedBlock = document.getElementsByClassName("mobile-vacation-used-block")[0];
        const mobileVacationRemainingBlock = document.getElementsByClassName("mobile-vacation-remaining-block")[0];
        mobileVacationRemainingBlock.innerText = mobileVacationHoursRemaining;
        mobileVacationPlusBtn.addEventListener("click", (e) => {
            fetch(`${api}/login/vacation`, {
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
                setVacationHours(data);
                adjustVacationPie();
                mobileVacationHoursRemaining = data;
                if(mobileVacationHoursToUse < 8) {
                    mobileVacationHoursToUse ++;
                    mobileVacationUsedBlock.innerText = mobileVacationHoursToUse;
                    mobileVacationRemainingBlock.innerText = mobileVacationHoursRemaining - mobileVacationHoursToUse;                
                }
                else {
                    alert("Unable to use more than 8 hours");
                }
            })            
        })
    }
    
    const subtractMobileVacationHours = () => {
        const mobileVacationMinusBtn = document.getElementsByClassName("vac-minus-btn")[0];
        const mobileVacationUsedBlock = document.getElementsByClassName("mobile-vacation-used-block")[0];
        const mobileVacationRemainingBlock = document.getElementsByClassName("mobile-vacation-remaining-block")[0];
        let mobileVacationHoursRemaining;
        mobileVacationMinusBtn.addEventListener("click", (e) => {
            fetch(`${api}/login/vacation`, {
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
                setVacationHours(data);
                adjustVacationPie();
                mobileVacationHoursRemaining = data;
                if(mobileVacationHoursToUse > 0) {
                    mobileVacationHoursToUse --;
                    mobileVacationUsedBlock.innerText = mobileVacationHoursToUse;
                    mobileVacationRemainingBlock.innerText = mobileVacationHoursRemaining - mobileVacationHoursToUse;
                }
                else {
                    alert("Cannot use less than 0 hours");
                }      
            })      
        })
    }
    

    return (
        <>
            <div className="portal">
                <main id="portal-main">

                    <div className="portal-profile">
                        <h3>My Profile</h3>                    
                        <div className="user-icon-background">
                            <FontAwesomeIcon icon={faUser} />
                        </div>                    
                        <h2>{`${ employee.firstName } ${ employee.lastName }` || "Line 656 Portal.js: name"}</h2>
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
                                    <h2 id="sick-hours-remaining">{sickHours}</h2>
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
                                        <input onChange={calculateTime} id="monday-time-out" type="time"></input>
                                    </div>
                                    <div className="monday-row-one-reg-hours">
                                        <div className="">
                                            <p id="monday-reg-hours" className="reg-hours">0:00</p>
                                        </div>    
                                    </div>
                                    <div className="monday-row-one-vacation-hours">
                                        <div className="">
                                            <input onChange={e => {checkVacationHoursInput(e); calculateTime(); adjustVacationPie() }} step="any" type="number" id="monday-vacation-hours-input" className="vacation-hours-requested" defaultValue={0}></input>
                                        </div>
                                    </div>
                                    <div className="monday-row-one-sick-hours">                                    
                                        <div className="">
                                            <input onChange={e => {checkSickHoursInput(e); calculateTime(); adjustSickPie() }} step="any" type="number" id="monday-sick-hours-input" className="sick-hours-requested" name="" defaultValue={0}></input>
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
                                        <input onChange={calculateTime} id="tuesday-time-in" type="time"></input>
                                    </div>
                                    <div className="tuesday-row-one-out">
                                        <input onChange={calculateTime} id="tuesday-time-out" type="time"></input>
                                    </div>
                                    <div className="tuesday-row-one-reg-hours">
                                        <div className="">
                                        <p id="tuesday-reg-hours" className="reg-hours">0:00</p>
                                        </div>    
                                    </div>
                                    <div className="tuesday-row-one-vacation-hours">
                                        <div className="">
                                            <input type="number" onChange={e => {checkVacationHoursInput(e); calculateTime(); adjustVacationPie() }} id="tuesday-vacation-hours-input" className="vacation-hours-requested" step="any" defaultValue={0}></input>
                                        </div>
                                    </div>
                                    <div className="tuesday-row-one-sick-hours">                                    
                                        <div className="">
                                            <input onChange={e => {checkSickHoursInput(e); calculateTime(); adjustSickPie() }} type="number" id="tuesday-sick-hours-input" className="sick-hours-requested" step="any" name="" defaultValue={0}></input>
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
                                        <input id="wednesday-time-in" onChange={calculateTime} type="time"></input>
                                    </div>
                                    <div className="wednesday-row-one-out">
                                        <input id="wednesday-time-out" onChange={calculateTime} type="time"></input>
                                    </div>
                                    <div className="wednesday-row-one-reg-hours">
                                        <div className="">
                                            <p id="wednesday-reg-hours" className="reg-hours">0:00</p>
                                        </div>    
                                    </div>
                                    <div className="wednesday-row-one-vacation-hours">
                                        <div className="">
                                            <input type="number" id="wednesday-vacation-hours-input" onChange={e => {checkVacationHoursInput(e); calculateTime(); adjustVacationPie() }} className="vacation-hours-requested" step="any" defaultValue={0}></input>
                                        </div>
                                    </div>
                                    <div className="wednesday-row-one-sick-hours">                                    
                                        <div className="">
                                            <input onChange={(e) => {checkSickHoursInput(e); calculateTime()}} type="number" id="wednesday-sick-hours-input" className="sick-hours-requested" step="any" name="" defaultValue={0}></input>
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
                                        <input id="thursday-time-in" onChange={calculateTime} type="time"></input>
                                    </div>
                                    <div className="thursday-row-one-out">
                                        <input id="thursday-time-out" onChange={calculateTime} type="time"></input>
                                    </div>
                                    <div className="thursday-row-one-reg-hours">
                                        <div className="">
                                            <p id="thursday-reg-hours" className="reg-hours">0:00</p>
                                        </div>    
                                    </div>
                                    <div className="thursday-row-one-vacation-hours">
                                        <div className="">
                                            <input type="number" id="thursday-vacation-hours-input" onChange={e => {checkVacationHoursInput(e); calculateTime(); adjustVacationPie() }} className="vacation-hours-requested" step="any" defaultValue={0}></input>
                                        </div>
                                    </div>
                                    <div className="thursday-row-one-sick-hours">                                    
                                        <div className="">
                                            <input type="number" id="thursday-sick-hours-input" onChange={e => {checkSickHoursInput(e); calculateTime(); adjustSickPie() }} className="sick-hours-requested" step="any" defaultValue={0}></input>
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
                                        <input id="friday-time-in" onChange={calculateTime} type="time"></input>
                                    </div>
                                    <div className="friday-row-one-out">
                                        <input id="friday-time-out" onChange={calculateTime} type="time"></input>
                                    </div>
                                    <div className="friday-row-one-reg-hours">
                                        <div className="">
                                            <p id="friday-reg-hours" className="reg-hours">0:00</p>
                                        </div>    
                                    </div>
                                    <div className="friday-row-one-vacation-hours">
                                        <div className="">
                                            <input type="number" id="friday-vacation-hours-input" onChange={e => {checkVacationHoursInput(e); calculateTime(); adjustVacationPie() }} className="vacation-hours-requested" step="any" defaultValue={0}></input>
                                        </div>
                                    </div>
                                    <div className="friday-row-one-sick-hours">                                    
                                        <div className="">
                                            <input onChange={e => {checkSickHoursInput(e); calculateTime(); adjustSickPie() }} type="number" id="friday-sick-hours-input" className="sick-hours-requested" step="any" defaultValue={0}></input>
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
                                <div className="submit-btn-container">
                                    {/* <button onClick={e => {spendVacationHours(e); spendSickHours(e); getCurrentWeek() }} id="time-card-submit-btn">Submit for Approval</button> */}
                                    <button onClick={(e) => {adjustVacationSickHours(); getTotalVacationHours(); getTotalSickHours(); resetInputValues()}} id="time-card-submit-btn">Submit for Approval</button>
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
            <div className="mobile-portal">
                <div className="mobile-header hidden">
                    <div className="mobile-header-selection-container">
                        <div data-page="time-sheet-page" className="mobile-header-selection mobile-time-sheet active">Time Sheet</div>
                        <div data-page="vacation-page" className="mobile-header-selection mobile-vacation">Vacation</div>
                        <div data-page="sick-leave-page" className="mobile-header-selection mobile-sick-leave">Sick Leave</div>                       
                    </div>
                </div>
            </div>
            <div className="mobile-body">
                <div id="time-sheet-page" className="time-sheet-mobile-body mobile-container selected">
                    <section id="mobile-time-sheet-row-1">
                        <div className="mobile-time-sheet-greeting-section">
                            <div className="mobile-time-sheet-greet-title">
                                <h2>Welcome,</h2>
                            </div>
                                                                    
                            <div className="mobile-user-icon-background">
                                <FontAwesomeIcon icon={faUser} />
                            </div>
                            <div className="time-sheet-row-1-lower-row">
                                <div className="oval-image-one">
                                    <div className="mobile-building-user-image">
                                        <FontAwesomeIcon icon={faBuildingUser} />
                                    </div>
                                    <div className="oval oval-one"></div>
                                </div>
                                <div className="oval-image-two">
                                    <div className="mobile-business-time-image">
                                        <FontAwesomeIcon icon={faBusinessTime} />
                                    </div>
                                    <div className="oval oval-two"></div>
                                </div>
                                <div className="oval-image-three">
                                    <div className="mobile-building-user-image">
                                        <FontAwesomeIcon icon={faBuildingUser} />
                                    </div>
                                    <div className="oval oval-three"></div>
                                </div>
                                <div className="oval-image-four">
                                    <div className="mobile-business-time-image">
                                        <FontAwesomeIcon icon={faBusinessTime} />
                                    </div>
                                    <div className="oval oval-four"></div>
                                </div>
                            </div>  
                        </div>
                    </section>
                    <section id="time-sheet-row-2">
                        <div className="time-sheet-row-2-container">
                            <div className="mobile-time-sheet-banner">
                                <p>Pay Detail</p>
                            </div>
                            
                            <div className="take-home-main-section-row-1-col-1">
                                <div id="take-home-pie">
                                    <div id="take-home-pie-background"></div>
                                    {/* Add white border to take-home-pie */}
                                    <div id="take-home-pie-foreground-left"></div>
                                    <div id="take-home-pie-foreground-right"></div>
                                    {/* ******************************* */}
                                </div>                            
                            </div>
                            <div className="take-home-main-section-row-1-col-2">
                                <div className="mobile-take-home-p">
                                    <p>Take Home</p>
                                    <p className="row-1-text-lg">$4,587.00</p>
                                </div>
                                <div className="mobile-deduction-p">
                                    <p>Deduction</p>
                                    <p className="row-1-text-lg">$1,233.00</p>
                                </div>
                            </div>
                            <div className="take-home-main-section-row-3-banner">

                            </div>
                            
                        </div>
                    </section>
                    <section id="mobile-time-sheet-row-3">
                        <div className="time-sheet-row-3-container">
                            <p className="time-sheet-earnings-heading">Earnings</p>
                            <div className="row-3-underline"></div>
                            <div className="time-sheet-row-3-col-1">
                                <p>Basic Pay</p>
                                <p>Overtime</p>
                                <p>Sick Pay</p>
                                <p>Vacation Pay</p>
                                <p>Other</p>
                                <p>Total Gross Pay</p>
                            </div>
                            <div className="time-sheet-row-3-col-2">
                                <p>$6,500.00</p>
                                <p>$0.00</p>
                                <p>$0.00</p>
                                <p>$0.00</p>
                                <p>$0.00</p>
                                <p>$6,500.00</p>
                            </div>
                        </div>
                    </section>
                    <section id="mobile-time-sheet-row-4">
                        <div className="time-sheet-row-4-container">
                            <div className="time-sheet-deductions-heading">
                                <p>Deductions</p>
                            </div>
                            <div className="time-sheet-deductions-heading-underline"></div>
                            <div className="time-sheet-deductions-list">
                                <p>Fed Income Tax</p>
                                <p>Social Security</p>
                                <p>Medicare</p>
                            </div>
                            <div className="time-sheet-deductions-amounts">
                                <p>$503.45</p>
                                <p>$409.12</p>
                                <p>$114.85</p>
                            </div>
                        </div>
                    </section>
                </div>
                <div id="vacation-page" className="vacation-mobile-body mobile-container">
                    <section id="mobile-row-1">
                        <div className="mobile-vacation-greeting-section">
                            <div className="mobile-vacation-greet-title">
                                <h2>Welcome,</h2>
                            </div>
                                                                    
                            <div className="mobile-user-icon-background">
                                <FontAwesomeIcon icon={faUser} />
                            </div>
                            <div className="vacation-row-1-lower-row">
                                <div className="oval-image-one">
                                    <div className="mobile-person-walking-image">
                                        <FontAwesomeIcon icon={faPersonWalkingLuggage} />
                                    </div>
                                    <div className="oval oval-one"></div>
                                </div>
                                <div className="oval-image-two">
                                    <div className="mobile-beach-umbrella-image">
                                        <FontAwesomeIcon icon={faUmbrellaBeach} />
                                    </div>
                                    <div className="oval oval-two"></div>
                                </div>
                                <div className="oval-image-three">
                                    <div className="mobile-person-walking-image">
                                        <FontAwesomeIcon icon={faPersonWalkingLuggage} />
                                    </div>
                                    <div className="oval oval-three"></div>
                                </div>
                                <div className="oval-image-four">
                                    <div className="mobile-beach-umbrella-image">
                                        <FontAwesomeIcon icon={faUmbrellaBeach} />
                                    </div>
                                    <div className="oval oval-four"></div>
                                </div>
                            </div>  
                        </div>
                    </section>
                    <section id="vacation-row-2">
                        <div className="mobile-vacation-leave-section">
                            <div className="annual-leave-banner">
                                <p>Annual Leave</p>
                            </div>
                            <div className="mobile-vacation-remaining-container">
                                <div className="mobile-vacation-block mobile-vacation-remaining-block">{vacationHours}</div>
                                <p>Vacation Remaining</p>
                            </div>
                            <div className="mobile-vacation-spacer-container">
                                <div className="mobile-vacation-block"></div>
                            </div>
                            <div className="mobile-vacation-used-container">
                                <div className="mobile-vacation-block mobile-vacation-used-block">0</div>
                                <p>Vacation Used</p>
                            </div>
                            <div className="mobile-vacation-pie-container">
                                <div className="portal-vacation-leave">
                                    <div id="vacation-pie">
                                        <div id="vacation-pie-background"></div>
                                    </div>                            
                                </div>
                                <div className="vacation-pie-hours">
                                    <p className="mobile-vacation-pie-hours-text">{vacationHours}</p>
                                </div>
                            </div>
                            <div className="mobile-vacation-request-btn-container">
                                <button id="mobile-vacation-request-btn">Request Vacation</button>
                            </div>
                            
                        </div>
                    </section>
                    <section id="vacation-row-three">
                        <div className="mobile-vacation-add-remove-section">
                            <div className="add-remove-banner">

                            </div>
                            <div className="add-remove-vacation-text">
                                <p>Add / Remove Vacation Hours</p>
                            </div>
                            
                            <div className="vac-plus-btn">
                                <h3>Add</h3>
                                <FontAwesomeIcon icon={faPlusCircle} />
                            </div>
                            <div className="vac-minus-btn">
                                <h3>Remove</h3>
                                <FontAwesomeIcon icon={faMinusCircle} />
                            </div>          
                        </div>
                    </section>
                    <section id="vacation-row-four">
                        <div className="mobile-vacation-company-section">
                            <div className="company-section-banner">

                            </div>
                            <div className="company-section-pictures">
                                <div className="company-section-picture-1">
                                    <img src="/images/hr-pic01.jpeg"></img>
                                </div> 
                                <div className="company-section-picture-2">
                                    <img src="/images/hr-pic02.jpg"></img>
                                </div>                               
                            </div>
                            <div className="company-section-boxes">
                                <div className="left-box"></div>
                                <div className="right-box"></div>
                                <div className="left-box"></div>
                                <div className="right-box"></div>
                            </div>
                        </div>
                    </section>                 
                </div>
                <div id="sick-leave-page" className="sick-leave-mobile-body mobile-container">
                    <section id="sick-row-1">
                        <div className="mobile-sick-greeting-section">
                            <div className="mobile-sick-greet-title">
                                <h2>Welcome,</h2>
                            </div>
                                                                    
                            <div className="mobile-user-icon-background">
                                <FontAwesomeIcon icon={faUser} />
                            </div>
                            <div className="sick-row-1-lower-row">
                                <div className="oval-image-one">
                                    <div className="mobile-notes-medical-image">
                                        <FontAwesomeIcon icon={faNotesMedical} />
                                    </div>
                                    <div className="oval oval-one"></div>
                                </div>
                                <div className="oval-image-two">
                                    <div className="mobile-syringe-image">
                                        <FontAwesomeIcon icon={faSyringe} />
                                    </div>
                                    <div className="oval oval-two"></div>
                                </div>
                                <div className="oval-image-three">
                                    <div className="mobile-notes-medical-image">
                                        <FontAwesomeIcon icon={faNotesMedical} />
                                    </div>
                                    <div className="oval oval-three"></div>
                                </div>
                                <div className="oval-image-four">
                                    <div className="mobile-syringe-image">
                                        <FontAwesomeIcon icon={faSyringe} />
                                    </div>
                                    <div className="oval oval-four"></div>
                                </div>
                            </div>  
                        </div>
                    </section>
                    <section id="sick-row-2">
                        <div className="mobile-sick-leave-section">
                            <div className="sick-leave-banner">
                                <p>Sick Leave</p>
                            </div>
                            <div className="mobile-vacation-remaining-container">
                                <div className="mobile-vacation-block mobile-vacation-remaining-block">16.0</div>
                                <p>Sick Hours Remaining</p>
                            </div>
                            <div className="mobile-vacation-spacer-container">
                                <div className="mobile-vacation-block"></div>
                            </div>
                            <div className="mobile-vacation-used-container">
                                <div className="mobile-vacation-block mobile-vacation-used-block">8.0</div>
                                <p>Sick Hours Used</p>
                            </div>
                            <div className="mobile-vacation-pie-container">
                                <div className="portal-vacation-leave">
                                    <div id="vacation-pie">
                                        <div id="vacation-pie-background"></div>
                                    </div>                            
                                </div>
                                <div className="vacation-pie-hours">
                                    <p>16.0</p>
                                </div>
                            </div>
                            <div className="mobile-vacation-request-btn-container">
                                <button id="mobile-sick-request-btn">Apply Sick Leave</button>
                            </div>
                            
                        </div>
                    </section>
                    <section id="sick-row-three">
                        <div className="mobile-vacation-add-remove-section">
                            <div className="add-remove-banner">

                            </div>
                            <div className="add-remove-vacation-text">
                                <p>Add / Remove Sick Hours</p>
                            </div>
                            
                            <div className="vac-plus-btn">
                                <h3>Add</h3>
                                <FontAwesomeIcon icon={faPlusCircle} />
                            </div>
                            <div className="vac-minus-btn">
                                <h3>Remove</h3>
                                <FontAwesomeIcon icon={faMinusCircle} />
                            </div>          
                        </div>
                    </section>
                    <section id="sick-row-four">
                        <div className="mobile-vacation-company-section">
                            <div className="company-section-banner">

                            </div>
                            <div className="company-section-pictures">
                                <div className="company-section-picture-1">
                                    <img src="/images/hr-pic01.jpeg"></img>
                                </div> 
                                <div className="company-section-picture-2">
                                    <img src="/images/hr-pic02.jpg"></img>
                                </div>                               
                            </div>
                            <div className="company-section-boxes">
                                <div className="left-box"></div>
                                <div className="right-box"></div>
                                <div className="left-box"></div>
                                <div className="right-box"></div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>


            {/* <div className="portal-vacation-leave">
                                <div id="vacation-pie">
                                    <div id="vacation-pie-background"></div>
                                </div>                            
                            </div>
                        <div className="hours-left">
                            <h2 id="vacation-hours-remaining">{vacationHours}</h2>
                            <p>hours remaining</p>
                        </div>
                        <div className="vacation-leave-title">
                            <h4>Vacation Leave</h4>
                        </div>                   
                        <div className="vac-plus-btn">
                            <h3>Add</h3>
                            <FontAwesomeIcon icon={faPlusCircle} />
                        </div>
                        <div className="vac-minus-btn">
                            <h3>Remove</h3>
                            <FontAwesomeIcon icon={faMinusCircle} />
                        </div>                           
                        <div className="person-walking-image">
                            <FontAwesomeIcon icon={faPersonWalkingLuggage} />
                        </div>
                        <div className="beach-umbrella-image">
                            <FontAwesomeIcon icon={faUmbrellaBeach} />
                        </div>
                        <div className="mobile-vacation-hours-selected-display">
                            <p id="mobile-vacation-hours-display">0</p>
                        </div>
                        <div className="mobile-vacation-submit-btn">
                            <button id="mobile-vacation-submit-btn">Submit</button>
                        </div>                                                                     */}





        </>
    )
}

export default Portal;