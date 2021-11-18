import React, { useRef, useState, useEffect, useContext } from "react";
import "./EditProfile.css";
import imgsrc from "../../resources/icons/sample-profile.jpg";
import { AuthContext } from "../../App";

async function createFile() {
    try {
        let response = await fetch(imgsrc);
        let data = await response.blob();
        let metadata = {
            type: "image",
        };
        let file = new File([data], "samplepic.jpg", metadata);
        return file;
    } catch (err) {
        return new Error(err);
    }
}

export default function EditProfile() {
    const { authState } = useContext(AuthContext);
    const [image, setImage] = useState({
        image: null,
        changed: false,
        removed: false,
    });
    const [data, setData] = useState({ name: "", bio: "" });
    const [allowPost, setAllowPost] = useState(false);
    const [preview, setPreview] = useState(null);
    const [didMount, setDidMount] = useState(false);
    const fileInputRef = useRef();
    useEffect(() => {
        setDidMount(true);
        document.title = "Edit Profile"
        return () => {
            setDidMount(false);
        };
    }, []);

    useEffect(() => {
        let mounted = true;
        if (authState) {
            if(authState.image){
                setImage({
                    image: authState.image,
                    changed: false,
                    removed: false,
                });
            }else{
                createFile()
                .then((res) => {
                    if (mounted) {
                        setImage({
                            image: res,
                            changed: false,
                            removed: false,
                        });
                    }
                })
                .catch((err) => {
                    if (mounted) {
                        setImage({
                            image: null,
                            changed: false,
                            removed: false,
                        });
                    }
                });
            }
            setData({name: authState.name, bio: authState.bio});
        }
        return () => {
            mounted = false;
        };
    }, [authState]);

    //Ignore: For preview
    useEffect(() => {
        let mounted = true;
        if (image.image) {
            if (typeof image.image === "object") {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (mounted) {
                        setPreview(reader.result);
                    }
                };
                reader.readAsDataURL(image.image);
            } else {
                setPreview(image.image);
            }
        } else {
            if (mounted) {
                setPreview(null);
            }
        }
        return () => {
            mounted = false;
        };
    }, [image]);

    const handlePreview = (event) => {
        event.preventDefault();
        fileInputRef.current.click();
    };

    const updateImage = (event) => {
        const file = event.target.files[0];
        console.log(file);
        if (file && file.type.substr(0, 5) === "image") {
            if (didMount) {
                setImage({ image: file, changed: true });
            }
        } else {
            if (didMount) {
                setImage({ image: null, changed: false });
            }
        }
        if (!allowPost) {
            setAllowPost(true);
        }
    };

    const removeImage = (event) => {
        event.preventDefault();
        createFile()
            .then((res) => {
                if (didMount) {
                    setImage({ image: res, changed: false, removed: true });
                }
            })
            .catch((err) => {
                if (didMount) {
                    setImage({ image: null, changed: false, removed: true });
                }
            });
        if (!allowPost) {
            setAllowPost(true);
        }
    };

    const submitForm = (event) => {
        event.preventDefault();
        if (image.changed) {
            const picData = new FormData();
            picData.append("file", image.image);
            picData.append("upload_preset", "snapsprout");
            picData.append("cloud_name", "cloudpicstorage");
            fetch(
                "https://api.cloudinary.com/v1_1/cloudpicstorage/image/upload",
                {
                    method: "post",
                    body: picData,
                }
            )
                .then((res) => {
                    return res.json();
                })
                .then((res) => {
                    fetch("/api/editprofile", {
                        method: "post",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + localStorage.getItem("jwt"),
                        },
                        body: JSON.stringify({
                            image: res.secure_url,
                            name: data.name,
                            bio: data.bio
                        })
                    })
                        .then((res) => {
                            return res.json();
                        })
                        .then((res) => {
                            localStorage.setItem("user", JSON.stringify({
                                name: res.name,
                                email: res.email,
                                username: res.username,
                                id: res._id,
                                bio:res.bio,
                                image: res.photo
                            }));
                        })
                        .catch((err) => {
                            alert("Cannot Save Changes");
                        });
                })
                .catch((err) => {
                    alert("Cannot Upload Picture");
                });
        } else if (image.removed) {
            fetch("/api/editprofile", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("jwt"),
                },
                body: JSON.stringify({
                    name: data.name,
                    bio: data.bio
                }),
            })
                .then((res) => {
                    return res.json();
                })
                .then((res) => {
                    console.log(res)
                    localStorage.setItem("user", JSON.stringify({
                        name: res.name,
                        email: res.email,
                        username: res.username,
                        id: res._id,
                        bio:res.bio
                    }));
                })
                .catch((err) => {
                    alert("Cannot Save Changes");
                });
        } else {
            let body = {};
            if (typeof image.image === "object") {
                body = {
                    name: data.name,
                    bio: data.bio,
                };
            } else {
                body = {
                    image: image.image,
                    name: data.name,
                    bio: data.bio,
                };
            }
            fetch("/api/editprofile", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("jwt"),
                },
                body: JSON.stringify(body),
            })
                .then((res) => {
                    return res.json();
                })
                .then((res) => {
                    if(res.photo){
                        localStorage.setItem("user", JSON.stringify({
                            name: res.name,
                            email: res.email,
                            username: res.username,
                            id: res._id,
                            bio:res.bio,
                            image: res.photo
                        }));
                    }else{
                        localStorage.setItem("user", JSON.stringify({
                            name: res.name,
                            email: res.email,
                            username: res.username,
                            id: res._id,
                            bio:res.bio
                        }));
                    }
                    
                })
                .catch((err) => {
                    alert("Cannot Save Changes");
                });
        }
    };

    return (
        <>
            <div className="editprofile-container">
                <div className="editprofile-content">
                    <form className="editprofile-left" onSubmit = {submitForm}>
                        <div className="editprofile-image-wrapper">
                            <img
                                className="editprofile-image"
                                src={preview}
                                alt="profilepic"
                            />
                        </div>
                        <h1 className="editprofile-display-name">
                            {authState && authState.name}
                        </h1>
                        <h5 className="editprofile-display-username">
                            {authState && authState.username}
                        </h5>
                        <div className="editprofile-button-wrapper">
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: `none` }}
                                accept="image/*"
                                onChange={updateImage}
                            ></input>
                            <button
                                id="editprofile-upload"
                                className="editprofile-button"
                                onClick={handlePreview}
                            >
                                Add Picture
                            </button>
                            <button
                                id="editprofile-remove"
                                className="editprofile-button"
                                onClick={removeImage}
                            >
                                Remove Picture
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="Name"
                            className="editprofile-input-name"
                            onChange={(e) => {
                                if (!allowPost) {
                                    setAllowPost(true);
                                }
                                setData({ ...data, name: e.target.value });
                            }}
                            value = {data.name}
                        ></input>
                        <textarea
                            type="text"
                            className="editprofile-input-bio"
                            rows={3}
                            placeholder="Bio"
                            onChange={(e) => {
                                if (!allowPost) {
                                    setAllowPost(true);
                                }
                                setData({ ...data, bio: e.target.value });
                            }}
                            value = {data.bio}
                        ></textarea>
                        {allowPost ? (
                            <button
                                id="editprofile-save"
                                className="editprofile-button"
                                type="submit"
                            >
                                Save
                            </button>
                        ) : (
                            <button
                                style={{
                                    backgroundColor: "rgb(51, 51, 51)",
                                    opacity: "60%",
                                    cursor: "default",
                                }}
                                id="editprofile-save"
                                className="editprofile-button"
                                type="submit"
                                disabled={true}
                            >
                                Save
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
}
