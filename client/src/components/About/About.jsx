/* eslint-disable react/jsx-no-target-blank */
import React, {useEffect} from 'react';
import "./About.css";
import gitsrc from "../../resources/icons/igithub.svg";
import { Link } from 'react-router-dom';

export default function About(){
        useEffect(()=>{
                document.title = "Snapsprout"
        }, []);
        return(<>
                <div className = "about-container">
                        <h1 className = "about-heading">About App</h1>

                        <p className = "about-para">
                                Hello and welcome.<br/><br/>
                                This app has been created as a side project to apply all the things that I have learned so far. Feel free to try it out. <br/><br/>

                                This project is open source, so PRs are welcomed. If found any bug, issue or vulnerability, kindly consider reporting.  
                                Tech stack used to build this app is React JS, Express JS, MongoDB.
                        </p>

                        <div className = "about-access-buttons">
                                <Link to = "/signup">
                                        <button>Sign Up</button>
                                </Link>

                                <Link to = "/login">
                                        <button>Log In</button>
                                </Link>
                                
                                <a href = "https://github.com/itsomkathe/Snapsprout" target="_blank">
                                        <button id="about-github-button">
                                                <img src = {gitsrc} alt = "icon"/>
                                        </button>
                                </a>
                                        
                                
                        </div>

                        <p className = "about-license">
                                Copyright (C) 2021<br/><br/>

                                This program is free software: you can redistribute it and/or modify
                                it under the terms of the GNU General Public License as published by
                                the Free Software Foundation, either version 3 of the License, or
                                (at your option) any later version.<br/><br/>

                                This program is distributed in the hope that it will be useful,
                                but WITHOUT ANY WARRANTY; without even the implied warranty of
                                MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
                                GNU General Public License for more details.<br/><br/>

                                You should have received a copy of the GNU General Public License
                                along with this program.  If not, see   <a rel="noopener noreferrer" target = "_blank" href = "https://www.gnu.org/licenses">https://www.gnu.org/licenses</a>.
                        </p>

                        
                                
                </div>
        </>)
}