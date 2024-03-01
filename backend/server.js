// External requires

require("dotenv").config();
const path = require("path");
const express = require("express");
let livereload = undefined;
let connectLivereload = undefined;
if (process.env.ON_HEROKU === "false") {
    console.log("processing dev-only require() statements...");
    livereload = require("livereload");
    connectLivereload = require("connect-livereload");
}

// Internal requires

const usersController = require("./controllers/users");
const cardsController = require("./controllers/cards");
const gamesController = require("./controllers/games");
const models = require("./models/index");
    const userModel = models.userModel;
    const cardModel = models.cardModel;
    const gameModel = models.gameModel;

// Usual express.js setup

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let livereloadServer = undefined;
if (process.env.ON_HEROKU === "false") {
    console.log("Processing dev-only liveload and connect-livereload configuration.");
    livereloadServer = livereload.createServer();
    livereloadServer.server.once("connection", () => {
        setTimeout(() => {
            livereloadServer.refresh("/");
        }, 100);
    });
    app.use(connectLivereload());
}

// Mount controllers

app.use('/api/users', usersController);
app.use('/api/cards', cardsController);
app.use('/api/games', gamesController);

// Non-REST routes

app.get("/api", (req, res) => {
    res.send("This message was emitted by the backend.");
});

// Start server

app.listen(process.env.PORT, () => {
    console.log(`Express is listening on port ${process.env.PORT}.`);
});