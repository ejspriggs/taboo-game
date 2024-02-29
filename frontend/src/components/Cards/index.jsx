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
            <p className="text-4xl text-center py-4">Cards!</p>
            <div className="text-center py-4">
                <Link className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5" to="/cards/new">Add New</Link>
            </div>
            <div className="grid grid-flow-row auto-rows-max md:auto-rows-min">
                {cardList}
            </div>
        </>
    );
}

Cards.propTypes = {
    loginStatus: PropTypes.bool.isRequired
}