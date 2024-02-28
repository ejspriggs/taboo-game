import PropTypes from "prop-types";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Cards({ loginStatus }) {
    const navigate = useNavigate();

    useEffect( () => {
        if (!loginStatus) {
            navigate("/signin");
        }
    }, [loginStatus]);

    return (
        <>
            <p>This is the Cards component.</p>
            <Link to="/cards/new">Add New</Link>
        </>
    );
}

Cards.propTypes = {
    loginStatus: PropTypes.bool.isRequired
}