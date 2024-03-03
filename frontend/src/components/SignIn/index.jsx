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
        localStorage.setItem("email", formData.email);
        setLoginStatus(true);
        navigate("/");
    }

    return (
        <>
            <p className="text-4xl text-center py-4">Sign In</p>
            <div className="text-center">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">E-mail Address:&nbsp;</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="username@host.tld"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    <br />
                    <label htmlFor="password">Password:&nbsp;</label>
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
                    <br />
                    <button
                        className="text-white bg-blue-500 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5"
                        type="submit"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </>
    );
}

SignIn.propTypes = {
    setLoginStatus: PropTypes.func.isRequired
}

export default SignIn;