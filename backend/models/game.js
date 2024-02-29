const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
    players: [{ name: String, playerToken: String }],
    cardholder: { type: String, required: true },
    currentTurn: { type: Number, required: true },
    deck: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Card'
    }]
});

module.exports = mongoose.model("Game", gameSchema);