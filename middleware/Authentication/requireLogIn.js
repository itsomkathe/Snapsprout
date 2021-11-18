const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('../../config/keys');
const user = mongoose.model("User");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: "You must be logged in" });
    }
    const token = authorization.split(" ")[1];
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "You must be logged in" });
        }

        const { _id } = payload;
        //console.log(_id)
        user.findById(_id).then((userdata) => {
            //console.log(userdata)
            req.user = userdata;
            next();
        });
    });
};
