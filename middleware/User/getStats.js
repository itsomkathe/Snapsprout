const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res)=>{
        User.findOne({_id: req.body.id})
        .then(result=>{
                const stats = {
                        posts: result.posts.length,
                        followers: result.followers.length,
                        following: result.following.length
                }

                res.json(stats);
        }).catch(err=>{
                res.status(422).json({error: err})
        })

}