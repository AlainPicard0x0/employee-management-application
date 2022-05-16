import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import Portal from "./pages/Portal.js";
import NotFound from "./pages/NotFound.js";
import MobileVacation from "./pages/MobileVacation.js";
import MobileTimeSheet from "./pages/MobileTimeSheet.js";
import MobileSickLeave from "./pages/MobileSickLeave.js";
import "./App.css";

function App() {
  const api = `http://localhost:8080/api/employees`
  const [login, setLogin] = useState(false);
  const [email, setEmail] = useState(null);  
  const [employee, setEmployee] = useState();
  

  const createEmployee = async (firstName, lastName, email, password) => {
    let newEmployee = {
      "firstName": firstName,
      "lastName": lastName,
      "email": email,
      "password": password
    }  
    try {
      await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmployee)
      })
      .then(response => {
        // return response.json() causes error in browser [unexpected token in json response]
        return response;
      })
      .then(data => {
        return console.log("Success: " + data);
      })
    }
    catch(err) {
      console.log("Error: " + err);
    }
  }

  const authenticateEmployee = async (email, password) => {
    let userLoginInfo = {
      "email": email,
      "password": password
    }
    try {
      await fetch(`${api}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "email": email
        },
        body: JSON.stringify(userLoginInfo) 
      })
      .then(response => {
        console.log(response.status);
        if(response.status !== 200) {          
          alert("Username or Password is Incorrect");
        }
        return response.json();
      })
      .then(data => {       
        setEmail(email);
        setLogin(true);
        setEmployee(data);
        return data;
      })      
    }
    catch(err) {
      console.log(err);
    }
    
  }

  const getEmployee = async (api, id) => {
    fetch(`${api}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => {
      return response.json();
    })
    .then(data => {
      return data;
    })
    .catch((error) => {
      console.log(error);
    })
  }

  const deleteEmployee = async (employeeId) => {
    try {
      fetch(`${api}${employeeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
      })
      .then(response => {
        return response;
      })
    }
    catch(err) {
      console.log("Error: " + err);
    }
    
  }
  
  return (
    <>
    <div className="App">
      <BrowserRouter>
        < Header />
        <Routes>
          <Route path="/" element={ <Login login={login} authenticateEmployee={authenticateEmployee} /> }></Route>
          <Route path="/register" element={ <Register login={login} createEmployee={createEmployee} /> }></Route>
          <Route path="/portal" element={ <Portal email={email} login={login} setLogin={setLogin} getEmployee={getEmployee} employee={employee} /> }></Route>
          <Route path="*" element={ <NotFound /> }></Route>
        </Routes>
      </BrowserRouter>
      < Footer />
    </div>
          
    </>
  )
}

export default App;