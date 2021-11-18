import React from 'react';
import "./ProfilePic.css";
import imgsrc from '../../resources/icons/sample-profile.jpg';

export default function ProfilePic({imageURL}){
        return(
        <>
                <div className = "imageclass">
                        <img src = {imageURL ? imageURL : imgsrc} alt = "profile" />
                </div>
        </>
        )
}