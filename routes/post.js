const express = require("express");
const router = express.Router();

const requireLogin = require("../middleware/Authentication/requireLogIn");
const createPost = require('../middleware/Post/createPost');
const allPosts = require('../middleware/Post/allPosts');
const myPosts = require('../middleware/Post/myPosts');
const likePost = require('../middleware/Post/likePost');
const unlikePost = require('../middleware/Post/unlikePost');
const individualPost = require('../middleware/Post/individualPost');
const comment = require('../middleware/Post/comment');
const getComments = require('../middleware/Post/getComments');

router.post("/createpost", requireLogin, createPost);

router.get("/allposts", requireLogin, allPosts);

router.get("/myposts", requireLogin, myPosts);

router.put("/likepost", requireLogin, likePost);

router.put("/unlikepost", requireLogin, unlikePost);

router.put("/comment", requireLogin,comment);

router.post("/getcomments", getComments);

router.get("/api/post/:postid", requireLogin, individualPost);

module.exports = router;
