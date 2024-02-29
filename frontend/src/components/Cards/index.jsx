import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCards, deleteCard } from "../../../utils/backend";

export default function Cards({ loginStatus }) {
    const [cards, setCards] = useState(false);

    const navigate = useNavigate();

    function handleDelete(cardId) {
        deleteCard(cardId);
        getCards().then( (result) => {
            setCards(result);
        });
    }

    useEffect( () => {
        if (!loginStatus) {
            navigate("/signin");
        }

        getCards().then( (result) => {
            setCards(result);
        });
    }, [loginStatus, navigate]);

    let cardList;
    if (cards === false) {
        cardList = <p>Loading cards...</p>;
    } else if (cards.length === 0) {
        cardList = <p>No cards to display.</p>;
    } else {
        cardList = cards.map( (card) => <div key={card._id}>
            <p>{card.target}</p>
            <Link to={`/cards/edit/${card._id}`}>Edit</Link>
            <button onClick={() => handleDelete(card._id)}>Delete</button>
        </div> )
    }

    return (
        <>
            <p>This is the Cards component.</p>
            <Link to="/cards/new">Add New</Link>
            {cardList}
        </>
    );
}

Cards.propTypes = {
    loginStatus: PropTypes.bool.isRequired
}