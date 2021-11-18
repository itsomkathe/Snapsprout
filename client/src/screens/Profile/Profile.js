import React, { useEffect, useReducer, useRef, useContext } from "react";
import Intro from "../../components/Intro/Intro";
import Grid from "../../components/Grid/Grid";
import { useParams } from "react-router-dom";
import lottie from "lottie-web";
import animatesrc from "../../resources/animations/page-loading.json";
import { AuthContext } from "../../App";
import "./Profile.css";

function profileReducer(state, action) {
    
    switch (action.type) {
        case "LOADING":
            return { ...state, loading: true, error: false, fetched: false };
        case "SETDATA":
            return {
                ...state,
                user: action.data,
                error: false,
                posts: action.data.posts,
                loading: false,
                fetched: true,
            };
        case "ERROR":
            return { ...state, error: true, loading: false, fetched: false };
        default:
            return state;
    }
}

export default function Profile() {
    const { username } = useParams();
    const { authState } = useContext(AuthContext);
    const [profileState, profileDispatch] = useReducer(profileReducer, {
        user: { name: "", username: "", email: "", image: "" },
        error: false,
        posts: [],
        loading: true,
        fetched: false,
    });
    const animateRef = useRef();
    useEffect(() => {
        lottie.loadAnimation({
            container: animateRef.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData: animatesrc,
        });
    }, []);

    useEffect(()=>{
        document.title = `Profile - ${username}`
    }, [username])

    useEffect(() => {
        let mounted = true;

        fetch("/profile/" + username, {
            method: "get",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                if (mounted) {
                    if (res.error) {
                        profileDispatch({ type: "ERROR" });
                    } else {
                        profileDispatch({ type: "SETDATA", data: res });
                    }
                }
            })
            .catch((err) => {
                if (mounted) {
                    profileDispatch({ type: "ERROR" });
                }
            });

        return () => {
            mounted = false;
        };
    }, [username]);

    return (
        <>
            {profileState.loading && (
                <div className="profile-loading">
                    <div
                        className="profile-loading-animation"
                        ref={animateRef}
                    ></div>
                </div>
            )}

            {profileState.error ? (
                <div className="profile-error">
                    <div className="profile-error-text">
                        <h1>
                            The profile you are looking for does not exists.
                        </h1>
                        <h4>The link you have followed may be broken.</h4>
                    </div>
                </div>
            ) : null}

            {profileState.fetched ? (

                <div className = "profile-wrapper">
                    <Intro userData={profileState.user} id = {authState.id} isSame = {profileState.user._id === authState.id ? true: false}/>
                    <Grid posts={profileState.posts} />
                </div>   
            ) : null}
        </>
    );
}
