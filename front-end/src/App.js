import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import Portal from "./pages/Portal.js";
import NotFound from "./pages/NotFound.js";
import "./App.css";

function App() {
  const api = `http://localhost:8080/api/employees`
  const [login, setLogin] = useState(false);  
  

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
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userLoginInfo) 
      })
      .then(response => {
        return response;
      })
      .then(data => {
        if(data.status !== 200) {
          setLogin(false)
          return data;
        }
        else {
          setLogin(true);
          return data;
        }
      })
    }
    catch(err) {
      console.log(err);
    }
    
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
          <Route path="/" element={ <Login login={login} setLogin={setLogin} authenticateEmployee={authenticateEmployee} /> }></Route>
          <Route path="/register" element={ <Register login={login} createEmployee={createEmployee} /> }></Route>
          <Route path="/portal" element={ <Portal login={login} setLogin={setLogin} /> }></Route>
          <Route path="*" element={ <NotFound /> }></Route>
        </Routes>
      </BrowserRouter>

    </div>
          
    </>
  )
}

export default App;