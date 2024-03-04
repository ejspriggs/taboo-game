const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const jwt = require("jwt-simple");
const jwtConfig = require("../../jwt.config");

const models = require("../models");
    const cardModel = models.Card;
    const gameModel = models.Game;

function generateToken(length) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let ret = "";
    for (let i = 0; i < length; i++) {
        ret = ret + chars[Math.floor(Math.random() * chars.length)];
    }
    return ret;
}
    
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

router.post("/", authMiddleware, (req, res) => {
    cardModel.find({}).then( (allCards) => {
        const allCardIds = allCards.map( Card => Card._id );

        // Fisher-Yates shuffle, via Durstenfeld and Knuth
        let swapspace;
        for (let i = 0; i < allCardIds.length - 1; i++) {
            const j = Math.floor(Math.random() * (allCardIds.length - i));
            swapspace = allCardIds[i];
            allCardIds[i] = allCardIds[i + j];
            allCardIds[i + j] = swapspace;
        }

        let gameToken = generateToken(23); // GUID-ish, ~131 bits
        let playerToken = generateToken(8);
        const newGame = {
            players: [{
                name: req.body.ownerName,
                playerToken: playerToken,
                owner: true
            }],
            cardholder: "",
            currentTurn: 0,
            deck: allCardIds,
            gameToken: gameToken,
            creator: req.user.id,
            creatorEmail: req.body.creatorEmail
        };
        gameModel.create(newGame).then( () => {
            res.json({ gameToken: gameToken, playerToken: playerToken });
        });
    });
});

router.delete("/:gameToken", authMiddleware, (req, res) => {
    gameModel.findOne({ gameToken: req.params.gameToken }).then( game => {
        if (game === null) {
            res.status(404).send(`game token "${req.params.gameToken}" not found`);
        } else {
            if (game.creator == req.user.id) {
                gameModel.deleteOne({ gameToken: req.params.gameToken }).then( () => {
                    res.json({ message: "success" });
                }).catch( () => {
                    res.status(500).send("Unable to delete.");
                })
            } else {
                res.status(401).send("This game isn't yours!");
            }
        }
    });
});

router.get("/:gameToken/superuser", authMiddleware, (req, res) => {
    gameModel.findOne({ gameToken: req.params.gameToken }).then( game => {
        if (game === null) {
            res.status(404).send(`game token "${req.params.gameToken}" not found`);
        } else {
            if (game.creator == req.user.id) {
                // Return the superuser playerToken to be set in localStorage
                const foundPlayer = game.players.find( player => player.owner );
                res.json({ playerToken: foundPlayer.playerToken });
            } else {
                res.status(401).send("This game isn't yours!");
            }
        }
    });
});

router.delete("/:gameToken/players/:playerName", authMiddleware, (req, res) => {
    gameModel.findOneAndUpdate(
        { gameToken: req.params.gameToken },
        { $pull: { players: { name: req.params.playerName } } }
    ).then( () => {
        res.json({ message: "success" });
    }).catch( () => {
        res.status(404).send("Couldn't find game");
    });
});

router.delete("/:gameToken/:playerToken", (req, res) => {
    gameModel.findOneAndUpdate(
        { gameToken: req.params.gameToken },
        { $pull: { players: { playerToken: req.params.playerToken } } }
    ).then( () => {
        res.json({ message: "success" });
    }).catch( () => {
        res.status(404).send("Couldn't find game.");
    });
});

