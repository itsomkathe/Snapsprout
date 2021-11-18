/* eslint-disable no-unused-vars */
import React, { useContext, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logosrc from "../../resources/icons/logodouble.svg";
import homesrc from "../../resources/icons/icons8-home-50.svg";
import profilesrc from "../../resources/icons/profileicon.svg";
import logoutsrc from "../../resources/icons/logouticon.svg";
import settingssrc from "../../resources/icons/settings.svg";
import defaultPic from "../../resources/icons/sample-profile.jpg";
import { AuthContext } from "../../App";
import { useSpring, animated } from "react-spring";
import SearchBar from "./SearchBar";
import LogOutModal from "./LogOutModal";

export default function Navbar() {
    const { authState } = useContext(AuthContext);
    const [openDrop, setOpenDrop] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const menuAppear = useSpring({
        transform: openDrop ? "translate3D(0,0,0)" : "translate3D(0,-40px,0)",
        opacity: openDrop ? 1 : 0,
    });
    function getLinks() {
        if (authState) {
            return [
                <SearchBar />,

                <nav key={16546546} className="links">
                    <div className="navbar-links-hover">
                        <Link className="navbar-link" key={1} to="/home">
                            <img className="iconimg" src={homesrc} alt="home" />
                        </Link>
                    </div>

                    <div key={2} className="navbar-links-hover">
                        <img
                            className="iconimg"
                            src={profilesrc}
                            alt="menu"
                            onClick={() => {
                                if (!openDrop) {
                                    setOpenDrop(true);
                                }
                            }}
                        />
                    </div>
                    <animated.div style={menuAppear}>
                        {openDrop ? (
                            <NavDropdown
                                setOpenDrop={setOpenDrop}
                                setShowModal={setShowModal}
                            />
                        ) : null}
                    </animated.div>
                </nav>,
            ];
        } else {
            return [];
        }
    }
    const disableStyle = {
        position: `fixed`,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        background: `rgba(0,0,0,0.7)`,
    };
    return (
        <>
            <header className="navbox">
                <Link to="/">
                    <img alt="Logo" src={logosrc} className="logo" />
                </Link>

                {getLinks()}
            </header>
            {showModal ? (
                <>
                    <div onClick={()=>{setShowModal(false)}} style={disableStyle}></div>
                    <LogOutModal close = {()=>{setShowModal(false)}}/>
                </>
            )
             : null}
        </>
    );
}

function NavDropdown({ setOpenDrop, setShowModal}) {
    const { authState, authDispatch } = useContext(AuthContext);
    const dropRef = useRef(null);
    const handleClickOutside = (e) => {
        if (!dropRef.current.contains(e.target)) {
            setOpenDrop(false);
        }
    };
    const handleLogOut = (e) => {
        setOpenDrop(false);
        setShowModal(true);
    };
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <div ref={dropRef} className="navbar-dropdown-menu">
                <div className="navbar-dropdown-menu-info">
                    <div className="navbar-dropdown-menu-pic">
                        <img
                            className="navbar-dropdown-image"
                            src={authState.image ? authState.image : defaultPic}
                            alt="pic"
                        ></img>
                    </div>
                    <div className="navbar-dropdown-menu-name">
                        <h3>{authState.name}</h3>
                        <h5>{authState.username}</h5>
                    </div>
                </div>
                <Link to={`/profile/${authState.username}`}>
                    <div
                        onClick={() => {
                            setOpenDrop(false);
                        }}
                        className="navbar-dropdown-menu-item"
                    >
                        <img src={profilesrc} alt="icon" />
                        <h3>Profile</h3>
                    </div>
                </Link>

                <Link to="/editprofile">
                    <div
                        onClick={() => {
                            setOpenDrop(false);
                        }}
                        className="navbar-dropdown-menu-item"
                    >
                        <img src={settingssrc} alt="icon" />
                        <h3>Edit Profile</h3>
                    </div>
                </Link>

                <div
                    onClick={handleLogOut}
                    className="navbar-dropdown-menu-item"
                >
                    <img src={logoutsrc} alt="icon" />
                    <h3 id="navbar-logout">Log Out</h3>
                </div>
            </div>
        </>
    );
}
