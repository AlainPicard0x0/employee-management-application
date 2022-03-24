import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header.js";
import Home from "./pages/Home.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import Portal from "./pages/Portal.js";
import NotFound from "./pages/NotFound.js";
import "./App.css";

function App() {
  const [login, setLogin] = useState(false);  

  // need to add parameter here to take in new employee
  const createEmployee = async () => {
    const api = `http://localhost:8080/api/employees`  
    let newEmployee = {
      "firstName": "Evan",
      "lastName": "Picard",
      "email": "evan@gmail",
      "password": "password"
    }  
    try {
      fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmployee)
      })
      .then(response => {
        return response;
      })
      .then(data => {
        return console.log("Success: " + data)
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
          <Route path="/" element={ <Home /> } exact></Route>
          <Route path="/login" element={ <Login login={login} setLogin={setLogin} createEmployee={createEmployee} /> }></Route>
          <Route path="/register" element={ <Register login={login} /> }></Route>
          <Route path="/portal" element={ <Portal login={login} setLogin={setLogin} /> }></Route>
          <Route path="*" element={ <NotFound /> }></Route>
        </Routes>
      </BrowserRouter>

    </div>
          
    </>
  )
}

export default App;