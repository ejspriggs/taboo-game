import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signUp } from "../../../utils/backend";

function SignUp({ setLoginStatus }) {
    const [formData, setFormData] = useState({ email: "", password: "" })

    const navigate = useNavigate();

    function handleInputChange(event) {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const { token } = await signUp(formData);
        localStorage.setItem("userToken", token);
        setLoginStatus(true);
        navigate("/");
    }

    return(
        <>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="email address"
                    value={formData.email}
                    onChange={handleInputChange}
                />
                <label htmlFor="password">password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    minLength="6"
                    required
                    placeholder="password"
                    value={formData.password}
                    onChange={handleInputChange}
                />
                <button type="submit">Sign Up</button>
            </form>
        </>
    );
}

SignUp.propTypes = {
    setLoginStatus: PropTypes.func.isRequired
}

export default SignUp;