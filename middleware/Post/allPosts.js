const mongoose = require("mongoose");
const Post = mongoose.model("Post");

module.exports = (req, res) => {
    Post.find()
        .populate("postedBy", "_id name username"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         )
        .then((allPosts) => {
            //console.log(allPosts);
            res.json(allPosts);
        })
        .catch((err) => {
            console.log(err);
        });
};
