import React, { useState } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import LoginImage from "../assets/images/login.jpg";
import { HttpPostRequest } from "../tools/HttpRequests";
import { NotificationManager } from 'react-notifications';

import "../scss/login.scss";

const Login = () => {
    const navigate = useNavigate();
    const { register, getValues, setFocus } = useForm();
    const [isConnected, setConnected] = useState(sessionStorage.getItem("connected"));

    const onSubmit = () => {
        const values = getValues();
        HttpPostRequest("/account/login", {
            "email": values.email,
            "password": values.password
        }).then((response) => {
            if (!response.ok) {
                throw response.status;
            }
            return response.json();
        }).then(data => {
            sessionStorage.setItem("connected", true);
            sessionStorage.setItem("user", JSON.stringify(data.user));
            setConnected(true);
        }).catch((error) => {
            console.log(error);
            if (error === 403) {
                NotificationManager.error("Veuillez vérifier votre mot de passe !");
                return;
            }
            if (error === 404) {
                NotificationManager.error("Aucun compte lié à cet email !")
                return;
            }
            NotificationManager.error("Une erreur est survenue !");
        });
    }

    const handleKeyDown = (e, func) => {
        if (e.key === 'Enter') {
            func();
        }
    }

    if (!!isConnected) {
        return (<Navigate to="/account" />);
    }

    return(
        <div className="container-login">
            <div className="flex-container">
            <div className="flex-button-container">
                    <div
                        className="title"
                        >
                        Connexion
                    </div>
                    <div
                        className="title transparent-title"
                        onClick={() => navigate('/register')}
                    >
                        Inscription
                    </div>
                </div>
                <form className="login-form">
                    <label>Email</label>
                    <input
                        {...register("email")}
                        type="text"
                        name="email"
                        onKeyDown={(e) => handleKeyDown(e, () => setFocus("password"))}
                        required
                    />
                    <label>Mot de passe</label>
                    <input
                        {...register("password")}
                        type="password"
                        name="password"
                        onKeyDown={(e) => handleKeyDown(e, onSubmit)}
                        required
                    />

                    <div className="forget-password">
                        J'ai oublié mon mot de passe
                    </div>
                    
                </form>
            </div>
            <div className="image-container">
                <img className="login-image" src={LoginImage} alt="Login"/>
            </div>
        </div>
    );
};

export default Login;