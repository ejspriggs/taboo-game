import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function Nav({ loginStatus, setLoginStatus }) {
    let authLink = <>
        <Link to="/signup"><p>Sign Up</p></Link>
        <Link to="/signin"><p>Sign In</p></Link>
    </>;

    if (loginStatus) {
        authLink = <button
            onClick={ () => {
                localStorage.removeItem("userToken");
                setLoginStatus(false);
            }}>Log Out</button>;
    }

    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            {authLink}
        </nav>
    );
}

Nav.propTypes = {
    loginStatus: PropTypes.bool.isRequired,
    setLoginStatus: PropTypes.func.isRequired
}

export default Nav;