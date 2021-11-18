const express = require("express");
const router = express.Router();

const login = require('../middleware/Authentication/login');
const signup = require('../middleware/Authentication/signup');

router.post("/signup", signup);

router.post("/login", login);

module.exports = router;
