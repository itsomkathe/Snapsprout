const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res) => {
    if (req.body.image) {
        User.findByIdAndUpdate(req.user._id, {
            photo: req.body.image,
            name: req.body.name,
            bio: req.body.bio,
        }, 
        { new: true })
            .then((data) => {
                return res.json(data);
            })
            .catch((err) => {
                return res.json({ error: err });
            });
    } else {
        User.findByIdAndUpdate(
            req.user._id,
            {
                photo: null,
                name: req.body.name,
                bio: req.body.bio,
            },
            { new: true }
        )
            .then((data) => {
                return res.json(data);
            })
            .catch((err) => {
                return res.json({ error: err });
            });
    }
};
