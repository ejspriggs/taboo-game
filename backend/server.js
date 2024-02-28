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
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
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

const usersCtrl = require('./controllers/users');
app.use('/api/users', usersCtrl);

// Non-REST routes

app.get("/api", (req, res) => {
    res.send("This message was emitted by the backend.");
});

// Start server

app.listen(process.env.PORT, () => {
    console.log(`Express is listening on port ${process.env.PORT}.`);
});