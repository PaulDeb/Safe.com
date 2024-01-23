import React from 'react';
import { useNavigate } from 'react-router-dom';

import "../scss/home.scss";

const Home = () => {
    const navigate = useNavigate();

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
}

export default Home;