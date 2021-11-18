
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import "./Stats.css";
import lottie from "lottie-web";
import animatesrc from "../../resources/animations/button-loading.json";

export default function Stats({ userData, changed }) {
    const [stats, setStats] = useState({
        posts: 0,
        followers: 0,
        following: 0,
        loading: true,
    });
    const loadingRef1 = useRef();
    const loadingRef2 = useRef();
    const loadingRef3 = useRef();

    useEffect(() => {
        lottie.loadAnimation({
            container: loadingRef1.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData: animatesrc,
        });
        lottie.loadAnimation({
                container: loadingRef2.current,
                renderer: "svg",
                loop: true,
                autoplay: true,
                animationData: animatesrc,
        });
        lottie.loadAnimation({
                container: loadingRef3.current,
                renderer: "svg",
                loop: true,
                autoplay: true,
                animationData: animatesrc,
        });
    }, [stats.loading]);

    useEffect(() => {
        let mounted = true;
        if(mounted){
                setStats({...stats, loading: true});
        }
        fetch("/getstats", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                id: userData._id,
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                if (res.error) {
                    if (mounted) {
                        setStats({ ...stats, loading: false });
                    }
                } else {
                    if (mounted) {
                        setStats({
                            posts: res.posts,
                            followers: res.followers,
                            following: res.following,
                            loading: false,
                        });
                    }
                }
            })
            .catch((err) => {
                if (mounted) {
                    setStats({ ...stats, loading: false });
                }
            });

        return () => {
            mounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData, changed]);

    return (
        <>
            <div className="parentStat">
                <div className="statContainer">
                    <div className="statWrapper">
                        <div className="statBox" id="postStats">
                            <h6>Posts</h6>
                                {stats.loading ? (
                                    <div
                                        className="stats-loading-animation"
                                        ref={loadingRef1}
                                    ></div>
                                ) : (
                                    <h3 className="statNums">
                                        {stats.posts}
                                    </h3>
                                )}
                        </div>
                        <div className="statBox" id="followerStats">
                            <h6>Followers</h6>
                            {stats.loading ? (
                                <div
                                    className="stats-loading-animation"
                                    ref={loadingRef2}
                                ></div>
                            ) : (
                                <h3 className="statNums">{stats.followers}</h3>
                            )}
                        </div>
                        <div className="statBox" id="followingStats">
                            <h6>Following</h6>
                            {stats.loading ? (
                                <div
                                    className="stats-loading-animation"
                                    ref={loadingRef3}
                                ></div>
                            ) : (
                                <h3 className="statNums">{stats.following}</h3>
                            )}
                        </div>
                    </div>
                </div>
                <div className="profilename">
                    <h3 className="displayname">{userData.name}</h3>
                    <h5 id="displayusername" className="displayname">
                        {userData.username}
                    </h5>
                    <div className="para">
                        <p>
                            {userData && userData.bio}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
