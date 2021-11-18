import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import {Link} from 'react-router-dom';
import "./Signup.css";

const initial = {
    name: "",
    username: "",
    email: "",
    password: "",
};

export default function Signup() {
    const [formState, setFormState] = useState(initial);
    const [isMessage, setIsMessage] = useState({ bool: false, message: "" });
    const history = useHistory();

    useEffect(()=>{
        document.title = "Signup"
    }, [])

    const updateForm = (e) => {
        const tar = e.target.name;
        const value = e.target.value;

        if (tar === "name") {
            setFormState({ ...formState, name: value });
        } else if (tar === "username") {
            setFormState({ ...formState, username: value });
        } else if (tar === "email") {
            setFormState({ ...formState, email: value });
        } else if (tar === "password") {
            setFormState({ ...formState, password: value });
        }
    };

    const postData = (e) => {
        e.preventDefault();
        fetch("/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: formState.name,
                username: formState.username,
                email: formState.email,
                password: formState.password,
            }),
        })
            .then((res) => {
                console.log(res.status);
                return res.json();
            })
            .then((data) => {
                if (data.error != null) {
                    setTimeout(() => {
                        setIsMessage({ bool: false });
                    }, 8000);
                    setIsMessage({ bool: true, message: data.error });
                } else {
                    history.push("/login");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <div className="signup-container">
                <h1>Sign Up</h1>

                <Link to = "/login">
                    <h5>Already have an account? Log In</h5>
                </Link>

                <form className="signup-form" onSubmit={postData}>
                    <input
                        spellCheck={false}
                        type="text"
                        className="signup-name"
                        placeholder="Name"
                        name="name"
                        value={formState.name}
                        onChange={updateForm}
                    />

                    <input
                        spellCheck={false}
                        type="text"
                        className="signup-username"
                        placeholder="Username"
                        name="username"
                        value={formState.username}
                        onChange={updateForm}
                    />
                    <input
                        spellCheck={false}
                        className="signup-email"
                        placeholder="Email"
                        name="email"
                        value={formState.email}
                        onChange={updateForm}
                    />
                    <input
                        spellCheck={false}
                        type="password"
                        className="signup-password"
                        placeholder="Password"
                        name="password"
                        value={formState.password}
                        onChange={updateForm}
                    />

                    <button className="signup-submit" type="submit">
                        Sign Up
                    </button>
                </form>
                <Link to = "/login">
                    <h6>Test User? Click Here</h6>
                </Link>
            </div>

            {isMessage.bool && (
                <div className="signup-message">
                    <h3>{isMessage.message}</h3>
                </div>
            )}
        </>
    );
}
