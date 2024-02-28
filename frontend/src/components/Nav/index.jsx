import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function Nav({ loginStatus, setLoginStatus }) {
    let cardsLink = <></>;
    let authLinks = <>
        <Link to="/signup">Sign Up</Link>
        <Link to="/signin">Sign In</Link>
    </>;

    if (loginStatus) {
        cardsLink = <>
                <Link to="/cards">Cards</Link>
            </>;
        authLinks = <button
            onClick={ () => {
                localStorage.removeItem("userToken");
                setLoginStatus(false);
            }}>Log Out</button>;
    }

    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            {cardsLink}
            {authLinks}
        </nav>
    );
}

Nav.propTypes = {
    loginStatus: PropTypes.bool.isRequired,
    setLoginStatus: PropTypes.func.isRequired
}

export default Nav;