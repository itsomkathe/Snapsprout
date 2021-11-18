import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Post from "../../components/Post/Post";
import { AuthContext } from "../../App";

export default function IndividualPost() {
    const { postID } = useParams();
    const { authState } = useContext(AuthContext);
    const [postData, setPostData] = useState(null);
    useEffect(()=>{
        document.title = "Post"
    }, []);
    function getIsLiked(res){
        const userID = authState.id;
        let isLiked = false;
        for (let i = 0; i < res.likes.length; i++) {
            if (res.likes[i] === userID) {
                isLiked = true;
                break;
            }
        }
        return isLiked;
    }
    useEffect(() => {
        let mounted = true;
        fetch("/api/post/" + postID, {
            method: "get",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                const isLiked = getIsLiked(res);
                if(mounted){
                    setPostData({...res, isLiked });
                }
            })
            .catch((err) => {});

        return ()=>{
            mounted = false;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postID, authState]);

    return (
        <>
            {postData ? (
                <Post
                    username={postData.postedBy.username}
                    image={postData.photo}
                    title={postData.title}
                    description={postData.body}
                    initLikes={postData.likes.length}
                    isLiked={postData.isLiked}
                    id={postData._id}
                />
            ) : null}
        </>
    );
}
