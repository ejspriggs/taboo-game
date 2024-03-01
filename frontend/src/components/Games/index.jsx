import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getGames, addGame } from "../../../utils/backend";

function Games({ loginStatus }) {
    const [games, setGames] = useState({ loaded: false });
    const [ownerName, setOwnerName] = useState("Edward");

    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        console.log("in handleSubmit");
        addGame(ownerName).then( result => {
            console.log("in addGame().then()");
            localStorage.setItem("playerToken", result.playerToken);
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

    let gameList;
    if (games.loaded === false) {
        gameList = <p>Loading games...</p>;
    } else if (games.data.length === 0) {
        gameList = <p>No games to display.</p>;
    } else {
        gameList = <p>{JSON.stringify(games.data)}</p>;
    }

    return (
        <>
            <p className="text-4xl text-center py-4">Games</p>
            <form
                id="myform"
                onSubmit={handleSubmit}
            >
                <input
                    type="text"
                    id="ownerName"
                    name="ownerName"
                    value={ownerName}
                    onChange={handleInputChange}
                    placeholder="your name"
                    required
                />
            </form>
            <input
                type="submit"
                form="myform"
                className="text-white bg-blue-500 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5"
                value="Add Game"
            />
            {gameList}
        </>
    );
}

Games.propTypes = {
    loginStatus: PropTypes.bool.isRequired
};

export default Games;