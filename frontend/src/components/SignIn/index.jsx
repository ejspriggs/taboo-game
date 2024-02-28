import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signIn } from "../../../utils/backend";

function SignIn({ setLoginStatus }) {
    const [formData, setFormData] = useState({ email: "", password: "" })

    const navigate = useNavigate();

    function handleInputChange(event) {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const { token } = await signIn(formData);
        localStorage.setItem("userToken", token);
        setLoginStatus(true);
        navigate("/");
    }

    return(
        <>
            <h1>Sign In</h1>
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
                <button type="submit">Sign In</button>
            </form>
        </>
    );
}

SignIn.propTypes = {
    setLoginStatus: PropTypes.func.isRequired
}

export default SignIn;