router.post("/:gameToken", (req, res) => {
    gameModel.findOne({ gameToken: req.params.gameToken }).then( game => {
        if (game === null) {
            // Game doesn't exist, hence it can't be joined.
            res.status(404).send(`game token "${req.params.gameToken}" not found`);
        } else {
            const foundPlayer = game.players.find( player => player.name === req.body.playerName );
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
            res.status(404).json({ invalidGameToken: true });
        } else {
            let playerInGame = false;
            let playerIsOwner;
            let playerName;
            let players = [];
            for (let player of game.players) {
                players.push(player.name);
                if (player.playerToken == req.params.playerToken) {
                    playerInGame = true;
                    playerName = player.name;
                    playerIsOwner = player.owner;
                }
            }
            if (!playerInGame) {
                res.status(404).json({ invalidPlayerToken: true });
            } else {
                if (playerName === game.cardholder) {
                    cardModel.findById(game.deck[game.deck.length - 1]).then( card => {
                        if (card === null) {
                            card = {
                                target: "--deleted--",
                                blockers: [
                                    "discard",
                                    "this",
                                    "card",
                                    "now,",
                                    "please"
                                ],
                                bgColor: "federal-blue",
                                author: null
                            };
                        }
                        res.json({
                            players: players,
                            cardholder: game.cardholder ? game.cardholder : "",
                            currentTurn: game.currentTurn,
                            owner: playerIsOwner,
                            playerName: playerName,
                            deckLeft: game.deck.length,
                            playerIsCardholder: true,
                            cardHeld: card
                        });
                    });
                } else {
                    res.json({
                        players: players,
                        cardholder: game.cardholder ? game.cardholder : "",
                        currentTurn: game.currentTurn,
                        owner: playerIsOwner,
                        playerName: playerName,
                        deckLeft: game.deck.length,
                        playerIsCardholder: false
                    });
                }
            }
        }
    });
});

router.post("/:gameToken/:playerToken/:currentTurn", (req, res) => {
    const currentTurn = parseInt(req.params.currentTurn);
    gameModel.findOne({ gameToken: req.params.gameToken }).then( game => {
        if (game === null) {
            // Game doesn't exist, hence no card can be drawn.
            res.status(404).send(`game token "${req.params.gameToken}" not found`);
        } else {
            // Game exists, so verify the player token and turn number,
            // and that nobody is already holding a card, or we are, and that
            // there is a card left.
            const player = game.players.find( player => (player.playerToken === req.params.playerToken) );
            if (player &&
                currentTurn === game.currentTurn &&
                (!game.cardholder || game.cardholder === player.name) &&
                game.deck.length > 0
            ) {
                // We're doing the draw, so read from the end, but leave it there.
                // We'll pop that one on discard.  This design means that you can
                // re-draw the card you're holding, if you rejoin a game where you are
                // the cardholder.
                // If the player was already the cardholder, don't change it.  If there
                // was no cardholder, make the player the cardholder.  Either way,
                // increment the turn number.
                game.cardholder = player.name;
                game.currentTurn++;
                game.save().then( () => {
                    const lastCardId = game.deck.slice(-1)[0];
                    cardModel.findById(lastCardId).then( lastCard => res.json(lastCard) ).catch( () => {
                        res.status(500).send("Couldn't draw card.");
                    });
                }).catch( () => {
                    res.status(500).send("Couldn't update game in database.");
                });
            } else {
                res.status(401).send(`attempt to draw is invalid`);
            }
        }
    });
});

router.delete("/:gameToken/:playerToken/:currentTurn", (req, res) => {
    const currentTurn = parseInt(req.params.currentTurn);
    gameModel.findOne({ gameToken: req.params.gameToken }).then( game => {
        if (game === null) {
            res.status(404).send(`game token "${req.params.gameToken}" not found`);
        } else {
            const player = game.players.find( player => (player.playerToken === req.params.playerToken) );
            if (player &&
                currentTurn === game.currentTurn &&
                game.cardholder === player.name &&
                game.deck.length > 0
            ) {
                game.cardholder = "";
                game.currentTurn++
                game.deck.pop();
                game.save().then( () => {
                    res.json({ message: "success" });
                }).catch( () => {
                    res.status(500).send("Couldn't update game in database.");
                })
            } else {
                console.log(player);
                console.log(currentTurn);
                console.log(game.currentTurn);
                console.log(game.deck.length);
                res.status(401).send(`attempt to discard is invalid`);
            }
        }
    });
});

module.exports = router;