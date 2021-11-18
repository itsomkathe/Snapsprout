const mongoose = require("mongoose");
const User = mongoose.model("User");
const Post = mongoose.model("Post");

module.exports = (req,res)=>{
        const pattern = new RegExp('^'+req.body.query);
        User.find({username: {$regex: pattern}})
        .then(result=>{
                res.json({result})
        }).catch(err=>{
                res.status(404).json({error: "No result found"})
        })
}