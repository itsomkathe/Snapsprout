const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res) => {
    
    User.findByIdAndUpdate(
        req.body.followID,
        {
            $push: { followers: req.user._id },
        },
        { new: true }
    )
        .then((result) => {
            User.findByIdAndUpdate(
                req.user._id,
                {
                    $push: { following: req.body.followID },
                },
                { new: true }
            )
                .then((result2) => {
                    return res.json(result2);
                })
                .catch((err) => {
                    User.findByIdAndUpdate(
                        req.body.followID,
                        {
                            $pull: { followers: req.user._id },
                        },
                        { new: true }
                    ).exec();
                    return res.status(422).json({ error: err });
                });
        })
        .catch((err) => {
            return res.status(422).json({ error: err });
        });
};
