const jwt = require("jwt-simple");
const express = require("express");
const router = express.Router();
const db = require("../models");
const config = require("../../jwt.config");

router.post("/signup", (req, res) => {
    db.User.create(req.body).then( (user) => {
        const token = jwt.encode({ id: user.id }, config.jwtSecret);
        res.json({ token: token });
    }).catch( (error) => {
        res.status(401).json({ message: `Signup error: ${error.message}` });
    });
});

router.post("/login", async (req, res) => {
    const foundUser = await db.User.findOne({ email: req.body.email });

    if (foundUser && foundUser.password === req.body.password) {
        const token = jwt.encode({ id: foundUser.id }, config.jwtSecret);
        res.json({ token: token, email: foundUser.email });
    } else {
        res.status(401).json({ message: "Could not find user with that email/password." });
    }
});

module.exports = router;