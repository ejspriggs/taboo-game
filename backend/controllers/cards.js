const express = require("express");
const router = express.Router();

const jwt = require("jwt-simple");
const jwtConfig = require("../../jwt.config");

const models = require("../models");
    const cardModel = models.Card;

const authMiddleware = (req, res, next) => {
    console.log(req.headers);
    const token = req.headers.authorization;
    if (token) {
        console.log(token);
        try {
            const decodedToken = jwt.decode(token, jwtConfig.jwtSecret);
            req.user = decodedToken;
            next();
        } catch (err) {
            console.log("invalid token");
            res.status(401).json({ message: "Invalid token" });
        }
    } else {
        console.log("missing or invalid header");
        res.status(401).json({ message: "Missing or invalid authorization header" });
    }
};

router.get("/", authMiddleware, (req, res) => {
    cardModel.find({}).then( (cards) => {
        res.send(cards);
    });
});

router.post("/", authMiddleware, (req, res) => {
    cardModel.create({
        target: req.body.target,
        blockers: [
            req.body.blocker1,
            req.body.blocker2,
            req.body.blocker3,
            req.body.blocker4,
            req.body.blocker5
        ],
        bgColor: req.body.bgColor,
        author: req.user.id
    }).then( result => res.json(result) );
});

router.get("/:cardId", authMiddleware, (req, res) => {
    console.log("getting card: " + req.params.cardId);
    cardModel.findById(req.params.cardId).then( card => {
        res.json(card);
    });
});

router.put("/:cardId", authMiddleware, (req, res) => {
    cardModel.findByIdAndUpdate(req.params.cardId, {
        target: req.body.target,
        blockers: [
            req.body.blocker1,
            req.body.blocker2,
            req.body.blocker3,
            req.body.blocker4,
            req.body.blocker5
        ],
        bgColor: req.body.bgColor,
        author: req.user.id
    }).then( result => res.json(result) );
});

router.delete("/:cardId", authMiddleware, (req, res) => {
    cardModel.findByIdAndDelete(req.params.cardId).then( () => {
        res.json({ deletedComment: req.params.cardId });
    });
});

module.exports = router;