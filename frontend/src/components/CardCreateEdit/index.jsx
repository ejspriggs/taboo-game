import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CardCreateEdit({ loginStatus }) {
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

    useEffect( () => {
        if (!loginStatus) {
            navigate("/signin");
        }
    }, [loginStatus, navigate]);

    function handleInputChange(event) {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        // Backend interaction goes here
        console.log(formData);
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
    loginStatus: PropTypes.bool.isRequired
}

export default CardCreateEdit;