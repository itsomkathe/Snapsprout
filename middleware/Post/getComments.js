const mongoose = require("mongoose");
const Post = mongoose.model("Post");

module.exports = (req, res)=>{
        Post.findById(req.body.postID, 'comments')
                .populate("comments.postedBy", "_id username")
                .then(result=>{
                        return res.json(result);
                }).catch(err=>{
                        return res.json({error: err})
                })
}