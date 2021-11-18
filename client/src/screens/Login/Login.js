import React from "react";
import "./Login.css";
import { useState, useContext, useEffect } from "react";
import {AuthContext} from "../../App";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

const initial = {
    email: "",
    password: "",
};

export default function Login() {
    // eslint-disable-next-line no-unused-vars
    const {authState, authDispatch} = useContext(AuthContext);
    const [formState, setFormState] = useState(initial);
    const [isMessage, setIsMessage] = useState({ bool: false, message: "" });
    const history = useHistory();
    useEffect(()=>{
        document.title = "Login"
    }, [])
    const updateForm = (e) => {
        const tar = e.target.name;
        const value = e.target.value;

        if (tar === "email") {
            setFormState({ ...formState, email: value });
        } else if (tar === "password") {
            setFormState({ ...formState, password: value });
        }
    };

    const postData = (e) => {
        e.preventDefault();
        fetch("/login", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: formState.email,
                password: formState.password,
            }),
        })
            .then((res) => {
                console.log(res.status);
                return res.json();
            })
            .then((data) => {
                if (data.error) {
                    setTimeout(() => {
                        setIsMessage({ bool: false });
                    }, 8000);
                    setIsMessage({ bool: true, message: data.error });
                } else {
                    localStorage.setItem("jwt", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    authDispatch({type: "USER", payload: data.user});
                    history.push("/home");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <div className="login-container">
                <h1>Log In</h1>
                <Link to="/signup">
                    <h5>Don't have an account? Sign Up</h5>
                </Link>

                <form className="login-form" onSubmit={postData}>
                    <input
                        spellCheck={false}
                        type="text"
                        className="login-email"
                        placeholder="Email"
                        name="email"
                        onChange={updateForm}
                        value = {formState.email}
                    />
                    <input
                        spellCheck={false}
                        type="password"
                        className="login-password"
                        placeholder="Password"
                        name="password"
                        onChange={updateForm}
                        value = {formState.password}
                    />

                    <div className="login-buttons">
                        <button className="login-submit" type="submit">
                            Log In
                        </button>
                        <button onClick = {(e)=>{
                            e.preventDefault();
                            setFormState({email: "johnsnow@sample.com" , password: "123456"})}} className="login-test">Test User</button>
                    </div>

                    <h6>Forgot Password</h6>
                </form>

                {isMessage.bool && (
                    <div className="login-message">
                        <h3>{isMessage.message}</h3>
                    </div>
                )}
            </div>
        </>
    );
}
