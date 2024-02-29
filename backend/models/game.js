const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
    players: [{
        name: { type: String, required: true },
        playerToken: { type: String, required: true }
    }],
    cardholder: { type: String, required: true },
    currentTurn: { type: Number, required: true },
    deck: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Card'
    }]
});

module.exports = mongoose.model("Game", gameSchema);