const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const User = mongoose.model("User");

module.exports = (req, res) => {
    const { title, body, picURL } = req.body;
    if (!title || !body || !picURL) {
        return res.status(422).json({ error: "please add all the fields" });
    }
    req.user.password = undefined;
    const post = new Post({
        title: title,
        body: body,
        photo: picURL,
        postedBy: req.user,
    });

    post.save()
        .then((savedPost) => {
            User.findByIdAndUpdate(req.user._id, {
                $push: {posts: savedPost._id}
            }).then(result=>{
                res.json(savedPost)
            }).catch(err=>{
                
            })
            
        })
        .catch((err) => {
            res.json({error: err});
        });
};
