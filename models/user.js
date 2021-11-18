const mongoose = require('mongoose');
const { ObjectId } = require("bson");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    username:{
        type:String,
        required: true
    }, 
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    photo: {
        type: String,
    },
    bio:{
        type: String
    },
    posts: [{type: ObjectId, ref: "Post"}],
    followers: [{type: ObjectId, ref: "User"}],
    following: [{type: ObjectId, ref: "User"}],
});

mongoose.model("User", userSchema);