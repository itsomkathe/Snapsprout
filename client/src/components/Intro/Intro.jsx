import React, { useRef, useEffect, useReducer } from "react";
import ProfilePic from "./ProfilePic";
import Stats from "./Stats";
import lottie from "lottie-web";
import animatesrc from "../../resources/animations/button-loading.json";
import "./Intro.css";
import { Link } from "react-router-dom";

function followReducer(state, action){
    switch(action.type){
        case "LOADING":
            return {...state, loading: true}
        case "FOLLOWED":
            return {...state, loading: false, followed: true, style: {backgroundColor:`rgb(41, 41, 41)`}, buttonText: "Unfollow" }
        case "UNFOLLOWED":
            return {...state, loading: false, followed: false, style: {backgroundColor:`rgb(6, 94, 209)`}, buttonText: "Follow" }
        default: 
            return state;
    }
}

export default function Intro({ userData, isSame, id }) {
   
    const[followState, followDispatch] = useReducer(followReducer, {
        loading: true,
        style: {backgroundColor:`rgb(6, 94, 209)`},
        buttonText: "",
        followed: false
    })
    
    const loadingRef = useRef();
    
    useEffect(()=>{
        let mounted = true;
        let followers = userData.followers;

        for(let i = 0; i<followers.length;i++){
            if(followers[i] === id){
                if(mounted){
                    followDispatch({type: "FOLLOWED"})
                }
                return;
            }
        }

        if(mounted){
            followDispatch({type: "UNFOLLOWED"})
        }
        
        return ()=>{
            mounted = false;
        }

    }, [userData, id])
    
    useEffect(() => {
        lottie.loadAnimation({
            container: loadingRef.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData: animatesrc,
        });
    }, [followState.loading]);

    function handleFollow(){
        followDispatch({type: "LOADING"})
        if(followState.followed){
            fetch('/unfollow', {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("jwt"),
                },
                body: JSON.stringify({
                    followID: userData._id
                })
            }).then(res=>{
                return res.json();
            }).then(res=>{
                followDispatch({type: "UNFOLLOWED"});
            }).catch(err=>{
                followDispatch({type: "FOLLOWED"});
            })
        }else{
            fetch('/follow', {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("jwt"),
                },
                body: JSON.stringify({
                    followID: userData._id
                })
            }).then(res=>{
                return res.json();
            }).then(res=>{
                followDispatch({type: "FOLLOWED"});
            }).catch(err=>{
                followDispatch({type: "UNFOLLOWED"});
            })
        }
        
    }
    const editButtonStyle = {
              backgroundColor: `rgb(41, 41, 41)`,
    }
        
    return (
        <>
            <div className="introContainer">
                <div className="imageandbtn">
                    <ProfilePic imageURL = {userData.photo ? userData.photo : null}/>
                    {isSame ? (
                        <Link to = {`/editprofile`}>
                            <button style={editButtonStyle} className="introButton">
                                Edit Profile
                            </button>
                        </Link>
                    ) : (
                        <button disabled = {followState.loading} onClick = {handleFollow} style={followState.style} className="introButton">
                            {
                                followState.loading ? 
                                <div
                                className="follow-loading"
                                ref={loadingRef}
                                ></div>: <div className = "follow-text">{followState.buttonText}</div>
                            }
                        </button>
                    )}
                </div>

                <Stats userData={userData} changed = {followState.followed} />
            </div>
        </>
    );
}
