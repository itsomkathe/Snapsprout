import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import lottie from "lottie-web";
import "./Navbar.css";
import animatesrc from "../../resources/animations/button-loading.json";

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const [result, setResult] = useState({ users: null, loading: false, visible:false });
    const loadingRef = useRef();
    const textRef = useRef();
    useEffect(() => {
        lottie.loadAnimation({
            container: loadingRef.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData: animatesrc,
        });
    }, [result]);

    useEffect(()=>{
        if(query.length){
            setResult((prev) => ({ ...prev, loading: true, visible: true }));
            fetch("/api/search-user", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: query,
                }),
            })
                .then((res) => {
                    return res.json();
                })
                .then((res) => {
                    if(res.result.length){
                        if(textRef.current.value){
                            setResult((prev) => ({
                                users: res.result,
                                loading: false,
                                visible: true
                            }));
                        }else{
                            setResult((prev) => ({ users: null, loading: false, visible: false }));
                        }
                    }else{
                        setResult((prev) => ({ users: null, loading: false, visible: false }));
                    }
                })
                .catch((err) => {
                    setResult((prev) => ({ users: null, loading: false, visible: false }));
                });
        }else{
            setResult((prev) => ({ users: null, loading: false, visible: false}));
        }
    },[query])

    return (
        <>
            <div className="navbar-search-wrapper">
                <input
                    spellCheck={false}
                    type="text"
                    className="navbar-input"
                    placeholder="Search User"
                    onChange={(event)=>{setQuery(event.target.value)}}
                    ref = {textRef}
                    value = {query}
                />

                {result.visible ? (
                    <div className="searchbar-users-dropdown">
                        {result.loading ? (
                            <div
                                className="searchbar-loading"
                                ref={loadingRef}
                            ></div>
                        ) : (
                            result.users.map((data, idx) => {
                                return (
                                    <Link to = {`/profile/${data.username}`}>
                                        <div
                                            key={idx}
                                            className="searchbar-user"
                                            onClick = {()=>{
                                                setResult({ users: null, loading: false, visible:false })
                                                setQuery("")
                                            }}
                                        >
                                            <h4 className="searchbar-user-content">
                                                {data.name}
                                            </h4>
                                            <h6
                                                className="searchbar-user-content"
                                                id="searchbar-user-username"
                                            >
                                                {data.username}
                                            </h6>
                                        </div>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                ) : null}
            </div>
        </>
    );
}
