import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Switch from '../Switch';
import { HttpPatchRequest } from "../../tools/HttpRequests";
import { NotificationManager } from "react-notifications";

import "../../scss/profile.scss";

const Profile = () => {
    const [user, setUser] = useState({});
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const { register, setValue, getValues } = useForm();

    useEffect(() => {
        let myUser = sessionStorage.getItem("user");
    
        myUser = JSON.parse(myUser);
        
        setUser(myUser);
        setValue('pseudo', myUser.pseudo);
    }, [])// eslint-disable-line

    const onSubmit = () => {
        const values = getValues();

        HttpPatchRequest("/account/" + user.id, {
            pseudo: values.pseudo,
            expert: user.expert,
        }).then((response) => {
            if (!response.ok) {
                throw response;
            }
            return response.json();
        }).then(_ => {
            let myUser = {...user, pseudo: values.pseudo};

            sessionStorage.setItem('user', JSON.stringify(myUser));
            setUser(myUser);
            NotificationManager.success("Profil mis à jour !");
        }).catch((error) => {
            console.log(error);
            NotificationManager.error("Une erreur est survenue !");
        });
    };

    const onSubmitPassword = () => {
        if (password.length <= 0 || confPassword.length <= 0) {
            return;
        }

        HttpPatchRequest("/account/" + user.id + "/password", {
            password: password,
            newPassword: confPassword,
        }).then((response) => {
            if (!response.ok) {
                throw response;
            }
            return response.json();
        }).then(_ => {
            setPassword("");
            setConfPassword("");
            NotificationManager.success("Mot de passe mis à jour !");
        }).catch((error) => {
            console.log(error);
            NotificationManager.error("Une erreur est survenue !");
        });
    }

    return (
        <div className="profile-container">
            <div className="profile-title">
                Mon profil
            </div>
            <form className="profile-form">
                <div className="profile-divider" />
                <label className="profile-label">Mon Pseudo</label>
                <input
                    {...register("pseudo")}
                    className="profile-input"
                />
                <div className="profile-divider" />

                <label className="profile-label">Mon addresse e-mail</label>
                <input
                    className="profile-input"
                    value={user.email}
                    readOnly
                />
                <div className="profile-divider" />

                <div className="profile-level-container">
                    <label className="profile-label">Mon niveau</label>
                    <Switch
                        callback={(value) => setUser({...user, expert: value})}
                        value={user.expert}
                    />
                </div>

                <button
                    type="button"
                    className="profile-submit"
                    onClick={onSubmit}
                >
                    Enregistrer
                </button>
            </form>
            <div className="profile-passwords">
                <div>
                    <label className="profile-label">Ancien mot de passe</label>
                    <input
                        className="profile-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                </div>
                <div>
                    <label className="profile-label">Nouveau mot de passe</label>
                    <input
                        className="profile-input"
                        type="password"
                        value={confPassword}
                        onChange={(e) => setConfPassword(e.target.value)}
                    />
                </div>
                <button
                    type="button"
                    className="profile-submit"
                    onClick={onSubmitPassword}
                >
                    Changer de mot de passe
                </button>
            </div>
        </div>
    );
};

export default Profile;