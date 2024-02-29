import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Games({ loginStatus }) {
    const [games, setGames] = useState(false);
    return <h1>This is the Games component.</h1>;
}

export default Games;