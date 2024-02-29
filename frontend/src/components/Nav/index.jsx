import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function Nav({ loginStatus, setLoginStatus }) {
    let loggedInLinks = <></>;
    let authLinks = <>
        <Link to="/signup">Sign Up</Link>
        <Link to="/signin">Sign In</Link>
    </>;

    if (loginStatus) {
        loggedInLinks = <>
                <Link to="/cards">Cards</Link>
                <Link to="/games">Games</Link>
            </>;
        authLinks = <button
            onClick={ () => {
                localStorage.removeItem("userToken");
                setLoginStatus(false);
            }}>
            Log Out
        </button>;
    }

    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            {loggedInLinks}
            {authLinks}
        </nav>
    );
}

Nav.propTypes = {
    loginStatus: PropTypes.bool.isRequired,
    setLoginStatus: PropTypes.func.isRequired
}

export default Nav;