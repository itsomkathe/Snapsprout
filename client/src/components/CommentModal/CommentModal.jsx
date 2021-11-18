import React, { useEffect, useState, useRef } from "react";
import "./CommentModal.css";
import ReactDOM from "react-dom";
import lottie from "lottie-web";
import animatesrc from "../../resources/animations/notfound.json";

export default function CommentModal({ close, id }) {
    const [comments, setComments] = useState([]);
    const [loaded, setLoaded] = useState(false);
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

    useEffect(() => {
        let mounted = true;

        fetch("/getcomments", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                postID: id,
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                if (res.error) {
                    throw new Error(res.error);
                }
                if (mounted) {
                    console.log(res.comments);
                    setComments(res.comments);
                    setLoaded(true);
                }
            })
            .catch((err) => {
                console.log(err);
            });

        return () => {
            mounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return ReactDOM.createPortal(
        <>
            <div className="comment-modal-container">
                <div className="comment-modal-head-wrapper">
                    <h1 className="comment-modal-head">Comments</h1>
                    <button onClick={close()} className="comment-modal-btn">
                        Close
                    </button>
                </div>
                <div className="comment-modal-content">
                    {loaded && comments.length > 0 ? (
                        comments.map((item, idx) => {
                            return (
                                <div
                                    key={idx}
                                    className="comment-modal-comment"
                                >
                                    <h4 className="comment-modal-comment-username">
                                        {item.postedBy.username}
                                    </h4>
                                    <h4 className="comment-modal-comment-text">
                                        {item.text}
                                    </h4>
                                </div>
                            );
                        })
                    ) : (
                        <div className="comment-modal-animation-container">
                            <div
                                ref={animateRef}
                                className="comment-modal-animation"
                            ></div>
                            {loaded ? (
                                <h3 className="comment-modal-animation-text">
                                    No comments yet!
                                </h3>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>
        </>,
        document.getElementById("portal")
    );
}
