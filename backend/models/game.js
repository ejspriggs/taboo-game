const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
    players: [{
        name: { type: String, required: true },
        playerToken: { type: String, required: true },
        owner: { type: Boolean, required: true }
    }],
    cardholder: { type: String },
    currentTurn: { type: Number, required: true },
    deck: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Card'
    }],
    gameToken: { type: String, required: true },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    creatorEmail: { type: String, required: true }
});

module.exports = mongoose.model("Game", gameSchema);