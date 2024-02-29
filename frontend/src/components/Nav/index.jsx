import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function Nav({ loginStatus, setLoginStatus }) {
    let loggedInLinks = <></>;
    let authLinks = <>
        <Link to="/signup" className="hover:bg-blue-700">Sign Up</Link>
        <Link to="/signin" className="hover:bg-blue-700">Sign In</Link>
    </>;

    if (loginStatus) {
        loggedInLinks = <>
                <Link to="/cards" className="hover:bg-blue-700">Cards</Link>
                <Link to="/games" className="hover:bg-blue-700">Games</Link>
            </>;
        authLinks = <button
            className="hover:bg-blue-700"
            onClick={ () => {
                localStorage.removeItem("userToken");
                setLoginStatus(false);
            }}>
            Log Out
        </button>;
    }

    return (
        <nav className="text-white font-medium bg-blue-500 text-sm flex flex-row justify-between">
            <Link to="/" className="hover:bg-blue-700">Home</Link>
            <Link to="/about" className="hover:bg-blue-700">About</Link>
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