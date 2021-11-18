const mongoose = require("mongoose");
const Post = mongoose.model("Post");

module.exports = (req, res) => {
    Post.findByIdAndUpdate(
        req.body.postID,
        {
            $push: {
                comments: {
                    text: req.body.text,
                    postedBy: req.user._id,
                },
            },
        },
        {
            new: true,
        }
    )
        .populate("comments.postedBy", "_id name username")
        .then((result) => {
            return res.json(result);
        })
        .catch((err) => {
            return res.json({ error: err });
        });
};
