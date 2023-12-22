import './login.css';
import env from "./env"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate();

    useEffect(() => {
        if (JSON.parse(localStorage.getItem("disciplan_user"))) {
            navigate("/week");
            return
        }
    }, [])

    const onButtonClick = () => {
        setError("")

        if (email === "") {
            setError("Empty Email!")
            return
        }
        if (password === "") {
            setError("Empty password!")
            return
        }

        let formData = new FormData();
        formData.append("username", email);
        formData.append("password", password);
        getToken(formData);
    }

    async function getToken(data) {
        await fetch("http://" + env.BACKEND_SERVER + "/users/token", {
            method: 'POST',
            body: data
        })
            .then(r => {
                if (r.ok) {
                    return r.json();
                }
                throw new Error('Incorrect username or password');
            })
            .then(json => {
                let token = json.token_type + " " + json.access_token;
                localStorage.setItem("disciplan_user", JSON.stringify({ email, token }));
                props.setLoggedIn(true)
                props.setEmail(email)
                navigate("/week")
            })
            .catch(error => setError(error.message));
    }

    return (
        <div className='login-container'>
            <div className="login-nav">
                <span>Disciplan</span>
            </div>
            <div className='login-form-container'>
                <div className='login-error'><b>{error}</b></div>
                <div className='login-form'>
                    <input type="text"
                        placeholder="Enter Email"
                        onChange={ev => setEmail(ev.target.value)}
                        name="email" />
                    <input type="password"
                        placeholder="Enter Password"
                        onChange={ev => setPassword(ev.target.value)}
                        name="pwd" />
                    <button onClick={onButtonClick}>Login</button>
                </div>
            </div>
        </div>
    )
}

export default Login