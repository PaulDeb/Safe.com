import React, { useEffect, useState } from "react";
import { HttpGetRequest } from "../tools/HttpRequests";
import { NotificationManager } from "react-notifications";
import { AiOutlineLoading } from "react-icons/ai";

import "../scss/progression.scss";

const Progression = () => {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});

    useEffect(() => {
        let currentUser = sessionStorage.getItem("user");

        currentUser = JSON.parse(currentUser);

        setUser(currentUser);
        getModulesList();
    },[]);

    const getModulesList = () => {
        HttpGetRequest("/module/")
        .then((response) => {
            if (!response.ok) {
                throw response.status;
            }
            return response.json();
        }).then(data => {
            setModules(data);
            setLoading(false);
        }).catch((error) => {
            console.log(error);
            NotificationManager.error("Une erreur est survenue lors de la récupération des cours!");
        });
    };

    const getPercentage = (index) => {
        const module = modules[index];
        const nbLessons = (module.lessons.length > 0) ? module.lessons.length : 1;
        let nbLessonsEnded = 0;
        let percentage = 0;

        user.lessonEnded.forEach((lesson) => {
            if (module.lessons.includes(lesson)) {
                nbLessonsEnded += 1;
            }
        })
        percentage = (nbLessonsEnded / nbLessons) * 100;

        return percentage.toPrecision(3)
    }

    if (!!loading) {
        return (
            <div className="loading">
                <AiOutlineLoading className="loading-icon" />
                <> Loading ... </>
            </div>
        )
    }

    return (
        <div className="progress-container">
            <div className="progress-titlepage">
                Ma Progression
            </div>

            <div className="progress-list">
            { (!!modules) ? 
                    modules.map((module, index) => {
                        if (!!module.expert && !user.expert)
                        return null;
                    
                    let percent = getPercentage(index);
                    
                    return (
                        <div key={module._id} className="progress-item">
                                <div className="progress-title">
                                    {module.name}
                                </div>
                                <div
                                    className={(percent >= 80) ? (
                                        "progress-percent green"
                                        ) : (percent >= 50) ? (
                                            "progress-percent orange"
                                            ) : (
                                                "progress-percent"
                                                )}
                                                >
                                    {percent} %
                                </div>
                            </div>
                        )
                    }
                    ) : (    
                        <div>pas de cours</div>
                        )}
            </div>
        </div>
    );
}

export default Progression;