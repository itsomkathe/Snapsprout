import React, { useEffect, useReducer, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { animated, useTransition } from "react-spring";
import lottie from "lottie-web";
import "./CreatePost.css";

const rocket = require("../../resources/animations/rocket.json");
const success = require("../../resources/animations/success.json");
const cross = require("../../resources/animations/cross.json");

const loadingReducer = (state, action) => {
    switch (action.type) {
        case "POSTING":
            return {
                ...state,
                message: "Uploading Picture",
                bool: action.bool,
                animation: rocket,
            };
        case "CREATING":
            return { ...state, message: "Creating Post" };
        case "SUCCESS":
            return {
                ...state,
                message: "Posted Succesfully!",
                animation: success,
            };
        case "ERROR":
            return {
                ...state,
                message: "Error Occured",
                animation: cross,
            };
        case "UNMOUNT":
            console.log("Unmounting");
            return { message: "", bool: false };
        default:
            return state;
    }
};

export default function CreatePost() {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [compressedImage, setCompressedImage] = useState(null);
    const [content, setContent] = useState({ title: "", des: "" });
    const [allowPost, setAllowPost] = useState(false);
    const [picURL, setPicURL] = useState("");
    const [loadingState, loadingDispatch] = useReducer(loadingReducer, {
        bool: false,
        message: "",
        animation: "",
    });
    const [didMount, setDidMount] = useState(false);

    useEffect(() => {
        setDidMount(true);
        return () => {
            setDidMount(false);
        };
    }, []);

    const transition = useTransition(loadingState.bool, {
        from: { x: -500, y: 0, opacity: 0 },
        enter: { x: 0, y: 0, opacity: 1 },
        leave: { x: 500, y: 0, opacity: 0 },
    });

    const loadRef = useRef();
    const fileInputRef = useRef();

    useEffect(() => {
        lottie
            .loadAnimation({
                container: loadRef.current,
                renderer: "svg",
                loop: true,
                autoplay: true,
                animationData: loadingState.animation,
            })
            .destroy();
        lottie.loadAnimation({
            container: loadRef.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData: loadingState.animation,
        });
    }, [loadingState.animation]);

    useEffect(() => {
        let unmounted = false;
        let timer = null;
        if (!unmounted) {
            loadingDispatch({ type: "CREATING" });
        }
        if (picURL) {
            fetch("/createpost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("jwt"),
                },
                body: JSON.stringify({
                    title: content.title,
                    body: content.des,
                    picURL: picURL,
                }),
            })
                .then((res) => {
                    return res.json();
                })
                .then((res) => {
                    if (!unmounted) {
                        loadingDispatch({ type: "SUCCESS" });
                        timer = setTimeout(() => {
                            loadingDispatch({ type: "UNMOUNT" });
                            setAllowPost(true);
                        }, 5000);
                    }
                })
                .catch((err) => {
                    if (!unmounted) {
                        loadingDispatch({ type: "ERROR" });
                        timer = setTimeout(() => {
                            loadingDispatch({ type: "UNMOUNT" });
                            setAllowPost(true);
                        }, 5000);
                    }
                });
        }

        return () => {
            //console.log("cleaning up");
            unmounted = true;
            clearTimeout(timer);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [picURL]);

    useEffect(() => {
        let mounted = true;
        if (compressedImage) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if(mounted){
                    setPreview(reader.result);
                }
            };
            reader.readAsDataURL(compressedImage);
        } else {
            if(mounted){
                setPreview(null);
            }
        }

        return () => {
            mounted = false;
        };
    }, [compressedImage]);

    useEffect(() => {
        let mounted = true;
        if (content.title && content.des && compressedImage) {
            if(mounted){
                setAllowPost(true);
            }
        } else {
            if(mounted){
                setAllowPost(false);
            }       
        }

        return ()=>{
            mounted = false;
        }
    }, [compressedImage, content]);

    function postPicture() {
        const data = new FormData();
        data.append("file", compressedImage);
        data.append("upload_preset", "snapsprout");
        data.append("cloud_name", "cloudpicstorage");
        if(didMount){
            setAllowPost(false);
        }
        loadingDispatch({ type: "POSTING", bool: true });
        fetch("https://api.cloudinary.com/v1_1/cloudpicstorage/image/upload", {
            method: "post",
            body: data,
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                if (didMount) {
                    setPicURL(res.secure_url);
                }
            })
            .catch((err) => {
                if(didMount){
                    loadingDispatch({ type: "ERROR" });
                }
                setTimeout(() => {
                    if(didMount){
                        loadingDispatch({ type: "UNMOUNT" });
                        setAllowPost(true);
                    }
                }, 5000);
            });
    }

    async function handleImageCompression(imageFile) {
        const options = {
            maxSizeMB: 5,
            maxWidthOrHeight: 1080,
            useWebWorker: true,
        };

        try {
            const compressedFile = await imageCompression(imageFile, options);
            //console.log(compressedFile.size/1024/1024);
            if(didMount){
                setCompressedImage(compressedFile);
            }
        } catch (error) {
        }
    }

    const updateImage = (event) => {
        const file = event.target.files[0];
        if (file && file.type.substr(0, 5) === "image") {
            if(didMount){
                setImage(file);
                handleImageCompression(file);
            }
            
        } else {
            if (image == null) {
                if(didMount){
                    setImage(null);
                }
            }
        }
    };

    const handlePreview = (event) => {
        event.preventDefault();
        fileInputRef.current.click();
    };

    return (
        <>
            <form className="createpost-form">
                {preview ? <img src={preview} alt="previewpic" /> : null}

                <input
                    type="file"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={updateImage}
                />

                <div className="createpost-contentbox">
                    <textarea
                        type="text"
                        className="createpost-title"
                        rows={1}
                        placeholder="Add a title"
                        onChange={(e) => {
                            setContent({ ...content, title: e.target.value });
                        }}
                    />

                    <textarea
                        type="text"
                        className="createpost-description"
                        rows={2}
                        placeholder="Add Description"
                        onChange={(e) => {
                            setContent({ ...content, des: e.target.value });
                        }}
                    />

                    <div className="createpost-buttons">
                        <button
                            onClick={handlePreview}
                            className="createpost-previewButton"
                            onKeyPress={(e) => {
                                e.key === "Enter" && e.preventDefault();
                            }}
                        >
                            Add Image
                        </button>

                        {allowPost ? (
                            <button
                                disabled={false}
                                onClick={(e) => {
                                    e.preventDefault();
                                    postPicture();
                                }}
                                className="createpost-submit"
                                type="submit"
                            >
                                Post
                            </button>
                        ) : (
                            <button
                                style={{
                                    backgroundColor: "rgb(51, 51, 51)",
                                    opacity: "60%",
                                    cursor: "default",
                                }}
                                disabled={true}
                                className="createpost-submit"
                                type="submit"
                            >
                                Post
                            </button>
                        )}
                    </div>
                </div>
            </form>

            {transition((style, item) =>
                item ? (
                    <animated.div style={style} className="createpost-loading">
                        <div
                            ref={loadRef}
                            className="createpost-animation"
                        ></div>
                        <h3 className="createpost-loading-title">
                            {loadingState.message}
                        </h3>
                    </animated.div>
                ) : (
                    ""
                )
            )}
        </>
    );
}
