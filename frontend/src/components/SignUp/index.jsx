import PropTypes from "prop-types";
import { useState } from "react";

function SignUp({ setLoginStatus }) {
    const [formData, setFormData] = useState()
    return <h1>This is the SignUp React component.</h1>;
}

SignUp.propTypes = {
    setLoginStatus: PropTypes.func.isRequired
}

export default SignUp;