import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({login, setLogin, authenticateEmployee }) => {    

    const navigate = useNavigate();

    useEffect(() => {
        if(login) {
            console.log(login)
            navigate("/portal");
        }
        else {
            navigate("/");
        }
    }, [login, navigate])


    async function handleSubmit(e) {
        e.preventDefault();
        // const userInputEmployeeId = document.getElementById("employeeId");
        // const employeeId = userInputEmployeeId.value;
        const userInputEmail = document.getElementById("email");
        const userInputPassword = document.getElementById("password");
        let email = userInputEmail.value;
        let password = userInputPassword.value;
        // authenticateEmployee(employeeId);
        console.log(email + " " + password);
        authenticateEmployee(email, password);
        userInputEmail.value = "";
        userInputPassword.value = "";   
    }

    return (
        <div className="login">
            <div className="login-form-container">
                <div className="login-col-left">
                    <div className="login-form-header">
                        <h2>Login</h2>
                        <p>Don't have an account yet? <a href="./register">Sign Up</a></p>
                    </div>
                    <form className="login-form" onSubmit={ handleSubmit }>
                        {/* <div className="form-group">
                            <label htmlFor="employeeId">Employee Id</label>
                            <input id="employeeId" type="number" placeholder="Enter Employee Id" required></input>
                        </div> */}
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input id="email" type="text" placeholder="Enter Email" name="email" required></input>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input id="password" type="password" placeholder="Enter Password" name="password" required></input>
                        </div>
                        <div className="form-group">
                            <button id="login-button" >Login</button>
                        </div>
                    </form>   
                </div>                 
                <div className="login-col-right">

                </div>        
            </div>            
        </div>
    )
}

export default Login;