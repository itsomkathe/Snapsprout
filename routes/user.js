const express = require("express");
const router = express.Router();

const getProfile = require('../middleware/User/getProfile');
const requireLogin = require('../middleware/Authentication/requireLogIn');
const follow = require('../middleware/User/follow');
const unfollow = require('../middleware/User/unfollow');
const getStats = require('../middleware/User/getStats');
const searchUser = require('../middleware/User/searchUser');
const editProfile = require('../middleware/User/editProfile');

router.get("/profile/:username", requireLogin,  getProfile);

router.put("/follow", requireLogin, follow);

router.put("/unfollow", requireLogin, unfollow);

router.post("/getstats", requireLogin, getStats);

router.post("/api/editprofile", requireLogin, editProfile);

router.post("/api/search-user", searchUser);

module.exports = router;