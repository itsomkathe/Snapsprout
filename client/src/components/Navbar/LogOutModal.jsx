import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import "./LogOutModal.css";
import lottie from "lottie-web";
import animatesrc from "../../resources/animations/log-out.json";

export default function LogOutModal({ close }) {
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

    return ReactDOM.createPortal(
        <>
            <div className="logout-modal-container">
                <div
                    ref={animateRef}
                    className="logout-animation-container"
                ></div>
                <div className="logout-modal-buttons">
                    <button
                        onClick={() => {
                            localStorage.clear();
                            window.location.reload();
                        }}
                        className="logout-button"
                        id="logout-button"
                    >
                        Log Out
                    </button>
                    <button
                        onClick={close}
                        className="logout-button"
                        id="cancel-button"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </>,
        document.getElementById("portal")
    );
}
