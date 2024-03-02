import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getGames, addGame } from "../../../utils/backend";

function Games({ loginStatus }) {
    const [games, setGames] = useState({ loaded: false });
    const [ownerName, setOwnerName] = useState("");

    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        addGame(ownerName).then( result => {
            localStorage.setItem(`ptoken-${result.gameToken}`, result.playerToken);
            navigate(`/play/${result.gameToken}`);
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
            }).catch( (error) => {
                setGames({ data: error.toJSON(), loaded: true });
            });
        }
    }, [loginStatus, navigate, games.loaded]);

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
        gameList = games.data.map( game => (
            <div key={game.gameToken} className="p-2 m-2 rounded-lg border-2 border-black bg-floral-white">
                <p>Owner: {game.players.find( player => player.owner ).name}</p>
                <p>Players: {game.players.length}</p>
                <p>Deck left: {game.deck.length}</p>
                {game.cardholder ? <p>Cardholder: {game.cardholder}</p> : <></>}
                <p>Join link: <span id={`joinlink-${game.gameToken}`}>{window.location.origin}/play/{game.gameToken}</span></p>
                <button
                    type="button"
                    className="text-white bg-green-500 hover:bg-green-700 font-medium rounded-lg text-sm px-2 py-2 mr-4"
                    onClick={
                        () => copyLink(`joinlink-${game.gameToken}`)
                    }
                >
                    Copy Join Link
                </button>
                <button
                    type="button"
                    className="text-white bg-blue-500 hover:bg-blue-700 font-medium rounded-lg text-sm px-2 py-2 mr-4"
                    onClick={
                        () => playGame(game.gameToken)
                    }
                >
                    Play Game
                </button>
            </div>
        ));
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
                        placeholder="owner name"
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