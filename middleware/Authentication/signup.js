const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");

module.exports = (req, res) => {
    const { name, username, email, password } = req.body;
    //console.log(req.body);
    if (!name || !username || !email || !password) {
        return res.status(422).json({ error: "Please add all the details" });
    }

    User.findOne({ $or: [{ email: email }, { username: username }] })
        .then((savedUser) => {
            if (savedUser) {
                //console.log(savedUser);
                return res.status(422).json({ error: "User Already Exists" });
            }

            //console.log(savedUser);

            bcrypt
                .hash(password, 12)
                .then((hashedPassword) => {
                    const user = new User({
                        name: name,
                        username: username,
                        email: email,
                        password: hashedPassword,
                    });
                    user.save()
                        .then((user) => {
                            res.json({ message: "User Saved Successfully" });
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
};
