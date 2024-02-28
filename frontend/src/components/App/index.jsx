import { useState } from "react";
import { Route, Routes } from "react-router-dom";

import './styles.css';
import Nav from '../Nav';
import About from "../About";
import HowToPlay from "../HowToPlay";
import SignUp from "../SignUp";
import SignIn from "../SignIn";

export default function App() {
    const [loginStatus, setLoginStatus] = useState(false);

    return (
        <>
            <Nav loginStatus={loginStatus} setLoginStatus={setLoginStatus} />
            <h1>This is the App React component.</h1>
            <Routes>
                <Route path="/" element={<HowToPlay />} />
                <Route path="/about" element={<About />} />
                <Route path="/signup" element={<SignUp setLoginStatus={setLoginStatus} />} />
                <Route path="/signin" element={<SignIn setLoginStatus={setLoginStatus} />} />
            </Routes>
        </>
    );
}