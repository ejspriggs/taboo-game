import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { discardCard, drawCard, joinGame, kickPlayer, leaveGame, pollGame } from '../../../utils/backend';

function PlayGame() {
    const [name, setName] = useState("");
    const [playerToken, setPlayerToken] = useState({ loaded: false });
    const [gameState, setGameState] = useState({ loaded: false });
    const [pollingLoop, setPollingLoop] = useState({ loaded: false });
    const [heldCard, setHeldCard] = useState({ loaded: false });

    const params = useParams();
    const gameToken = params.gameToken;

    function handleInputChange(event) {
        setName(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        joinGame(params.gameToken, name).then( ({ playerToken }) => {
            localStorage.setItem(`ptoken-${gameToken}`, playerToken);
            setPlayerToken({ data: playerToken, loaded: true });
        }).catch( () => {
            localStorage.removeItem(`ptoken-${gameToken}`);
        });
    }

    function loadGameState() {
        if (playerToken.loaded) {
            pollGame(gameToken, playerToken.data).then( polledState => {
                setGameState({ data: polledState, loaded: true });
                if (polledState.playerIsCardholder) {
                    setHeldCard({ data: polledState.cardHeld, loaded: true });
                } else {
                    setHeldCard({ loaded: false });
                }
            }).catch( () => {
                setGameState({ loaded: false });
                localStorage.removeItem(`ptoken-${gameToken}`);
                setPlayerToken({ loaded: false });
            });
        }
    }

    const joinGameForm = (
        <>
            <p>You can join this game!</p>
            <form
                id="myform"
                onSubmit={handleSubmit}
            >
                <input type="text" name="name" value={name} onChange={handleInputChange} placeholder="name" required />
            </form>
            <input
                type="submit"
                form="myform"
                value="Join!"
            />
        </>
    );

    useEffect( () => {
        if (pollingLoop.loaded === false) {
            setPollingLoop({
                data: setInterval(() => loadGameState(), 2000),
                loaded: true
            });
        }
        return () => {
            if (pollingLoop.loaded) {
                clearInterval(pollingLoop.data);
                setPollingLoop({ loaded: false })
            }
        };
    }, []);

    if (playerToken.loaded === false) {
        if (localStorage.getItem(`ptoken-${params.gameToken}`)) {
            // In this case, the user has been to the link before and already joined, so set the token in React.
            setPlayerToken({ data: localStorage.getItem(`ptoken-${params.gameToken}`), loaded: true });
        } else {
            // In this case, there's no local storage, and we haven't gotten the results of joining yet,
            // so send the form that lets the user join.
            return joinGameForm;
        }
    }
    
    // If we reach this position, we've got a token, so load the game info if it's not already
    // loaded, or display it if it's loaded.
    if (gameState.loaded === false) {
        loadGameState();
        return <p>Loading game state...</p>;
    }

    // If we reach this position, we have a token and we have game data, so
    // display the game data we have.  Also, make sure the timer is running.
    function handleDrawCard() {
        drawCard(params.gameToken, playerToken.data, gameState.data.currentTurn).then( (card) => {
            setHeldCard({ data: card, loaded: true });
            loadGameState();
        }).catch( () => {
            console.log("Draw failed, try again.");
        });
    }

    function handleDiscard() {
        discardCard(params.gameToken, playerToken.data, gameState.data.currentTurn).then( () => {
            setHeldCard({ loaded: false });
            loadGameState();
        }).catch( () => {
            console.log("Discard failed, try again.");
        });
    }

    function handleLeave() {
        leaveGame(gameToken, playerToken.data).then( () => {
            localStorage.removeItem(`ptoken-${gameToken}`);
            setPlayerToken({ loaded: false });
        });
    }

    function handleKickPlayer(playerName) {
        kickPlayer(gameToken, playerName).then( () => {
            loadGameState();
        }).catch( () => {
            console.log("Kick failed, try again.");
        });
    }

    const drawCardButton = (
        <button
            onClick={handleDrawCard}
            className=""
            disabled={gameState.loaded && gameState.data.cardholder}
            type="button"
        >
            Draw
        </button>
    );

    const discardButton = (
        <button
            onClick={handleDiscard}
            disabled={gameState.loaded && !gameState.data.playerIsCardholder}
            type="button"
        >
            Discard
        </button>
    );

    const leaveButton = (
        <button
            onClick={handleLeave}
            type="button"
        >
            Leave
        </button>
    )

    let cardMessage;
    if (heldCard.loaded) {
        cardMessage = (
            <>
                <p>Target: {heldCard.data.target}</p>
                <p>Blockers: {heldCard.data.blockers.join(", ")}</p>
            </>
        );
    } else {
        cardMessage = <p>No card held.</p>;
    }

    let manageUsers;
    if (gameState.loaded && gameState.data.owner) {
        manageUsers = (
            <>
                {gameState.data.players.map( player => (
                    <div
                        key={player}
                    >
                        <p>{player}</p>
                        <button
                            type="button"
                            onClick={() => handleKickPlayer(player)}
                        >
                            Kick
                        </button>
                    </div>
                ))}
            </>
        );
    } else {
        manageUsers = <p>Not game owner, so no user management.</p>;
    }

    return (
        <>
            <p>gameToken: {params.gameToken}</p>
            <p>playerToken: {playerToken.data}</p>
            <p>your name: {gameState.data.playerName}</p>
            <p>Player names: {gameState.data.players.join(", ")}</p>
            <p>{gameState.data.cardholder.length > 0 ? `${gameState.data.cardholder} is holding a card.` : "No one is holding a card."}</p>
            {cardMessage}
            <p>{drawCardButton} {discardButton} {leaveButton}</p>
            {manageUsers}
        </>
    );
}

export default PlayGame;