import PropTypes from "prop-types";

function SignIn({ setLoginStatus }) {
    return <h1>This is the SignIn React component.</h1>;
}

SignIn.propTypes = {
    setLoginStatus: PropTypes.func.isRequired
}

export default SignIn;