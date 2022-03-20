import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header.js";
import Home from "./pages/Home.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import Portal from "./pages/Portal.js";
import "./App.css";

function App() {
  return (
    <>
    <div className="App">
      <BrowserRouter>
        < Header />
        <Routes>
          <Route path="/" element={ <Home /> } exact></Route>
          <Route path="/login" element={ <Login /> }></Route>
          <Route path="/register" element={ <Register /> }></Route>
          <Route path="/portal" element={ <Portal /> }></Route>
        </Routes>
      </BrowserRouter>

    </div>
          
    </>
  )
}

export default App;