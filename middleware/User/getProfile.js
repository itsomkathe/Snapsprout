const mongoose = require("mongoose");
const User = mongoose.model("User");
const Post = mongoose.model("Post");

module.exports = (req, res) => {
    User.findOne({ username: req.params.username})
        .populate("posts")
        .select("-password")
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            return res.status(404).json({ error: "User Not Found" });
        });
};

