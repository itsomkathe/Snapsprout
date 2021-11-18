const mongoose = require("mongoose");
const Post = mongoose.model("Post");

module.exports = (req, res)=>{
        Post.findById(req.params.postid)
        .then(result=>{
                res.json(result);
        }).catch(err=>{
                res.status(404).json({error:err});
        })
}