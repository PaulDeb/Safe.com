import React from 'react';
import { useNavigate } from 'react-router-dom';

import HomeImg from "../assets/images/home.jpg";
import "../scss/home.scss";

const Home = () => {
    const navigate = useNavigate();
    const isConnected = sessionStorage.getItem("connected") === "true" ? true : false;

    if (!isConnected)
        return (
            <div className="mainpage-content">
                <div className="titles-container">
                    <p className="main-title">
                        Bienvenue sur le site d’apprentissage des méthodes agiles, plus précisément celle du SAFe !
                    </p>

                    <p className="sub-title">
                        Si tu souhaites te former sur une méthode agile à l’échelle, Safe.com est là pour t’aider à en apprendre plus sur la méthode SAFe.
                    </p>
                </div>
                <div className="buttons-container">
                    <button className="login-btn" onClick={() => navigate("/login")}>
                        J'ai déja un compte
                    </button>
                    <button className="register-btn" onClick={() => navigate("/register")}>
                        Je m'inscris
                    </button>
                </div>
            </div>
        );

    return (
        <div className="mainpage-connected-content">
            <div className="home-container">
                <div className="image-container">
                    <img src={HomeImg} className="home-image" alt="home"/>
                </div>
                <div className="menu-container">
                    <div
                        className="link-menu"
                        onClick={() => navigate("/cours")}
                    >
                        Mes Cours
                    </div>
                    <div
                        className="link-menu"
                        onClick={() => navigate("/progression")}
                    >
                        Ma Progression
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;