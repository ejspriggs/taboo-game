import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getCards, deleteCard } from "../../../utils/backend";

function Cards({ loginStatus }) {
    const [cards, setCards] = useState({ loaded: false });

    const navigate = useNavigate();

    function handleDelete(cardId) {
        deleteCard(cardId).then( () => {
            getCards().then( (result) => {
                setCards({ data: result, loaded: true });
            });
        });
    }

    useEffect( () => {
        if (!loginStatus) {
            navigate("/signin");
        }
        getCards().then( (result) => {
            setCards({ data: result, loaded: true });
        });
    }, [loginStatus, navigate]);

    let cardList;
    if (cards.loaded === false) {
        cardList = <p>Loading cards...</p>;
    } else if (cards.data.length === 0) {
        cardList = <p>No cards to display.</p>;
    } else {
        cardList = cards.data.map( (card) => (
            <div
                key={card._id}
                className="bg-floral-white px-4 py-4 mx-4 my-4 rounded-xl border-2"
            >
                <div className="text-center mb-4">
                    <span className={"text-xl px-2 py-2 rounded-lg bg-" + card.bgColor}>{card.target}</span>
                </div>
                <div className="flex flex-row justify-between">
                    <Link
                        className="bg-yellow-400 hover:bg-yellow-700 font-medium rounded-lg text-sm px-2 py-2"
                        to={`/cards/edit/${card._id}`}
                    >
                        Edit
                    </Link>
                    <button
                        className="text-white bg-red-600 hover:bg-red-900 font-medium rounded-lg text-sm px-2 py-2"
                        onClick={() => handleDelete(card._id)}
                    >
                        Delete
                    </button>
                </div>
            </div>
        ));
    }

    return (
        <>
            <p className="text-4xl text-center py-4">Cards</p>
            <div className="text-center py-4">
                <Link className="text-white bg-blue-500 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5" to="/cards/new">Add New</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                {cardList}
            </div>
        </>
    );
}

Cards.propTypes = {
    loginStatus: PropTypes.bool.isRequired
}

export default Cards;