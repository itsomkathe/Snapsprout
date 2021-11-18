import React, { useEffect, useState, useRef } from "react";
import "./Post.css";
import heartsrc from "../../resources/icons/heart.svg";
import redheartsrc from "../../resources/icons/red-heart.svg";
import commentsrc from "../../resources/icons/chatbubble.svg";
import commentbtnsrc from "../../resources/icons/arrow.svg";
import CommentModal from "../CommentModal/CommentModal";

export default function Post({
    username,
    image,
    title,
    description,
    id,
    initLikes,
    isLiked,
}) {
    const [liked, setLiked] = useState(isLiked);
    const [likes, setLikes] = useState(initLikes);
    const [showModal, setShowModal] = useState(false);
    const [comment, setComment] = useState("");
    const [allowComment, setAllowComment] = useState(false);
    const first = useRef(true);
    
    useEffect(() => {
        if (comment) {
            setAllowComment(true);
        }
    }, [comment]);

    useEffect(() => {
        if (first.current) {
            first.current = false;
        } else {
            if (liked) {
                likePost(id);
                setLikes((prev) => prev + 1);
            } else if (!liked) {
                unlikePost(id);
                setLikes((prev) => prev - 1);
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [liked]);

    const likePost = (id) => {
        fetch("/likepost", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                postID: id,
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                //console.log(res);
            })
            .catch((err) => {
                //console.log(err);
            });
    };

    const unlikePost = (id) => {
        fetch("/unlikepost", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                postID: id,
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                //console.log(res);
            })
            .catch((err) => {
                //console.log(err);
            });
    };

    const postComment = () => {
        setComment("");
        fetch("/comment", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                postID: id,
                text: comment,
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const disableStyle = {
        position: `fixed`,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        background: `rgba(0,0,0,0.7)`,
    };

    let source = liked ? redheartsrc : heartsrc;

    return (
        <>
            {showModal ? (
                <>
                    <div onClick={closeModal} style={disableStyle}></div>
                    <CommentModal
                        close={() => {
                            return closeModal;
                        }}
                        id = {id}
                    />
                </>
            ) : null}

            <div className="post-parent">
                <div className="post-header">
                    <div className="post-picAndName">
                        <h5>{username}</h5>
                    </div>
                </div>
                <div
                    className="post-image"
                    onDoubleClick={() => setLiked((prev) => !prev)}
                >
                    <img
                        className="post-actual-image"
                        src={image}
                        alt="postpic"
                    />
                </div>
                <div className="post-contentBox">
                    <div className="post-operations">
                        <img
                            onClick={() => setLiked((prev) => !prev)}
                            src={source}
                            alt="icon"
                        />
                        <img
                            onClick={() => {
                                setShowModal(true);
                            }}
                            className="post-comment-icon"
                            src={commentsrc}
                            alt="icon"
                        />
                    </div>
                    <div className="post-text">
                        <h6 className="post-likenums">{likes + " likes"}</h6>
                        <h6 className="post-title">{title}</h6>
                        <h6 className="post-description">{description}</h6>
                    </div>
                    <form className="post-comment-section">
                        <input
                            className="post-comment-inp"
                            type="text"
                            placeholder="Post a comment"
                            value={comment}
                            onChange={(e) => {
                                setComment(e.target.value);
                            }}
                        />
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                postComment();
                            }}
                            disabled={!allowComment}
                        >
                            <img
                                className="post-comment-btn"
                                src={commentbtnsrc}
                                type="submit"
                                alt="icon"
                            />
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
