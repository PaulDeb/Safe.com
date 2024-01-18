import React from 'react';

import "../scss/home.scss";

const Home = () => {
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
                <button className="login-btn"> J'ai déja un compte </button>
                <button className="register-btn"> Je m'inscris </button>
            </div>
        </div>
    );
}

export default Home;