import { useState } from "react";
import { Route, Routes } from "react-router-dom";

import './styles.css';
import Nav from '../Nav';
import HowToPlay from "../HowToPlay";
import About from "../About";
import Cards from "../Cards";
import SignUp from "../SignUp";
import SignIn from "../SignIn";
import CardCreateEdit from "../CardCreateEdit";

export default function App() {
    const [loginStatus, setLoginStatus] = useState(false);

    return (
        <>
            <Nav loginStatus={loginStatus} setLoginStatus={setLoginStatus} />
            <Routes>
                <Route path="/" element={<HowToPlay />} />
                <Route path="/about" element={<About />} />
                <Route path="/cards" element={<Cards loginStatus={loginStatus} />} />
                <Route path="/cards/new" element={<CardCreateEdit edit={false} loginStatus={loginStatus} />} />
                <Route path="/cards/edit/:cardId" element={<CardCreateEdit edit={true} loginStatus={loginStatus} />} />
                <Route path="/signup" element={<SignUp setLoginStatus={setLoginStatus} />} />
                <Route path="/signin" element={<SignIn setLoginStatus={setLoginStatus} />} />
            </Routes>
        </>
    );
}