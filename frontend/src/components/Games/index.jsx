import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getGames, addGame, deleteGame, takeOverGame } from "../../../utils/backend";

function Games({ loginStatus }) {
    const [games, setGames] = useState({ loaded: false });
    const [ownerName, setOwnerName] = useState("");

    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        addGame(ownerName, localStorage.getItem("email")).then( result => {
            localStorage.setItem(`ptoken-${result.gameToken}`, result.playerToken);
            getGames().then( (result) => {
                setGames({ data: result, loaded: true });
            }).catch( (error) => {
                setGames({ data: error.toJSON(), loaded: true });
            });
        });
    }

    function handleInputChange(event) {
        setOwnerName(event.target.value);
    }

    useEffect( () => {
        if (!loginStatus) {
            navigate("/signin");
        }
        if (games.loaded === false) {
            getGames().then( (result) => {
                setGames({ data: result, loaded: true });
            });
        }
    }, [loginStatus, navigate, games.loaded]);

    function handleDeleteGame(gameToken) {
        deleteGame(gameToken).then( () => {
            getGames().then( (result) => {
                setGames({ data: result, loaded: true });
            });
        })
    }

    function handleTakeOver(gameToken) {
        takeOverGame(gameToken).then( takeOverResult => {
            localStorage.setItem(`ptoken-${gameToken}`, takeOverResult.playerToken);
        });
    }

    async function copyLink(spanId) {
        await navigator.clipboard.writeText(document.getElementById(spanId).innerText);
    }

    function playGame(gameToken) {
        navigate(`/play/${gameToken}`);
    }

    let gameList;
    if (games.loaded === false) {
        gameList = <p>Loading games...</p>;
    } else if (games.data.length === 0) {
        gameList = <p>No games to display.</p>;
    } else {
        gameList = (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">{
                games.data.map( game => (
                    <div key={game.gameToken} className="p-2 m-2 rounded-lg border-2 border-black bg-floral-white min-w-96">
                        <p>Creator email: {game.creatorEmail === localStorage.getItem("email") ? game.creatorEmail + " (you)" : game.creatorEmail}</p>
                        <p>Superuser: {game.players.find( player => player.owner ).name}</p>
                        <p>Players: {game.players.length}</p>
                        <p>Deck left: {game.deck.length}</p>
                        {game.cardholder ? <p>Cardholder: {game.cardholder}</p> : <></>}
                        <p>Join link: <span id={`joinlink-${game.gameToken}`}>{window.location.origin}/play/{game.gameToken}</span></p>
                        {game.creatorEmail === localStorage.getItem("email") ?
                        <>
                            <button
                                type="button"
                                className="text-white bg-red-400 hover:bg-red-600 font-medium rounded-lg text-sm p-2 mr-4"
                                onClick={ () => handleDeleteGame(game.gameToken) }
                            >
                                Delete
                            </button>
                            <button
                                type="button"
                                className="text-black bg-yellow-400 hover:bg-yellow-600 font-medium rounded-lg text-sm p-2 mr-4"
                                onClick={ () => handleTakeOver(game.gameToken) }
                            >
                                Take Over
                            </button>
                        </> :
                        <></>}
                        <button
                            type="button"
                            className="text-white bg-green-500 hover:bg-green-700 font-medium rounded-lg text-sm p-2 mr-4"
                            onClick={ () => copyLink(`joinlink-${game.gameToken}`) }
                        >
                            Copy Join Link
                        </button>
                        <button
                            type="button"
                            className="text-white bg-blue-500 hover:bg-blue-700 font-medium rounded-lg text-sm p-2"
                            onClick={ () => playGame(game.gameToken) }
                        >
                            Play Game
                        </button>
                    </div>
                ))
            }</div>
        );
    }

    return (
        <>
            <p className="text-4xl text-center py-4">Games</p>
            <div className="flex flex-row p-2 m-2 rounded-lg border-2 border-black bg-floral-white justify-between w-4/5 lg:w-2/5 mx-auto">
                <form
                    id="myform"
                    onSubmit={handleSubmit}
                    className="flex flex-col"
                >
                    <label htmlFor="ownerName">Name:</label>
                    <input
                        type="text"
                        id="ownerName"
                        name="ownerName"
                        value={ownerName}
                        onChange={handleInputChange}
                        placeholder="superuser name"
                        required
                        className="border-2 border-black pl-1 mr-4"
                    />
                </form>
                <input
                    type="submit"
                    form="myform"
                    className="text-white bg-blue-500 hover:bg-blue-700 font-medium rounded-lg text-lg px-5 py-2.5"
                    value="Add Game"
                />
            </div>
            {gameList}
        </>
    );
}

Games.propTypes = {
    loginStatus: PropTypes.bool.isRequired
};

export default Games;