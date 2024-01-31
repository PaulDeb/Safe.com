import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HttpGetRequest, HttpDeleteRequest } from "../../tools/HttpRequests";
import { NotificationManager } from "react-notifications";

import { FaPlus } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";
import { FiTrash } from "react-icons/fi";

import "../../scss/cours_list.scss";

const CoursList = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [cours, setCours] = useState(null);
    let user = sessionStorage.getItem("user");

    user = JSON.parse(user);

    useEffect(() => {
        getCoursList();
    },[]);

    const getCoursList = () => {
        HttpGetRequest("/module/")
        .then((response) => {
            if (!response.ok) {
                throw response.status;
            }
            return response.json();
        }).then(data => {
            setCours(data);
            setLoading(false);
        }).catch((error) => {
            console.log(error);
            
            NotificationManager.error("Une erreur est survenue lors de la récupération des cours!");
        });
    };

    const removeCours = (module) => {
        HttpDeleteRequest("/module/" + module._id)
        .then((response) => {
            if (!response.ok) {
                throw response.status;
            }
            return response.json();
        }).then((_) => {
            let updatedCours = [...cours];
            let index = updatedCours.indexOf(module);
            if (index !== -1) {
                updatedCours.splice(index, 1);
                setCours(updatedCours);
            }
            NotificationManager.success("Cours supprimée !");
        }).catch((error) => {
            console.log(error);
            NotificationManager.error("Une erreur est survenue lors de la création d'une leçon !");
        });
    }

    const getStyleCours = (cours) => {
        let style = ["cours-link"];
        let coursInProgress = 0;
        let coursEnded = 0;
        let coursSize = cours.lessons.length;

        cours.lessons.forEach((lesson) => {
            if (user.lessonInProgress.includes(lesson)) {
                coursInProgress += 1;
            }
            if (user.lessonEnded.includes(lesson)) {
                coursEnded += 1;
            }
        });

        if (coursEnded === coursSize && coursSize > 0) 
            style.push("ended");
        else if (coursInProgress >= 1 || coursEnded >= 1)
            style.push("in-progress");
        
        return style.join(" ");
    }

    if (!!loading) {
        return (
            <div className="loading">
                <AiOutlineLoading className="loading-icon" />
                <> Loading ... </>
            </div>
        )
    }

    return(
        <div className="cours-container">
            {(!!user.admin) ? (
                <div className="admin-buttons">
                    <FaPlus
                        className="icon-admin-plus"
                        onClick={() => navigate("new")}
                    />
                </div>
            ): null}
            <div className="cours-list">
                { (!!cours) ? 
                    cours.map((cours) => {
                        if (!!cours.expert && !user.expert)
                            return null;

                        return (
                            <div className="module-item-container">
                                <div
                                    key={cours._id}
                                    className={getStyleCours(cours)}
                                    onClick={() => navigate("/cours/" + cours._id + "/lessons")}
                                >
                                    {cours.name}
                                </div>
                                {(!!user.admin) ? (
                                    <>
                                        <FiTrash
                                            className="remove-item"
                                            onClick={() => removeCours(cours)}
                                        />
                                    </>
                                ) : null}
                            </div>
                        )
                    }
                ) : (    
                    <div>pas de cours</div>
                )}
            </div>
        </div>
    );
};

export default CoursList;