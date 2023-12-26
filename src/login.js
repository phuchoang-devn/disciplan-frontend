import './login.css';
import env from "./env"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { IoIosWarning } from "react-icons/io";
import { FaHourglassEnd } from "react-icons/fa6";

const Login = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(undefined);
    const [registerWindow, setRegisterWindow] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (JSON.parse(localStorage.getItem("disciplan_user"))) {
            navigate("/week");
            return
        }
    }, [])

    const handleLogIn = () => {
        setError(undefined);

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
                if (r.ok) return r.json();
                else if (r.status === 401) throw new Error('Incorrect username or password');
            })
            .then(json => {
                let token = json.token_type + " " + json.access_token;
                localStorage.setItem("disciplan_user", JSON.stringify({ email, token }));
                props.setLoggedIn(true)
                props.setEmail(email)
                navigate("/week")
            })
            .catch(error => {
                if (error.message === "Failed to fetch") setError("...waiting for Server");
                else setError(error.message);
            });
    }

    return (
        <div className='login-container'>
            {
                registerWindow ?
                    <Register setRegisterWindow={setRegisterWindow} />
                    : null
            }
            <h1 className='login-brand'>Disciplan</h1>
            <div className='login-form-container'>
                <div className='login-form'>
                    <input type="text"
                        placeholder="Enter Email"
                        onChange={ev => setEmail(ev.target.value)}
                        name="email" />
                    <input type="password"
                        placeholder="Enter Password"
                        onChange={ev => setPassword(ev.target.value)}
                        name="pwd" />
                    <button onClick={() => handleLogIn()}><b>Log In</b></button>
                    <div className='login-separate-line'></div>
                    <button id='login-new-account' onClick={() => {
                        setRegisterWindow(true);
                        setError(undefined);
                    }}>
                        <b>Create new account</b>
                    </button>
                </div>
            </div>
            <div className='login-error'
                style={{
                    visibility: error ? "visible" : "hidden"
                }}>
                <div className='login-warning-icon'><IoIosWarning /></div>
                <span><b>{error}</b></span>
            </div>
        </div>
    )
}

const Register = (props) => {
    const [newEmail, setNewEmal] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [error, setError] = useState(undefined);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleRegister = () => {
        setIsSuccess(false);
        setError(undefined);

        if (newEmail === "") {
            setError("Empty Email!");
            return
        }
        if (newPassword === "") {
            setError("Empty password!");
            return
        }
        if (confirmPass !== newPassword) {
            setError("Failed to comfirm password!");
            return
        }

        let formData = new FormData();
        formData.append("email", newEmail);
        formData.append("password", newPassword);
        register(formData);
    }

    async function register(data) {
        await fetch("http://" + env.BACKEND_SERVER + "/users/register", {
            method: 'POST',
            body: data
        })
            .then(r => {
                if (r.ok) {
                    setError(undefined);
                    setIsSuccess(true);
                } else if (r.status === 400) return r.json();
            })
            .then(json => {
                if (json) throw new Error(json.detail);
            })
            .catch(error => {
                console.log(error.detail);
                if (error.message === "Failed to fetch") setError("...waiting for Server");
                else setError(error.message);
            });
    }


    return (
        <div className='register-container'>
            <div className='register-form'>
                <button id='register-new-account' onClick={() => props.setRegisterWindow(false)}><b>Go to Login</b></button>
                <div className='register-separate-line'></div>
                <input type="text"
                    placeholder="Enter Email"
                    onChange={ev => setNewEmal(ev.target.value)}
                    name="email" />
                <input type="password"
                    placeholder="Enter Password"
                    onChange={ev => setNewPassword(ev.target.value)}
                    name="pwd" />
                <input type="password"
                    placeholder="Confirm Password"
                    onChange={ev => setConfirmPass(ev.target.value)}
                    name="conf-pwd" />
                <button id='login-new-account' onClick={() => handleRegister()}><b>Register</b></button>
            </div>
            <div className='register-error'
                style={{
                    visibility: error ? "visible" : "hidden"
                }}>
                <div className='login-warning-icon'><IoIosWarning /></div>
                <span><b>{error}</b></span>
            </div>
            <div className='register-success'
                style={{
                    visibility: isSuccess ? "visible" : "hidden"
                }}>
                <div className='register-success-icon'><FaHourglassEnd /></div>
                <span><b>Please confirm Link in your Email!</b></span>
            </div>
        </div>
    )
}

export default Login