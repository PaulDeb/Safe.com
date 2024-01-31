import React, { useState } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import RegisterImage from "../assets/images/register.jpg";
import { HttpPostRequest } from "../tools/HttpRequests";
import { NotificationManager } from 'react-notifications';
import Switch from "./Switch";

import "../scss/register.scss";

const Register = () => {
    const navigate = useNavigate();
    const { register, getValues, setFocus } = useForm();
    const [isConnected, setConnected] = useState(sessionStorage.getItem("connected"));
    const [isExpert, setExpert] = useState(false);

    const onSubmit = () => {
        const values = getValues();

        if (values.password !== values.confPassword) {
            return NotificationManager.error("La confirmation du mot de passe n'est pas identique au mot de passe !");
        }

        HttpPostRequest("/account/register", {
            "pseudo": values.pseudo,
            "expert": isExpert,
            "email": values.email,
            "password": values.password
        }).then((response) => {
            if (!response.ok) {
                throw response;
            }
            return response.json();
        }).then(data => {
            sessionStorage.setItem("connected", true);
            sessionStorage.setItem("user", JSON.stringify(data.user));
            setConnected(true);
        }).catch((error) => {
            if (error.status === 403) {
                NotificationManager.error("Un compte existe déjà avec l'adresse : " + values.email);
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
                        className="title transparent-title"
                        onClick={() => navigate('/login')}
                    >
                        Connexion
                    </div>
                    <div className="title">Inscription</div>
                </div>
                <form className="register-form">
                    <Switch
                        callback={(value) => setExpert(value)}
                        value={isExpert}
                    />
                    <label>Pseudo</label>
                    <input
                        {...register("pseudo")}
                        type="text"
                        name="pseudo"
                        onKeyDown={(e) => handleKeyDown(e, () => setFocus("email"))}
                        required
                    />
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
                        onKeyDown={(e) => handleKeyDown(e, () => setFocus("confPassword"))}
                        required
                        />
                    <label>Confirmation</label>
                    <input
                        {...register("confPassword")}
                        type="password"
                        name="confPassword"
                        onKeyDown={(e) => handleKeyDown(e, onSubmit)}
                        required
                    />
                    
                </form>
            </div>
            <div className="image-container">
                <img className="register-image" src={RegisterImage} alt="register"/>
            </div>
        </div>
    );
};

export default Register;