const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('../../config/keys');


module.exports = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res
            .status(422)
            .json({ error: "Enter Valid email and password" });
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (!savedUser) {
                return res
                    .status(422)
                    .json({ error: "User does not exist, please sign up" });
            }

            bcrypt
                .compare(password, savedUser.password)
                .then((passwordMatched) => {
                    if (passwordMatched) {
                        const token = jwt.sign(
                            { _id: savedUser._id },
                            JWT_SECRET
                        );
                        
                        return res.status(200).json({
                            token: token,
                            user:{
                                name: savedUser.name,
                                email: savedUser.email,
                                username: savedUser.username,
                                id: savedUser._id,
                                image: savedUser.photo ? savedUser.photo : null
                            }
                        });
                    } else {
                        return res
                            .status(422)
                            .json({ error: "Wrong email or password" });
                    }
                })
                .catch((err) => {
                    return res
                    .status(422)
                    .json({ error: err });
                });
        })
        .catch((err) => {
            return res
            .status(422)
            .json({ error: err });
        });
};
