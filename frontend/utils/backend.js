import axios from "axios";

export async function signUp(emailPassword) {
    const { data } = await axios.post('/api/users/signup', emailPassword);
    return data;
}

export async function signIn(emailPassword) {
    const { data } = await axios.post('/api/users/login', emailPassword);
    return data;
}

export async function getCards() {
    // TODO: Pagination
    const authHeader = { headers: { 'Authorization': localStorage.getItem('userToken') } };
    const { data } = await axios.get('/api/cards', authHeader);
    return data;
}

export async function getCard(cardId) {
    const authHeader = { headers: { 'Authorization': localStorage.getItem('userToken') } };
    const { data } = await axios.get(`/api/cards/${cardId}`, authHeader);
    return data;
}

export async function addCard(cardInfo) {
    const authHeader = { headers: { 'Authorization': localStorage.getItem('userToken') } };
    const { data } = await axios.post('/api/cards', cardInfo, authHeader);
    return data;
}

export async function editCard(cardId, cardInfo) {
    const authHeader = { headers: { 'Authorization': localStorage.getItem('userToken') } };
    const { data } = await axios.put(`/api/cards/${cardId}`, cardInfo, authHeader);
    return data;
}

export async function deleteCard(cardId) {
    const authHeader = { headers: { 'Authorization': localStorage.getItem('userToken') } };
    const { data } = await axios.delete(`/api/cards/${cardId}`, authHeader);
    return data;
}

export async function getGames() {
    // Get a list of games, if logged in.
    const authHeader = { headers: { 'Authorization': localStorage.getItem('userToken') } };
    const { data } = await axios.get(
        '/api/games',
        authHeader
    );
    return data;
}

export async function addGame(ownerName, creatorEmail) {
    // Create a game with one player, and return the game token and the
    // player token, for an authorized user.
    // Body:
    //     ownerName: string
    // Returned object attributes:
    //     gameToken: string
    //     playerToken: string
    const authHeader = { headers: { 'Authorization': localStorage.getItem('userToken') } };
    const { data } = await axios.post(
        '/api/games',
        { ownerName: ownerName, creatorEmail: creatorEmail },
        authHeader
    );
    return data;
}

export async function deleteGame(gameToken) {
    // Delete the game with the given token, if it is owned by the logged-in user.
    const authHeader = { headers: { 'Authorization': localStorage.getItem('userToken') } };
    const { data } = await axios.delete(
        `/api/games/${gameToken}`,
        authHeader
    );
    return data;
}

export async function takeOverGame(gameToken) {
    // Return the token for the given game's superuser, if the logged-in user is the owner of the game.
    const authHeader = { headers: { 'Authorization': localStorage.getItem('userToken') } };
    const { data } = await axios.get(
        `/api/games/${gameToken}/superuser`,
        authHeader
    );
    return data;
}

export async function kickPlayer(gameToken, playerName) {
    // Kick the player whose name is given, if the logged-in user is the owner of the game.
    const authHeader = { headers: { 'Authorization': localStorage.getItem('userToken') } };
    const { data } = await axios.delete(
        `/api/games/${gameToken}/players/${playerName}`,
        authHeader
    );
    return data;
}

export async function leaveGame(gameToken, playerToken) {
    // Kick the player whose token is given.
    const { data } = await axios.delete(
        `/api/games/${gameToken}/${playerToken}`
    );
    return data;
}

export async function joinGame(gameToken, playerName) {
    // Join a game whose token you know, and get a player token for that game.
    // Body:
    //     playerName: string
    // Returned object attributes:
    //     playerToken: string
    const { data } = await axios.post(
        `/api/games/${gameToken}`,
        { playerName: playerName }
    );
    return data;
}

export async function pollGame(gameToken, playerToken) {
    // Check the state of a game whose token you know, if you have a
    // player token for that game.
    // Returned object attributes:
    //     currentTurn: number
    //     players: array of strings
    //     cardholder: a player name, or the empty string
    //     cardsLeft: number
    const { data } = await axios.get(`/api/games/${gameToken}/${playerToken}`);
    return data;
}

export async function drawCard(gameToken, playerToken, currentTurn) {
    // Draw a card in a game whose token you know, if:
    // 1) you have a player token for that game
    // 2) you are correct about the current turn number
    // 3) no player of that game is currently holding a card
    // Returns data for the drawn card, or an error.  If successful, makes
    // the player whose token was given the card-holder for the game
    // whose token was given, pops a card from the deck, and increments the
    // turn number.
    // Returned object attributes:
    //     target: string
    //     blockers: array of string
    //     bgColor: string
    const { data } = await axios.post(`/api/games/${gameToken}/${playerToken}/${currentTurn}`, {});
    return data;
}

export async function discardCard(gameToken, playerToken, currentTurn) {
    // Discard the card you are holding in a game whose token you know, if:
    // 1) you have a player token for that game
    // 2) you are correct about the current turn number
    // 3) the player whose token was given is the cardholder in that game
    // Returns success, or an error.  If successful, clears the card-holder
    // for the game whose token was given, and increments the turn number.
    const { data } = await axios.delete(`/api/games/${gameToken}/${playerToken}/${currentTurn}`, {});
    return data;
}