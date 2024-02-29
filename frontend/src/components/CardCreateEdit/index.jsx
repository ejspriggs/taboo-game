import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addCard, editCard, getCard } from "../../../utils/backend";

function CardCreateEdit({ edit, loginStatus }) {
    const [formData, setFormData] = useState({
        target: "",
        blocker1: "",
        blocker2: "",
        blocker3: "",
        blocker4: "",
        blocker5: "",
        bgColor: "federal-blue"
    });

    const navigate = useNavigate();
    const params = useParams();

    useEffect( () => {
        if (!loginStatus) {
            navigate("/signin");
        } else {
            if (edit) {
                getCard(params.cardId).then( (existingCard) => {
                    setFormData({
                        target: existingCard.target,
                        blocker1: existingCard.blockers[0],
                        blocker2: existingCard.blockers[1],
                        blocker3: existingCard.blockers[2],
                        blocker4: existingCard.blockers[3],
                        blocker5: existingCard.blockers[4],
                        bgColor: "federal-blue"
                    });
                });
            }
        }
        
    }, [loginStatus, navigate]);

    function handleInputChange(event) {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (edit) {
            editCard(params.cardId, formData).then( () => {
                navigate("/cards");
            });
        } else {
            addCard(formData).then( () => {
                navigate("/cards");
            });
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <p>
                <label htmlFor="target">Target</label>
                <input type="text" id="target" name="target" value={formData.target} onChange={handleInputChange} placeholder="target" required />
            </p>
            <p>
                <label htmlFor="blocker1">Blocker 1</label>
                <input type="text" id="blocker1" name="blocker1" value={formData.blocker1} onChange={handleInputChange} placeholder="blocker 1" required />
            </p>
            <p>
                <label htmlFor="blocker2">Blocker 2</label>
                <input type="text" id="blocker2" name="blocker2" value={formData.blocker2} onChange={handleInputChange} placeholder="blocker 2" required />
            </p>
            <p>
                <label htmlFor="blocker3">Blocker 3</label>
                <input type="text" id="blocker3" name="blocker3" value={formData.blocker3} onChange={handleInputChange} placeholder="blocker 3" required />
            </p>
            <p>
                <label htmlFor="blocker4">Blocker 4</label>
                <input type="text" id="blocker4" name="blocker4" value={formData.blocker4} onChange={handleInputChange} placeholder="blocker 4" required />
            </p>
            <p>
                <label htmlFor="blocker5">Blocker 5</label>
                <input type="text" id="blocker5" name="blocker5" value={formData.blocker5} onChange={handleInputChange} placeholder="blocker 5" required />
            </p>
            <p>
                <button type="submit">Save</button>
            </p>
        </form>
    );
}

CardCreateEdit.propTypes = {
    edit: PropTypes.bool.isRequired,
    loginStatus: PropTypes.bool.isRequired
}

export default CardCreateEdit;