import React from "react";
import { Link } from "react-router-dom";
import "./Grid.css";
import GridPhoto from "./GridPhoto";


export default function Grid({posts}) {
    
    return (
        <>
            <div className="parentGrid">
                {posts.map((item, idx)=>{
                        return (
                            <Link key = {idx} to = {`/post/${item._id}`}>
                                <GridPhoto key = {idx} imgsrc = {item.photo}/>
                            </Link>
                        )
                })}
            </div>
        </>
    );
}
