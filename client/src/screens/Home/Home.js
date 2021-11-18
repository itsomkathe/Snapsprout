import React, { useEffect, useState, useContext } from "react";
import Post from "../../components/Post/Post";
import "./Home.css";
import CreatePost from "../../components/CreatePost/CreatePost";
import { AuthContext } from "../../App";
//import imgsrc from "../../resources/logos/uk.jpg";

export default function Home() {
    const {authState} = useContext(AuthContext);
    const [allPosts, setAllPosts] = useState([]);
    useEffect(()=>{
        document.title = "Home"
    }, []);
    useEffect(() => {
        let mounted = true;

        fetch("/allposts", {
            method: "get",
            headers: {
                authorization: "Bearer " + localStorage.getItem("jwt"),
            },
        })
            .then((res) => res.json())
            .then((res) => {
                if (mounted) {
                    setAllPosts(res);
                }
            })
            .catch((err) => {
                if (mounted) {
                    setAllPosts([]);
                }
            });

        return () => {
            mounted = false;
        };
    }, []);

    
    return (
        <>
                <CreatePost />

                {allPosts.map((data, idx) => {
                    const userID = authState.id;

                    let isLiked = false;
                    for(let i = 0;i<data.likes.length;i++){
                        if(data.likes[i] === userID){
                            isLiked = true;
                            break;
                        }
                    }

                    return (
                        <>
                            <Post
                                username={data.postedBy.username}
                                image={data.photo}
                                title={data.title}
                                description={data.body}
                                initLikes={data.likes.length}
                                isLiked={isLiked}
                                id={data._id}
                                key={idx}
                            />
                        </>
                    );
                })}
        </>
    );
}
