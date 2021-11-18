const mongoose = require('mongoose');
const Post = mongoose.model("Post");

module.exports = (req, res)=>{
        Post.findByIdAndUpdate(req.body.postID, {
                $pull:{likes:req.user._id}
        },{
                new: true
        }).then(result=>{
                return res.json(result);
        }).catch(err=>{
                return res.json({error: err})
        })
}