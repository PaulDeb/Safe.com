import React, { useEffect, useState } from "react";
import {
    HttpGetRequest, HttpPostRequest,
    HttpPatchRequest, HttpDeleteRequest
} from "../../tools/HttpRequests";
import { useParams, useNavigate } from "react-router-dom";
import { NotificationManager } from "react-notifications";

import { FaPlus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { AiOutlineLoading } from "react-icons/ai";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { FiTrash } from "react-icons/fi";


import "../../scss/lesson_list.scss";

const LessonList = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [lessons, setLessons] = useState([]);
    const [module, setModule] = useState(null);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});

    const newLesson = {
        expert: false,
        title: "Nouvelle Leçon",
        data: {}
    };

    useEffect(() => {
        getLessonList();

        let currentUser = sessionStorage.getItem("user");
        setUser(JSON.parse(currentUser));

    },[]);// eslint-disable-line

    const getLessonList = () => {
        HttpGetRequest("/module/" + params.coursId + "/lessons")
        .then((response) => {
            if (!response.ok) {
                throw response.status;
            }
            return response.json();
        }).then(data => {
            console.log(data.module.name);
            setLessons(data.lessons);
            setModule(data.module);
            setTitle(data.module.name);
            setLoading(false);
        }).catch((error) => {
            console.log(error);
            NotificationManager.error("Une erreur est survenue lors de la récupération des cours!");
            setLoading(false);
        });
    };

    const createNewLesson = () => {
        HttpPostRequest("/lesson", newLesson)
        .then((response) => {
            if (!response.ok) {
                throw response.status;
            }
            return response.json();
        }).then(data => {
            addLessonToModule(data._id);
        }).catch((error) => {
            console.log(error);
            NotificationManager.error("Une erreur est survenue lors de la création d'une leçon !");
        });
    }

    const removeLesson = (lesson) => {
        HttpDeleteRequest("/lesson/" + lesson._id)
        .then((response) => {
            if (!response.ok) {
                throw response.status;
            }
            return response.json();
        }).then((_) => {
            let updatedlessons = [...lessons];
            let index = updatedlessons.indexOf(lesson);
            if (index !== -1) {
                updatedlessons.splice(index, 1);
                setLessons(updatedlessons);
            }
            NotificationManager.success("Lesson supprimée !");
        }).catch((error) => {
            console.log(error);
            NotificationManager.error("Une erreur est survenue lors de la création d'une leçon !");
        });
    }

    const addLessonToModule = (lessonId) => {
        HttpPostRequest("/module/" + params.coursId + "/lesson", {
            lessonId
        }).then((response) => {
            if (!response.ok) {
                throw response.status;
            }
            return response.json();
        }).then((data) => {
            setTimeout(() => {
                getLessonList();
            }, 1000);
        }).catch((error) => {
            console.log(error);
            NotificationManager.error("Une erreur est survenue lors de l'ajout de la leçon au cours !");
        });
    }

    const updateModule = () => {
        if (title === module.name) {
            return;
        }
        HttpPatchRequest("/module/" + params.coursId, {
            name: title
        })
        .then((response) => {
            if (!response.ok) {
                throw response.status;
            }
            return response.json();
        }).then((data) => {
            NotificationManager.success("Mise à jour du module réussie !");
        }).catch((error) => {
            console.log(error);
            NotificationManager.error("Une erreur est survenue lors de la mise à jours du compte !");
            setLoading(false);
        });
    }

    const selectLesson = (lesson) => {
        navigate(lesson._id);
    }

    const getStyleLesson = (lesson) => {
        let style = ["lesson-item"];

        if (user.lessonInProgress.includes(lesson._id)) {
            style.push("in-progress");
        } else if (user.lessonEnded.includes(lesson._id)) {
            style.push("ended");
        }
        return style.join(" ");
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            updateModule();
        }
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
        <div className="lesson-list">
            <div className="lesson-toolbar">
                <div className="toolbar-buttons">
                    <MdOutlineArrowBackIosNew 
                        className="back-button"
                        onClick={() => navigate("/cours")}
                    />
                </div>
                {(!!user.admin) ? (
                    <div className="admin-buttons">
                        <FaPlus
                            className="icon-admin-plus"
                            onClick={createNewLesson}
                        />
                    </div>
                ): null }
            </div>
            <div className="cours-title">
                {(!!user.admin) ? (
                    <textarea
                        className="cours-title-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                ) : (
                    title
                )}
            </div>
            <div className="lessons-list">
            {(lessons.length > 0) ? (
                lessons.map(lesson => (
                    <div key={lesson._id} className="lesson-item-container">
                        <div
                            className={getStyleLesson(lesson)}
                            onClick={() => selectLesson(lesson)}
                        >
                            {lesson.title}
                        </div>
                        {(!!user.admin) ? (
                            <>
                                <MdEdit
                                    className="edit-item"
                                    onClick={() => navigate(lesson._id + "/edit")}
                                />
                                <FiTrash
                                    className="remove-item"
                                    onClick={() => removeLesson(lesson)}
                                />
                            </>
                        ) : null}
                    </div>
                ))
            ) : (
                <div>
                    Aucune leçon pour le moment
                </div>
            )}
            </div>
        </div>
    );
};

export default LessonList;