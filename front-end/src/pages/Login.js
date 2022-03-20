
const Login = () => {
    

    function handleSubmit(e) {
        e.preventDefault();
        const userInputEmail = document.getElementById("email");
        const userInputPassword = document.getElementById("password");
        let email = userInputEmail.value;
        let password = userInputPassword.value;
        console.log(email + " " + password);
    }

    return (
        <div className="login">
            <h1>Login Page</h1>
            <form className="login-form" onSubmit={ handleSubmit }>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" placeholder="Enter Email" required></input>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" placeholder="Enter Password" required></input>
                </div>
                <div className="form-group">
                    <button id="login-button">Login</button>
                </div>
            </form>            
        </div>
    )
}

export default Login;