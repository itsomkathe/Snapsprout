const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;
const { MONGOURI } = require('./config/keys');

app.use(express.json({extended: false}));
app.use(express.urlencoded({extended: true}));

mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

mongoose.connection.on("connected", () => {
    console.log("Connected");
});

mongoose.connection.on("error", (err) => {
    console.log("Error", err);
});

require("./models/user");
require("./models/post");


const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
const userRoute = require("./routes/user");

if(process.env.NODE_ENV == "production"){
    app.use(express.static('client/build'));
    const path = require('path');
    app.get("*", (req,res)=>{
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}
app.use(authRoute);
app.use(postRoute);
app.use(userRoute);

app.listen(PORT, (req, res) => {
    console.log("server is running", PORT);
});
