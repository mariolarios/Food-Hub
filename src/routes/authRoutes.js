const express = require("express");
const router = express.Router();

const { register, login, logout } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/docs.html");
});

module.exports = router;
