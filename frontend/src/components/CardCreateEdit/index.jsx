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
    const [loaded, setLoaded] = useState(false);

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
                        bgColor: existingCard.bgColor
                    });
                    setLoaded(true);
                });
            }
        }
    }, [loginStatus, edit, params.cardId, navigate]);

    function handleInputChange(event) {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    }

    function handleButton(buttonColor) {
        return () => {
            setFormData({ ...formData, bgColor: buttonColor });
        };
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

    let result = <p>Loading form...</p>;
    if (edit === false || loaded === true) {
        result = <>
            <p className="text-4xl text-center py-4">Card Details</p>
            <div className="text-center">
                <div>
                    <button
                        className={"bg-federal-blue hover:text-black hover:bg-slate-300 font-medium rounded-lg text-sm px-2 py-2 " + (formData.bgColor === "federal-blue" ? "border-4 border-slate-700" : "m-1")}
                        onClick={handleButton("federal-blue")}
                    >
                        Federal Blue
                    </button>
                    <button
                        className={"bg-goldenrod hover:text-black hover:bg-slate-300 font-medium rounded-lg text-sm px-2 py-2 " + (formData.bgColor === "goldenrod" ? "border-4 border-slate-700" : "m-1")}
                        onClick={handleButton("goldenrod")}
                    >
                        Goldenrod
                    </button>
                    <button
                        className={"bg-avocado hover:text-black hover:bg-slate-300 font-medium rounded-lg text-sm px-2 py-2 " + (formData.bgColor === "avocado" ? "border-4 border-slate-700" : "m-1")}
                        onClick={handleButton("avocado")}
                    >
                        Avocado
                    </button>
                    <button
                        className={"bg-pantone-orange hover:text-black hover:bg-slate-300 font-medium rounded-lg text-sm px-2 py-2 " + (formData.bgColor === "pantone-orange" ? "border-4 border-slate-700" : "m-1")}
                        onClick={handleButton("pantone-orange")}
                    >
                        Pantone Orange
                    </button>
                </div>
                <form
                    id="myform"
                    className="m-4 p-4 bg-floral-white border-black border-2 rounded-xl"
                    onSubmit={handleSubmit}
                >
                    <input className="text-center bg-floral-white" type="text" id="target" name="target" value={formData.target} onChange={handleInputChange} placeholder="target" required />
                    <hr />
                    <input className="text-center bg-floral-white" type="text" id="blocker1" name="blocker1" value={formData.blocker1} onChange={handleInputChange} placeholder="blocker 1" required />
                    <br />
                    <input className="text-center bg-floral-white" type="text" id="blocker2" name="blocker2" value={formData.blocker2} onChange={handleInputChange} placeholder="blocker 2" required />
                    <br />
                    <input className="text-center bg-floral-white" type="text" id="blocker3" name="blocker3" value={formData.blocker3} onChange={handleInputChange} placeholder="blocker 3" required />
                    <br />
                    <input className="text-center bg-floral-white" type="text" id="blocker4" name="blocker4" value={formData.blocker4} onChange={handleInputChange} placeholder="blocker 4" required />
                    <br />
                    <input className="text-center bg-floral-white" type="text" id="blocker5" name="blocker5" value={formData.blocker5} onChange={handleInputChange} placeholder="blocker 5" required />
                </form>
                <input
                    type="submit"
                    form="myform"
                    className="text-white cursor-pointer bg-blue-500 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5"
                    value="Save"
                />
            </div>
        </>;
    }

    return result;
}

CardCreateEdit.propTypes = {
    edit: PropTypes.bool.isRequired,
    loginStatus: PropTypes.bool.isRequired
}

export default CardCreateEdit;