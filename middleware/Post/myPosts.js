const mongoose = require("mongoose");
const Post = mongoose.model("Post");

module.exports = (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name username")
        .then((posts) => {
            res.json(posts);
        })
        .catch((err) => {
            console.log(err);
        });
};
