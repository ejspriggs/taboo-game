import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { discardCard, drawCard, joinGame, kickPlayer, leaveGame, pollGame } from '../../../utils/backend';

function PlayGame() {
    const [name, setName] = useState("");
    const [playerToken, setPlayerToken] = useState({ loaded: false });
    const [gameState, setGameState] = useState({ loaded: false });
    const [pollingLoop, setPollingLoop] = useState({ loaded: false });

    const params = useParams();

    function handleInputChange(event) {
        setName(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        localStorage.removeItem(`ptoken-${params.gameToken}`)
        joinGame(params.gameToken, name).then( ({ playerToken }) => {
            localStorage.setItem(`ptoken-${params.gameToken}`, playerToken);
            setPlayerToken({ data: playerToken, loaded: true });
        }).catch( () => {
            localStorage.removeItem(`ptoken-${params.gameToken}`);
            setPlayerToken({ loaded: false });
        });
    }

    const joinGameForm = <div className="m-2 p-2 rounded-lg border-black border-2 bg-floral-white max-w-72">
        <p>Join game as:</p>
        <form id="myform" onSubmit={handleSubmit}>
            <input
                type="text"
                name="name"
                value={name}
                onChange={handleInputChange}
                placeholder="your name"
                required
            />
        </form>
        <input
            type="submit"
            form="myform"
            className="font-medium text-sm rounded-lg text-white bg-blue-500 hover:bg-blue-700 hover:cursor-pointer p-2"
            value="Join"
        />
    </div>;

    function loadGameState() {
        if (playerToken.loaded) {
            pollGame(params.gameToken, playerToken.data).then( polledState => {
                setGameState({ data: polledState, loaded: true });
            }).catch( () => {
                setPlayerToken({ loaded: false });
                localStorage.removeItem(`ptoken-${params.gameToken}`);
                setGameState({ loaded: false });
            });
        }
    }

    useEffect( () => {
        if (pollingLoop.loaded === false) {
            setPollingLoop({
                data: setInterval(loadGameState, 2000),
                loaded: true
            });
        }
        return () => {
            if (pollingLoop.loaded) {
                clearInterval(pollingLoop.data);
                setPollingLoop({ loaded: false })
            }
        };
    }, [params.gameToken, playerToken]);

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
        drawCard(params.gameToken, playerToken.data, gameState.data.currentTurn).then( () => {
            loadGameState();
        }).catch( () => {
            console.log("Draw failed, try again.");
        });
    }

    function handleDiscard() {
        discardCard(params.gameToken, playerToken.data, gameState.data.currentTurn).then( () => {
            loadGameState();
        }).catch( () => {
            console.log("Discard failed, try again.");
        });
    }

    function handleLeave() {
        leaveGame(params.gameToken, playerToken.data).then( () => {
            localStorage.removeItem(`ptoken-${params.gameToken}`);
            setPlayerToken({ loaded: false });
        }).catch( () => {
            localStorage.removeItem(`ptoken-${params.gameToken}`);
            setPlayerToken({ loaded: false });
        });
    }

    function handleKickPlayer(playerName) {
        kickPlayer(params.gameToken, playerName).then( () => {
            loadGameState();
        }).catch( () => {
            console.log("Kick failed, try again.");
        });
    }

    const drawEnabled = gameState.loaded && gameState.data.cardholder.length === 0 && gameState.data.deckLeft > 0;
    const drawCardButton = (
        <button
            onClick={handleDrawCard}
            className={"text-white font-medium rounded-lg text-sm p-2" + (drawEnabled ? " bg-blue-500 hover:bg-blue-700" : " bg-slate-500")}
            disabled={!drawEnabled}
            type="button"
        >
            Draw
        </button>
    );

    const discardEnabled = gameState.loaded && gameState.data.playerIsCardholder;
    const discardButton = (
        <button
            onClick={handleDiscard}
            className={"text-white font-medium rounded-lg text-sm p-2" + (discardEnabled ? " bg-green-500 hover:bg-green-700" : " bg-slate-500")}
            disabled={!discardEnabled}
            type="button"
        >
            Discard
        </button>
    );

    const leaveButton = (
        <button
            onClick={handleLeave}
            className={"font-medium rounded-lg text-sm p-2" + ((!gameState.loaded || !gameState.data.owner) ? " text-black bg-yellow-400 hover:bg-yellow-600" : " text-white bg-slate-500")}
            disabled={gameState.loaded && gameState.data.owner}
            type="button"
        >
            Leave
        </button>
    )

    let cardMessage;
    if (gameState.loaded && gameState.data.playerIsCardholder) {
        cardMessage = <div className="text-center mx-auto my-auto">
            <div className={"text-center text-xl mx-auto p-2 rounded-lg border-2 border-white atkinson-caps min-w-48 bg-" + gameState.data.cardHeld.bgColor}>
                <p>{gameState.data.cardHeld.target}</p>
                <hr />
                {gameState.data.cardHeld.blockers.map( blocker => (
                    <p key={blocker}>{blocker}</p>
                ))}
            </div>
        </div>;
    } else if (gameState.loaded && gameState.data.cardholder.length > 0) {
        cardMessage = <p>{gameState.data.cardholder} is holding a card.</p>;
    } else {
        cardMessage = <p>No card held.</p>;
    }

    let manageUsers;
    if (gameState.loaded && gameState.data.owner) {
        manageUsers = (
            <div className="border-2 border-black bg-floral-white rounded-lg m-4 p-4 flex flex-col flex-start min-w-96 max-w-96">
                <p className="text-center">User Management</p>
                {gameState.data.players.filter(player => player != gameState.data.playerName).map( player => (
                    <div key={player} className="bg-white rounded-lg border-2 border-black flex flex-row justify-between items-center p-1 m-1">
                        <div>{player}</div>
                        <button
                            type="button"
                            className="text-white bg-red-400 hover:bg-red-600 font-medium rounded-lg text-sm p-2"
                            onClick={() => handleKickPlayer(player)}
                        >
                            Kick
                        </button>
                    </div>
                ))}
            </div>
        );
    } else {
        manageUsers = <></>;
    }

    return (
        <>
            <div className="border-2 border-black bg-floral-white rounded-lg m-4 p-4">
                <p>gameToken: {params.gameToken}</p>
                <p>playerToken: {playerToken.data}</p>
                <p>Players: {gameState.data.players.join(", ")}</p>
                <p>Your Name: {gameState.data.playerName}</p>
                <p>Deck left: {gameState.data.deckLeft}</p>
            </div>
            <div className="flex flex-col md:flex-row flex-start">
                <div className="flex flex-col justify-between border-2 border-black bg-floral-white rounded-lg m-4 p-4 min-h-96 min-w-96 max-w-96">
                    {cardMessage}
                    <p className="flex flex-row justify-between">
                        {drawCardButton} {discardButton} {leaveButton}
                    </p>
                </div>
                {manageUsers}
            </div>
        </>
    );
}

export default PlayGame;