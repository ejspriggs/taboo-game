const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const jwt = require("jwt-simple");
const jwtConfig = require("../../jwt.config");

const models = require("../models");
    const cardModel = models.Card;
    const gameModel = models.Game;

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        try {
            const decodedToken = jwt.decode(token, jwtConfig.jwtSecret);
            req.user = decodedToken;
            next();
        } catch (err) {
            res.status(401).json({ message: "Invalid token" });
        }
    } else {
        res.status(401).json({ message: "Missing or invalid authorization header" });
    }
};

router.get("/", authMiddleware, (req, res) => {
    gameModel.find({}).then( (games) => {
        res.send(games);
    });
});

function generateToken(length) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let ret = "";
    for (let i = 0; i < length; i++) {
        ret = ret + chars[Math.floor(Math.random() * chars.length)];
    }
    return ret;
}

router.post("/", authMiddleware, (req, res) => {
    cardModel.find({}).then( (allCards) => {
        // TODO: Shuffle.
        const allCardIds = allCards.map( Card => Card._id );
        let gameToken = generateToken(16);
        let playerToken = generateToken(8);
        const newGame = {
            players: [{
                name: req.body.ownerName,
                playerToken: playerToken,
                owner: true
            }],
            cardholder: "none",
            currentTurn: 0,
            deck: allCardIds,
            gameToken: gameToken
        };
        console.log(newGame);
        gameModel.create(newGame).then( () => {
            res.json({ gameToken: gameToken, playerToken: playerToken });
        });
    });
});

router.post("/:gameToken", (req, res) => {
    gameModel.findOne({ gameToken: req.params.gameToken }).then( game => {
        if (game === null) {
            // Game doesn't exist, hence it can't be joined.
            res.status(404).send(`game token "${req.params.gameToken}" not found`);
        } else {
            let foundPlayer = game.players.find( player => player.name === req.body.playerName );
            if (foundPlayer) {
                // Name already in use, reject.
                res.status(401).send(`name "${req.body.playerName}" is already in use in game with token "${req.params.gameToken}"`);
            } else {
                // Generate token, add player to list, and send token to frontend.
                const playerToken = generateToken(8);
                game.players.push({ name: req.body.playerName, playerToken: playerToken, owner: false });
                game.save().then( () => res.json({ playerToken: playerToken }) );
            }
        }
    });
});

router.get("/:gameToken/:playerToken", (req, res) => {
    gameModel.findOne({ gameToken: req.params.gameToken }).then( game => {
        if (game === null) {
            // Game doesn't exist, hence it can't be polled.
            res.status(404).send(`game token "${req.params.gameToken}" not found`);
        } else {
            // Send back game data.
            res.json(game);
        }
    });
});

module.exports = router;