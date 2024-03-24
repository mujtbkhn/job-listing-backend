const express = require("express");
const { registeredUser, loginUser } = require("../controllers/user");
const router = express.Router()


router.post("/register", registeredUser);
router.post("/login", loginUser);

module.exports = router