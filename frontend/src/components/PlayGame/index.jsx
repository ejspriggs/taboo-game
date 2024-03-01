import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { joinGame, pollGame } from '../../../utils/backend';

function PlayGame() {
    const [playerToken, setPlayerToken] = useState({ loaded: false });
    const [name, setName] = useState("");
    const [gameState, setGameState] = useState({ loaded: false });
    const [pollingLoop, setPollingLoop] = useState({ loaded: false });

    const params = useParams();

    function handleInputChange(event) {
        setName(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        joinGame(params.gameToken, name).then( ({ playerToken }) => {
            localStorage.setItem("playerToken", playerToken);
            setPlayerToken({ data: playerToken, loaded: true });
        });
    }

    function loadGameState() {
        if (playerToken.loaded) {
            pollGame(params.gameToken, playerToken.data).then( polledState => {
                setGameState({ data: polledState, loaded: true });
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
        if (localStorage.getItem("playerToken")) {
            // In this case, the user has been to the link before and already joined, so set the token in React.
            setPlayerToken({ data: localStorage.getItem("playerToken"), loaded: true });
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
    return (
        <>
            <h1>This is the PlayGame component.</h1>
            <p>gameToken: {params.gameToken}</p>
            <p>playerToken: {playerToken.data}</p>
            <p>gameState.data: {JSON.stringify(gameState.data)}</p>
        </>
    );
}

export default PlayGame;