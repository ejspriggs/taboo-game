import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { discardCard, drawCard, joinGame, pollGame } from '../../../utils/backend';

function PlayGame() {
    const [playerToken, setPlayerToken] = useState({ loaded: false });
    const [name, setName] = useState("");
    const [gameState, setGameState] = useState({ loaded: false });
    const [pollingLoop, setPollingLoop] = useState({ loaded: false });
    const [heldCard, setHeldCard] = useState({ loaded: false });

    const params = useParams();

    function handleInputChange(event) {
        setName(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        joinGame(params.gameToken, name).then( ({ playerToken }) => {
            localStorage.setItem(`ptoken-${params.gameToken}`, playerToken);
            setPlayerToken({ data: playerToken, loaded: true });
        });
    }

    function loadGameState() {
        if (playerToken.loaded) {
            pollGame(params.gameToken, playerToken.data).then( polledState => {
                setGameState({ data: { ...polledState, cardholder: polledState.cardholder ? polledState.cardholder : "" }, loaded: true });
                setName(polledState.players.find( player => player.playerToken === playerToken ).name);
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
        return () => pollingLoop.loaded && clearInterval(pollingLoop.data);
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
    // display the game data we have.
    function handleDrawCard() {
        drawCard(params.gameToken, playerToken.data, gameState.data.currentTurn).then( (card) => {
            setHeldCard({ data: card, loaded: true });
        }).catch( () => {
            console.log("Draw failed, try again.");
        });
    }

    function handleDiscard() {
        discardCard(params.gameToken, playerToken.data, gameState.data.currentTurn).then( () => {
            setHeldCard({ loaded: false });
        }).catch( () => {
            console.log("Discard failed, try again.");
        });
    }

    const drawCardButton = (
        <button
            onClick={() => handleDrawCard()}
            disabled={gameState.loaded && gameState.data.cardholder}
            type="button"
        >
            Draw
        </button>
    );

    const discardButton = (
        <button
            onClick={() => handleDiscard()}
            disabled={gameState.loaded && gameState.data.cardholder !== name}
            type="button"
        >
            Discard
        </button>
    );

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

    return (
        <>
            <p>gameToken: {params.gameToken}</p>
            <p>playerToken: {playerToken.data}</p>
            <p>your name: {name}</p>
            <p>Player names: {gameState.data.players.map( player => {
                let result = player.name;
                if (player.owner) {
                    result = result + " (Owner)";
                }
                if (playerToken.data === player.playerToken) {
                    result = result + " (You)";
                }
                return result;
            }).join(", ")
            }</p>
            <p>{gameState.data.cardholder.length > 0 ? `${gameState.data.cardholder} is holding a card.` : "No one is holding a card."}</p>
            {cardMessage}
            <p>{drawCardButton}{discardButton}</p>
            <p>gameState.data: {JSON.stringify(gameState.data)}</p>
        </>
    );
}

export default PlayGame;