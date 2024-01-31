import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { NotificationManager } from "react-notifications";
import { HttpPostRequest } from "../../tools/HttpRequests";
import Switch from "../Switch";

import "../../scss/new_cours.scss";

const NewCours = () => {
    const [isExpert, setExpert] = useState(false);
    const navigate = useNavigate();
    const { register, getValues, setFocus } = useForm();

    const onSubmit = () => {
        const values = getValues();

        HttpPostRequest("/module", {
            "name": values.name,
            "expert": isExpert,
            "difficulty": values.difficulty
        }).then((response) => {
            if (!response.ok) {
                throw response;
            }
            return response.json();
        }).then(data => {
            navigate("/cours");
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

    return (
        <div className="new-cours-container">
            <form className="new-cours-form">
                <div className="expert-container">
                    <Switch
                        callback={(value) => setExpert(value)}
                        value={isExpert}
                    />
                </div>
                <label>Nom</label>
                <input
                    {...register("name")}
                    type="text"
                    name="name"
                    onKeyDown={(e) => handleKeyDown(e, () => setFocus("difficulty"))}
                    required
                />
                <label>Difficulté</label>
                <input
                    {...register("difficulty")}
                    type="number"
                    name="difficulty"
                    onKeyDown={(e) => handleKeyDown(e, onSubmit)}
                    required
                />
                <div className="button-container">
                    <button
                        className="submit-button"
                        type="button"
                        onClick={onSubmit}
                        >
                        Créer
                    </button>
                </div>
            </form>

        </div>
    )
};

export default NewCours;